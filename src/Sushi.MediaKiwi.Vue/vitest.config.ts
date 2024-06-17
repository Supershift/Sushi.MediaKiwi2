/// <reference types="vitest" />
import { mergeConfig } from "vite";
import { defineConfig } from "vitest/config";
import viteConfig from "./vite.config";

// Merge the current configs with the testing config
export default mergeConfig(
  viteConfig,
  defineConfig({
    test: {
      globals: true,
      environment: "jsdom",
      server: {
        deps: {
          inline: ["vuetify", "i18next", "tysringe"],
        },
      },
      reporters: ["default", "junit"],
      outputFile: {
        junit: "test/unit/coverage/TEST-junit.xml",
      },
      exclude: ["node_modules"],
      coverage: {
        provider: "istanbul",
        reporter: ["text", "json-summary", "json", "html"],
        exclude: ["**/*.vue", "**/*.test.ts", "**/*.spec.ts", "**/*.d.ts", "**/*.cy.ts"],
      },
    },
  })
);
