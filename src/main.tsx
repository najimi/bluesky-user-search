import "./index.css";

import { App } from "./App";
import { Provider } from "@/components/ui/provider";
import { StrictMode } from "react";
import { Theme } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Theme appearance="light">
        <App />
      </Theme>
    </Provider>
  </StrictMode>
);
