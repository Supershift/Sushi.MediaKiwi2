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
        junit: "coverage/TEST-junit.xml",
      },
      coverage: {
        provider: "istanbul",
        reporter: ["text", "cobertura"],
        reportsDirectory: "coverage",
      },
    },
  })
);
