import "./index.css";

import { App } from "./App";
// import { BlueskyLink } from "@/components/bluesky-link";
import { Provider } from "@/components/ui/provider";
import { StrictMode } from "react";
import { Theme } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Theme
        className="wrapper"
        appearance="light"
        maxW="5xl"
        background="#f7fbff"
      >
        <App />
      </Theme>
      {/* <BlueskyLink /> */}
    </Provider>
  </StrictMode>
);
