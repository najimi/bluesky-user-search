import { sentryVitePlugin } from "@sentry/vite-plugin";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import browserslist from "browserslist";
import { browserslistToTargets } from "lightningcss";

import react from "@vitejs/plugin-react-swc";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "frontendirish",
      project: "javascript-react",
    }),
  ],

  css: {
    transformer: "lightningcss",
    lightningcss: {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call
      targets: browserslistToTargets(browserslist(">= 0.25%")),
    },
  },

  build: {
    cssMinify: "lightningcss",
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (
              id.includes("@chakra-ui/react") ||
              id.includes("@emotion/react")
            ) {
              return "chakra";
            }
            if (id.includes("recat-icons")) {
              return "icons";
            }
            if (id.includes("motion")) {
              return "motion";
            }
            if (id.includes("@sentry")) {
              return "sentry";
            }
            if (id.includes("zustand")) {
              return "zustand";
            }

            return "vendor";
          }
        },
      },
    },
  },
});
