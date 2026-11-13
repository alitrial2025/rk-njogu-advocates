import App from "./App";
import { practiceAreas } from "./data";
import { ServicePage } from "./ServicePage";

export function RouteContent({ path }: { path: string }) {
  const relative = path.replace(/^\/+|\/+$/g, "");
  if (!relative || relative === "index.html") return <App />;
  const match = /^services\/([a-z-]+)(?:\/index\.html)?$/.exec(relative);
  const area = match && practiceAreas.find((item) => item.id === match[1]);
  if (area) return <ServicePage area={area} />;
  return (
    <main className="not-found container">
      <p className="eyebrow">PAGE NOT FOUND</p>
      <h1>
        Let’s find your <em>next step.</em>
      </h1>
      <p>
        This page is unavailable. Explore the firm’s practice areas or contact
        the team.
      </p>
      <a className="button button-green" href={import.meta.env.BASE_URL}>
        Return to the firm
      </a>
    </main>
  );
}
