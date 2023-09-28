// vite.config.ts
import { resolve } from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  plugins: [dts()],
  resolve: {
    alias: {
      "@": resolve(__dirname, "./src"), //'@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "mediakiwi-azure-function",
      fileName: "mediakiwi-azure-function",
    },
  },
});
