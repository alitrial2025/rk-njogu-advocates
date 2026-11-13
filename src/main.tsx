import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-500.css";
import "@fontsource/inter/latin-600.css";
import { RouteContent } from "./RouteContent";
import "./styles.css";
import "./editorial.css";
import "./motion.css";
import "./refinements.css";
import "./services.css";

const root = document.getElementById("root")!;
const base = import.meta.env.BASE_URL;
const path = window.location.pathname.startsWith(base)
  ? window.location.pathname.slice(base.length)
  : window.location.pathname;
const content = (
  <React.StrictMode>
    <RouteContent path={path} />
  </React.StrictMode>
);
if (root.hasChildNodes()) ReactDOM.hydrateRoot(root, content);
else ReactDOM.createRoot(root).render(content);
