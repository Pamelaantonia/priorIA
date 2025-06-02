import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Auth0Provider } from "@auth0/auth0-react";
import "./index.css";
import App from "./App.jsx";

const domain = "dev-xru4wyffn3u5sgw7.us.auth0.com";     // <- reemplaza con tu valor real
const clientId = "dwp1Bbojf312ChLRjscKs5zEiEiu68ox";           // <- reemplaza con tu valor real

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Auth0Provider
      domain={domain}
      clientId={clientId}
      authorizationParams={{
        redirect_uri: window.location.origin,
      }}
    >
      <App />
    </Auth0Provider>
  </StrictMode>
);
