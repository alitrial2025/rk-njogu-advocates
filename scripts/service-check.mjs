// Independent expected routes and preparation anchors; do not import app data.
const services = [
  [
    "personal-injury",
    "Personal and Workplace Injury Claims",
    "Medical reports",
  ],
  ["legal-advisory", "General Legal Services & Advisory", "draft documents"],
  ["land-property", "Land, Property & Conveyancing", "Property reference"],
  ["criminal-defence", "Criminal Law & Defence", "summons, charge sheet"],
  ["family-law", "Family Law", "marriage or family records"],
  [
    "corporate-company",
    "Corporate & Company Secretarial Services",
    "registration details",
  ],
  ["employment-labour", "Employment & Labour Law", "Employment contract"],
  [
    "succession-estates",
    "Succession, Probate & Estate Planning",
    "existing will",
  ],
  [
    "debt-commercial",
    "Debt Recovery & Commercial Disputes",
    "Invoices and delivery",
  ],
];
export async function serviceChecks({
  browser,
  baseURL,
  check,
  expect,
  accessibility,
  report,
}) {
  const root = baseURL.replace(/[#?].*$/, "").replace(/\/?$/, "/");
  const canonicalRoot = "https://alitrial2025.github.io/rk-njogu-advocates/";
  const noJS = await browser.newContext({ javaScriptEnabled: false });
  const staticPage = await noJS.newPage();
  for (const [id, title, preparation] of services) {
    await check(
      `static service: ${id} is directly readable without JavaScript`,
      async () => {
        const response = await staticPage.goto(`${root}services/${id}/`);
        expect(
          response?.status() === 200,
          "Direct service URL does not return HTTP 200",
        );
        expect(
          (await staticPage.getByRole("heading", { level: 1 }).innerText()) ===
            title,
          "Page has the wrong service heading",
        );
        expect(
          (await staticPage.title()).startsWith(`${title} in Kenya`),
          "Service title is not specific",
        );
        const canonical = `${canonicalRoot}services/${id}/`;
        expect(
          (await staticPage
            .locator('link[rel="canonical"]')
            .getAttribute("href")) === canonical,
          "Service canonical is incorrect",
        );
        expect(
          (await staticPage
            .locator('meta[property="og:url"]')
            .getAttribute("content")) === canonical,
          "Social URL is not service-specific",
        );
        expect(
          (
            await staticPage
              .locator('meta[name="description"]')
              .getAttribute("content")
          ).length > 60,
          "Service description is missing",
        );
        const schemas = (
          await staticPage
            .locator('script[type="application/ld+json"]')
            .allTextContents()
        ).flatMap((text) => {
          const schema = JSON.parse(text);
          return schema["@graph"] ?? [schema];
        });
        expect(
          schemas.some(
            (schema) =>
              schema["@type"] === "Service" &&
              schema.name === title &&
              schema.url === canonical,
          ),
          "Service structured data is missing",
        );
        expect(
          schemas.some(
            (schema) =>
              schema["@type"] === "BreadcrumbList" &&
              schema.itemListElement.length === 3,
          ),
          "Service breadcrumbs are missing",
        );
        const content = await staticPage.locator("#main").innerText();
        expect(
          content.includes(preparation) &&
            content.includes("What happens next?"),
          "Practical service content requires JavaScript",
        );
        expect(
          (await staticPage.getByRole("checkbox").count()) === 5,
          "Tailored preparation is absent from the HTML",
        );
        expect(
          (await staticPage.locator(".scope-list li").count()) >= 3,
          "Full service scope is missing",
        );
        await staticPage.locator(".preparation-questions summary").click();
        expect(
          (await staticPage.locator(".preparation-questions li").count()) === 3,
          "Service-specific meeting questions are missing",
        );
      },
    );
  }
  await check(
    "static pages: homepage links and sitemap discover every service",
    async () => {
      await staticPage.goto(root);
      const hrefs = await staticPage
        .locator("#practice h3 a")
        .evaluateAll((links) => links.map((link) => link.href));
      for (const [id] of services)
        expect(
          hrefs.includes(`${root}services/${id}/`),
          `Home does not link to ${id}`,
        );
      const response = await staticPage.request.get(`${root}sitemap.xml`);
      expect(response.status() === 200, "Sitemap is unavailable");
      const xml = await response.text();
      expect(
        (xml.match(/<loc>/g) ?? []).length === 10,
        "Sitemap must contain home and nine services",
      );
      for (const [id] of services)
        expect(
          xml.includes(`${canonicalRoot}services/${id}/`),
          `Sitemap omits ${id}`,
        );
    },
  );
  await noJS.close();

  for (const width of [1440, 390]) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await context.newPage();
    page.on("pageerror", (error) =>
      report.errors.push({ label: `service-${width}`, error: error.message }),
    );
    page.on("console", (message) => {
      if (message.type() === "error")
        report.errors.push({
          label: `service-${width} console`,
          error: message.text(),
        });
    });
    for (const [id, title, preparation] of services) {
      await check(
        `${width}px service: ${id} hydrates with its selected matter`,
        async () => {
          await page.goto(`${root}services/${id}/`, {
            waitUntil: "networkidle",
          });
          expect(
            (await page.getByRole("heading", { level: 1 }).innerText()) ===
              title,
            "Hydration changed the service content",
          );
          expect(
            (await page
              .getByLabel("Prepare for", { exact: true })
              .inputValue()) === id,
            "Checklist defaults to another matter",
          );
          expect(
            (await page
              .getByLabel("Practice area", { exact: true })
              .inputValue()) === id,
            "Enquiry does not default to this service",
          );
          expect(
            (await page.locator(".preparation-checklist").innerText()).includes(
              preparation,
            ),
            "Tailored checklist is missing",
          );
          await page.getByRole("checkbox").first().check();
          expect(
            (await page.locator("progress").getAttribute("value")) === "1",
            "Prerendered preparation is not interactive",
          );
          const overflow = await page.evaluate(
            () => document.documentElement.scrollWidth - innerWidth,
          );
          expect(overflow <= 1, `Service content overflows by ${overflow}px`);
        },
      );
    }
    await page.goto(`${root}services/land-property/`, {
      waitUntil: "networkidle",
    });
    await accessibility(page, `service-${width}: property page`);
    await check(
      `${width}px service: reload and browser navigation preserve direct URLs`,
      async () => {
        await page.reload({ waitUntil: "networkidle" });
        expect(
          (await page
            .getByLabel("Practice area", { exact: true })
            .inputValue()) === "land-property",
          "Reload lost service selection",
        );
        await page
          .locator(".related-service-links a")
          .filter({ hasText: "Family Law" })
          .click();
        await page.waitForURL(`${root}services/family-law/`);
        await page.waitForLoadState("networkidle");
        expect(
          (await page.getByRole("heading", { level: 1 }).innerText()) ===
            "Family Law",
          "Related service navigation failed",
        );
        await page.goBack({ waitUntil: "networkidle" });
        expect(
          (await page.getByRole("heading", { level: 1 }).innerText()) ===
            "Land, Property & Conveyancing",
          "Back did not return to property",
        );
      },
    );
    if (width === 390)
      await check(
        "service mobile: menu opens, closes on navigation and supports Escape",
        async () => {
          const menu = page.getByRole("button", {
            name: "Open menu",
            exact: true,
          });
          await menu.click();
          expect(
            (await page
              .getByRole("button", { name: "Close menu", exact: true })
              .getAttribute("aria-expanded")) === "true",
            "Service menu did not open",
          );
          await page.keyboard.press("Tab");
          await page.keyboard.press("Escape");
          expect(
            (await menu.getAttribute("aria-expanded")) === "false",
            "Escape did not close service navigation",
          );
          await menu.click();
          await page
            .locator("header")
            .getByRole("link", { name: "Let’s talk", exact: true })
            .click();
          expect(
            (await menu.getAttribute("aria-expanded")) === "false" &&
              new URL(page.url()).hash === "#consultation",
            "Contact navigation did not close the menu",
          );
        },
      );
    await check(
      `${width}px service: WhatsApp review rejects blank or whitespace-only entries`,
      async () => {
        const form = page.locator("#consultation form");
        await form
          .getByRole("button", { name: "Review WhatsApp enquiry", exact: true })
          .click();
        expect(
          (await page.locator(".whatsapp-preview").count()) === 0,
          "Empty form produced a review",
        );
        await form.getByLabel("Your name").fill("   ");
        await form.getByLabel("How can we help?").fill("   ");
        await form
          .getByRole("button", { name: "Review WhatsApp enquiry", exact: true })
          .click();
        expect(
          (await page.locator(".whatsapp-preview").count()) === 0 &&
            (await form.evaluate((element) => !element.checkValidity())),
          "Whitespace passes validation",
        );
      },
    );
    await check(
      `${width}px service: WhatsApp handoff preserves reviewed text and requires sending in the chat`,
      async () => {
        const form = page.locator("#consultation form");
        await form.getByLabel("Your name").fill("Test Wanjikũ + Co");
        await form
          .getByLabel("Preferred consultation time")
          .fill("Tuesday 2 pm EAT");
        await form
          .getByLabel("How can we help?")
          .fill(
            "Property consultation: title & lease + questions.\nPlease discuss options.",
          );
        await form
          .getByRole("button", { name: "Review WhatsApp enquiry", exact: true })
          .click();
        const preview = page.locator(".whatsapp-preview");
        const text = await preview.locator("pre").innerText();
        const link = preview.getByRole("link", {
          name: "Continue to WhatsApp",
          exact: true,
        });
        const url = new URL(await link.getAttribute("href"));
        expect(
          url.origin === "https://wa.me" && url.pathname === "/254704652614",
          "Wrong WhatsApp destination",
        );
        expect(
          url.searchParams.get("text") === text,
          "Reviewed text changed during WhatsApp encoding",
        );
        for (const value of [
          "Land, Property & Conveyancing",
          "Test Wanjikũ + Co",
          "Tuesday 2 pm EAT",
          "title & lease + questions.\nPlease discuss options.",
        ])
          expect(text.includes(value), `Message lost ${value}`);
        await accessibility(page, `service-${width}: enquiry review`);
        // Intercept the handoff: never send a test request or message to the firm.
        await context.route("https://wa.me/**", (route) =>
          route.fulfill({
            status: 200,
            contentType: "text/html",
            body: "<title>Intercepted WhatsApp handoff</title><p>Browser test only. No message sent.</p>",
          }),
        );
        const popupPromise = context.waitForEvent("page");
        await link.click();
        const popup = await popupPromise;
        await popup.waitForLoadState("domcontentloaded");
        expect(
          new URL(popup.url()).searchParams.get("text") === text,
          "Handoff opened the wrong URL",
        );
        await popup.close();
        expect(
          (await preview.innerText()).includes(
            "Next step: send your enquiry in WhatsApp.",
          ),
          "Handoff lacks the send-in-chat step",
        );
        expect(
          !/successfully sent|we have received|appointment confirmed/i.test(
            await preview.innerText(),
          ),
          "Website invents delivery or appointment confirmation",
        );
        await form.getByLabel("Preferred consultation time").fill("Wednesday");
        expect(
          (await preview.count()) === 0,
          "Editing leaves a stale WhatsApp message",
        );
      },
    );
    await check(
      `${width}px service: changing the matter clears the review and updates preparation`,
      async () => {
        const form = page.locator("#consultation form");
        await form
          .getByRole("button", { name: "Review WhatsApp enquiry", exact: true })
          .click();
        expect(
          (await page.locator(".whatsapp-preview").count()) === 1,
          "Review missing before matter switch",
        );
        await form
          .getByLabel("Practice area", { exact: true })
          .selectOption("family-law");
        expect(
          (await page.locator(".whatsapp-preview").count()) === 0,
          "Matter switch leaves stale WhatsApp link",
        );
        expect(
          (await page
            .getByLabel("Prepare for", { exact: true })
            .inputValue()) === "family-law",
          "Matter switch did not update checklist",
        );
        expect(
          (await page.locator(".preparation-checklist").innerText()).includes(
            "marriage or family records",
          ),
          "Switched preparation is not specific",
        );
      },
    );
    await page
      .getByLabel("Practice area", { exact: true })
      .selectOption("land-property");
    await page.evaluate(() => scrollTo({ top: 0, behavior: "instant" }));
    await page.screenshot({
      path: `${process.cwd()}/artifacts/service-property-${width}.png`,
      fullPage: true,
    });
    await context.close();
  }
}
