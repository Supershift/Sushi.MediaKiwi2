/// <reference types="vitest" />
import { defineConfig, mergeConfig } from 'vite';
import viteConfig from "./vite.config";
import path from "path";

// Merge the current configs with the testing config
export default mergeConfig(viteConfig, defineConfig({
  test: {
    globals: true,
    environment: "jsdom",
  },
}
))