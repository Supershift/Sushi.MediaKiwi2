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
        junit: "test/coverage/TEST-junit.xml",
      },
      coverage: {
        all: true,
        enabled: true,
        provider: "istanbul",
        reporter: ["text", "cobertura", "html"],
        reportsDirectory: "test/coverage",
        exclude: ["**/*.test.ts", "**/*.spec.ts", "**/*.d.ts"],
      },
    },
  })
);
