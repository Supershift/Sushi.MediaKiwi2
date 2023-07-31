import path from "path";

import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), //'@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    target: "esnext", //browsers can handle the latest ES features
  },
  server: {
    open: "/",
    port: 5173,
  },
});
