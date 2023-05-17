// vitest.config.ts
import { mergeConfig } from "file:///C:/Code/Sushi.MediaKiwi2/node_modules/vite/dist/node/index.js";
import { defineConfig as defineConfig2 } from "file:///C:/Code/Sushi.MediaKiwi2/src/Sushi.MediaKiwi.Vue/node_modules/vitest/dist/config.js";

// vite.config.ts
import path from "path";
import { defineConfig } from "file:///C:/Code/Sushi.MediaKiwi2/node_modules/vite/dist/node/index.js";
import vue from "file:///C:/Code/Sushi.MediaKiwi2/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///C:/Code/Sushi.MediaKiwi2/src/Sushi.MediaKiwi.Vue/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Code\\Sushi.MediaKiwi2\\src\\Sushi.MediaKiwi.Vue";
var vite_config_default = defineConfig({
  plugins: [
    vue(),
    dts({
      insertTypesEntry: true
    })
  ],
  build: {
    cssCodeSplit: true,
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: path.resolve(__vite_injected_original_dirname, "src/framework.ts"),
      name: "mediakiwiVue",
      formats: ["es", "umd"],
      fileName: (format) => `mediakiwi-vue.${format}.js`
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
          vue: "Vue"
        }
      }
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src"),
      //'@': fileURLToPath(new URL('./src', import.meta.url)),
      "@interfaces": path.resolve(__vite_injected_original_dirname, "./src/models/interfaces"),
      "@services": path.resolve(__vite_injected_original_dirname, "./src/services"),
      "@models": path.resolve(__vite_injected_original_dirname, "./src/models"),
      "@utils": path.resolve(__vite_injected_original_dirname, "./src/utils"),
      "@stores": path.resolve(__vite_injected_original_dirname, "./src/stores")
    }
  }
});

// vitest.config.ts
var vitest_config_default = mergeConfig(
  vite_config_default,
  defineConfig2({
    test: {
      globals: true,
      environment: "jsdom"
    }
  })
);
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkM6XFxcXENvZGVcXFxcU3VzaGkuTWVkaWFLaXdpMlxcXFxzcmNcXFxcU3VzaGkuTWVkaWFLaXdpLlZ1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcQ29kZVxcXFxTdXNoaS5NZWRpYUtpd2kyXFxcXHNyY1xcXFxTdXNoaS5NZWRpYUtpd2kuVnVlXFxcXHZpdGVzdC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L0NvZGUvU3VzaGkuTWVkaWFLaXdpMi9zcmMvU3VzaGkuTWVkaWFLaXdpLlZ1ZS92aXRlc3QuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5pbXBvcnQgeyBtZXJnZUNvbmZpZyB9IGZyb20gXCJ2aXRlXCI7XHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gXCJ2aXRlc3QvY29uZmlnXCI7XHJcbmltcG9ydCB2aXRlQ29uZmlnIGZyb20gXCIuL3ZpdGUuY29uZmlnXCI7XHJcblxyXG4vLyBNZXJnZSB0aGUgY3VycmVudCBjb25maWdzIHdpdGggdGhlIHRlc3RpbmcgY29uZmlnXHJcbmV4cG9ydCBkZWZhdWx0IG1lcmdlQ29uZmlnKFxyXG4gIHZpdGVDb25maWcsXHJcbiAgZGVmaW5lQ29uZmlnKHtcclxuICAgIHRlc3Q6IHtcclxuICAgICAgZ2xvYmFsczogdHJ1ZSxcclxuICAgICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcclxuICAgIH0sXHJcbiAgfSlcclxuKTtcclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDb2RlXFxcXFN1c2hpLk1lZGlhS2l3aTJcXFxcc3JjXFxcXFN1c2hpLk1lZGlhS2l3aS5WdWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXENvZGVcXFxcU3VzaGkuTWVkaWFLaXdpMlxcXFxzcmNcXFxcU3VzaGkuTWVkaWFLaXdpLlZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovQ29kZS9TdXNoaS5NZWRpYUtpd2kyL3NyYy9TdXNoaS5NZWRpYUtpd2kuVnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuXHJcbiAgICBkdHMoe1xyXG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgbGliOiB7XHJcbiAgICAgIC8vIENvdWxkIGFsc28gYmUgYSBkaWN0aW9uYXJ5IG9yIGFycmF5IG9mIG11bHRpcGxlIGVudHJ5IHBvaW50c1xyXG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvZnJhbWV3b3JrLnRzXCIpLFxyXG4gICAgICBuYW1lOiBcIm1lZGlha2l3aVZ1ZVwiLFxyXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcInVtZFwiXSxcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBtZWRpYWtpd2ktdnVlLiR7Zm9ybWF0fS5qc2AsXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1widnVlXCJdLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBhc3NldEZpbGVOYW1lcyhhc3NldEluZm8pIHtcclxuICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSA9PT0gXCJmcmFtZXdvcmsuY3NzXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWVkaWFraXdpLXZ1ZS5jc3NcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBhc3NldEluZm8ubmFtZSB8fCBcIlwiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXhwb3J0czogXCJuYW1lZFwiLFxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHZ1ZTogXCJWdWVcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLCAvLydAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICBcIkBpbnRlcmZhY2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbW9kZWxzL2ludGVyZmFjZXNcIiksXHJcbiAgICAgIFwiQHNlcnZpY2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvc2VydmljZXNcIiksXHJcbiAgICAgIFwiQG1vZGVsc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL21vZGVsc1wiKSxcclxuICAgICAgXCJAdXRpbHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy91dGlsc1wiKSxcclxuICAgICAgXCJAc3RvcmVzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvc3RvcmVzXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUNBLFNBQVMsbUJBQW1CO0FBQzVCLFNBQVMsZ0JBQUFBLHFCQUFvQjs7O0FDRitTLE9BQU8sVUFBVTtBQUM3VixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBSGhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUVKLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxjQUFjO0FBQUEsSUFDZCxLQUFLO0FBQUE7QUFBQSxNQUVILE9BQU8sS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQ2pELE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixVQUFVLENBQUMsV0FBVyxpQkFBaUI7QUFBQSxJQUN6QztBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLEtBQUs7QUFBQSxNQUNoQixRQUFRO0FBQUEsUUFDTixlQUFlLFdBQVc7QUFDeEIsY0FBSSxVQUFVLFNBQVMsaUJBQWlCO0FBQ3RDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGlCQUFPLFVBQVUsUUFBUTtBQUFBLFFBQzNCO0FBQUEsUUFDQSxTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUEsUUFDUDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBO0FBQUEsTUFDcEMsZUFBZSxLQUFLLFFBQVEsa0NBQVcseUJBQXlCO0FBQUEsTUFDaEUsYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDckQsV0FBVyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ2pELFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMvQyxXQUFXLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsSUFDbkQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzs7O0FEM0NELElBQU8sd0JBQVE7QUFBQSxFQUNiO0FBQUEsRUFDQUMsY0FBYTtBQUFBLElBQ1gsTUFBTTtBQUFBLE1BQ0osU0FBUztBQUFBLE1BQ1QsYUFBYTtBQUFBLElBQ2Y7QUFBQSxFQUNGLENBQUM7QUFDSDsiLAogICJuYW1lcyI6IFsiZGVmaW5lQ29uZmlnIiwgImRlZmluZUNvbmZpZyJdCn0K
