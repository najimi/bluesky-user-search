import "./index.css";

import * as Sentry from "@sentry/react";

import { App } from "./App";
import { BlueskyLink } from "@/components/bluesky-link";
import { Provider } from "@/components/ui/provider";
import { StrictMode } from "react";
import { Theme } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";

Sentry.init({
  dsn: "https://e85975005f8b2da1837475a4832751bd@o4508348275228672.ingest.de.sentry.io/4508348280012880",
  integrations: [
    Sentry.browserTracingIntegration(),
    Sentry.replayIntegration(),
  ],
  // Tracing
  tracesSampleRate: 1.0, //  Capture 100% of the transactions
  // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
  tracePropagationTargets: [
    "localhost",
    /^https:\/\/bluesky-user-search\.netlify\.app/,
  ],
  // Session Replay
  replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
  replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider>
      <Theme
        className="wrapper"
        appearance="light"
        maxW="5xl"
        background="#f7fbff"
        backgroundImage="linear-gradient(150deg, #fff 0%, #d3ecfb 100%) !important"
      >
        <App />
      </Theme>
      <BlueskyLink />
    </Provider>
  </StrictMode>
);
