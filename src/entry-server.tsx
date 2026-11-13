import { renderToString } from "react-dom/server";
import { RouteContent } from "./RouteContent";
export function render(path: string) {
  return renderToString(<RouteContent path={path} />);
}
export { practiceAreas } from "./data";
export { siteURL, serviceGuidance } from "./serviceData";
