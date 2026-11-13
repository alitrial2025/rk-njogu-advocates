import { build } from "vite";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

const temporary = resolve(".prerender");
try {
  await build({
    build: {
      ssr: "src/entry-server.tsx",
      outDir: temporary,
      emptyOutDir: true,
      rolldownOptions: { output: { entryFileNames: "entry-server.mjs" } },
    },
  });
  const { render, practiceAreas, siteURL } = await import(
    pathToFileURL(resolve(temporary, "entry-server.mjs")).href
  );
  const template = await readFile("dist/index.html", "utf8");
  const escape = (value) =>
    value
      .replaceAll("&", "&amp;")
      .replaceAll('"', "&quot;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");
  function pageHTML(path, title, description, canonical, structuredData) {
    let html = template
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${escape(title)}</title>`)
      .replace(
        /(<meta\s+name="description"\s+content=")[^"]*(")/,
        `$1${escape(description)}$2`,
      )
      .replace(
        /(<meta\s+property="og:title"\s+content=")[^"]*(")/,
        `$1${escape(title)}$2`,
      )
      .replace(
        /(<meta\s+property="og:description"\s+content=")[^"]*(")/,
        `$1${escape(description)}$2`,
      )
      .replace(/(<link\s+rel="canonical"\s+href=")[^"]*(")/, `$1${canonical}$2`)
      .replace(
        /(<meta\s+property="og:url"\s+content=")[^"]*(")/,
        `$1${canonical}$2`,
      )
      .replace('<div id="root"></div>', `<div id="root">${render(path)}</div>`);
    if (structuredData)
      html = html.replace(
        "</head>",
        `<script type="application/ld+json">${JSON.stringify(structuredData).replaceAll("<", "\\u003c")}</script></head>`,
      );
    return html;
  }
  // Pre-render home as well so crawlers can discover actual service links.
  await writeFile(
    "dist/index.html",
    template.replace(
      '<div id="root"></div>',
      `<div id="root">${render("")}</div>`,
    ),
  );
  const urls = [siteURL];
  for (const area of practiceAreas) {
    const path = `services/${area.id}/`;
    const canonical = new URL(path, siteURL).href;
    const structuredData = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "Service",
          name: area.title,
          description: area.summary,
          url: canonical,
          areaServed: ["Nairobi", "Machakos", "Kenya"],
          provider: {
            "@type": "LegalService",
            name: "R. K. Njogu & Company Advocates",
            url: siteURL,
          },
        },
        {
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteURL },
            {
              "@type": "ListItem",
              position: 2,
              name: "Practice areas",
              item: `${siteURL}#practice`,
            },
            {
              "@type": "ListItem",
              position: 3,
              name: area.shortTitle,
              item: canonical,
            },
          ],
        },
      ],
    };
    const directory = resolve("dist", path);
    await mkdir(directory, { recursive: true });
    await writeFile(
      resolve(directory, "index.html"),
      pageHTML(
        path,
        `${area.title} in Kenya | R. K. Njogu Advocates`,
        area.summary,
        canonical,
        structuredData,
      ),
    );
    urls.push(canonical);
  }
  await writeFile(
    "dist/sitemap.xml",
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${escape(url)}</loc></url>`).join("\n")}\n</urlset>\n`,
  );
  const notFound = pageHTML(
    "not-found",
    "Page not found | R. K. Njogu Advocates",
    "Explore legal services or contact R. K. Njogu & Company Advocates.",
    siteURL,
  ).replace("</head>", '<meta name="robots" content="noindex"></head>');
  await writeFile("dist/404.html", notFound);
  console.log(
    `Pre-rendered home and ${practiceAreas.length} service pages; sitemap generated.`,
  );
} finally {
  await rm(temporary, { recursive: true, force: true });
}
