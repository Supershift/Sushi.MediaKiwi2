import path from "path";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vuetify from "vite-plugin-vuetify";
import typescript2 from 'rollup-plugin-typescript2';
import dts from "vite-plugin-dts";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(), 
    vuetify({ autoImport: true }),
    dts({
      insertTypesEntry: true,
    }),
    typescript2({
      check: false,
      include: [
        "src/components/**/*.vue",
        "src/**/*.ts",
      ],
      tsconfigOverride: {
        compilerOptions: {
          outDir: "dist",
          sourceMap: true,
          declaration: true,
          declarationMap: true,
        },
      },
      exclude: ["vite.config.ts"]
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__dirname, "src/framework.ts"),
      name: 'mediakiwiVue',
      formats: ["es", "cjs", "umd"],
      fileName: format => `mediakiwi-vue.${format}.js`
    },
    rollupOptions: {
      // make sure to externalize deps that should not be bundled
      // into your library
      input: {
        main: path.resolve(__dirname, "src/framework.ts")
      },
      external: ['vue'],
      output: {
        // assetFileNames: (assetInfo) => {
        //   if (assetInfo.name === 'main.css') return 'mediakiwi-vue.css';
        //   return assetInfo.name;
        // },
        exports: "named",
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"), //'@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
