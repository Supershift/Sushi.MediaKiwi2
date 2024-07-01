import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), vuetify()],
  publicDir: path.resolve(__dirname, "sample/public"),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "@sample": path.resolve(__dirname, "./sample"),
    },
  },
  build: {
    target: "esnext", //browsers can handle the latest ES features
    outDir: path.resolve(__dirname, "sampleweb"),
  },
  server: {
    open: "/",
    port: 5173,
  },
});
