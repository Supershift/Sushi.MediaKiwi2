import path from "path";
import { defineConfig } from "vite";
import vuetify from "vite-plugin-vuetify";
import vue from "@vitejs/plugin-vue";
import dts from "vite-plugin-dts";
import istanbul from "vite-plugin-istanbul";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true,
    }),
    vuetify({
      autoImport: true,
      styles: {
        // Generate a custom settings.scss file with all your modifications to override sass variables from vuetify
        configFile: path.resolve(__dirname, "./src/styles/settings.scss"),
      },
    }),
    istanbul({
      include: "src/*",
      exclude: ["node_modules", "dist", "cypress", "**/__tests__/**"],
      extension: [".js", ".ts", ".vue"],
      requireEnv: false,
      cypress: true,
    }),
  ],
  build: {
    sourcemap: "hidden",
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, "src/framework.ts"),
      name: "mediakiwiVue",
      formats: ["es", "umd"],
      fileName: (format) => `mediakiwi-vue.${format}.js`,
    },
    rollupOptions: {
      external: ["vue"],
      output: {
        assetFileNames(assetInfo) {
          if (assetInfo.name === "framework.css") {
            return "mediakiwi-vue.css";
          }
          return assetInfo.name || "";
        },
        exports: "named",
        globals: {
          vue: "Vue",
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), //'@': fileURLToPath(new URL('./src', import.meta.url)),
      "@test": path.resolve(__dirname, "./test"),
      "@interfaces": path.resolve(__dirname, "./src/models/interfaces"),
      "@services": path.resolve(__dirname, "./src/services"),
      "@models": path.resolve(__dirname, "./src/models"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@stores": path.resolve(__dirname, "./src/stores"),
    },
  },
});
