import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "../../client/src/index.css";
import "../../client/src/styles/admin.css";
import App from "../../client/src/apps/AdminApp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App basename="/" />
  </StrictMode>
);
