// vite.config.ts
import path from "path";
import { defineConfig } from "file:///C:/Code/Sushi.MediaKiwi2/src/Sushi.MediaKiwi.Vue/node_modules/vite/dist/node/index.js";
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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDb2RlXFxcXFN1c2hpLk1lZGlhS2l3aTJcXFxcc3JjXFxcXFN1c2hpLk1lZGlhS2l3aS5WdWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXENvZGVcXFxcU3VzaGkuTWVkaWFLaXdpMlxcXFxzcmNcXFxcU3VzaGkuTWVkaWFLaXdpLlZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovQ29kZS9TdXNoaS5NZWRpYUtpd2kyL3NyYy9TdXNoaS5NZWRpYUtpd2kuVnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuICAgIGR0cyh7XHJcbiAgICAgIGluc2VydFR5cGVzRW50cnk6IHRydWUsXHJcbiAgICB9KSxcclxuICBdLFxyXG4gIGJ1aWxkOiB7XHJcbiAgICBjc3NDb2RlU3BsaXQ6IHRydWUsXHJcbiAgICBsaWI6IHtcclxuICAgICAgLy8gQ291bGQgYWxzbyBiZSBhIGRpY3Rpb25hcnkgb3IgYXJyYXkgb2YgbXVsdGlwbGUgZW50cnkgcG9pbnRzXHJcbiAgICAgIGVudHJ5OiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcInNyYy9mcmFtZXdvcmsudHNcIiksXHJcbiAgICAgIG5hbWU6IFwibWVkaWFraXdpVnVlXCIsXHJcbiAgICAgIGZvcm1hdHM6IFtcImVzXCIsIFwidW1kXCJdLFxyXG4gICAgICBmaWxlTmFtZTogKGZvcm1hdCkgPT4gYG1lZGlha2l3aS12dWUuJHtmb3JtYXR9LmpzYCxcclxuICAgIH0sXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGV4dGVybmFsOiBbXCJ2dWVcIl0sXHJcbiAgICAgIG91dHB1dDoge1xyXG4gICAgICAgIGFzc2V0RmlsZU5hbWVzKGFzc2V0SW5mbykge1xyXG4gICAgICAgICAgaWYgKGFzc2V0SW5mby5uYW1lID09PSBcImZyYW1ld29yay5jc3NcIikge1xyXG4gICAgICAgICAgICByZXR1cm4gXCJtZWRpYWtpd2ktdnVlLmNzc1wiO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgcmV0dXJuIGFzc2V0SW5mby5uYW1lIHx8IFwiXCI7XHJcbiAgICAgICAgfSxcclxuICAgICAgICBleHBvcnRzOiBcIm5hbWVkXCIsXHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgdnVlOiBcIlZ1ZVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksIC8vJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgIFwiQGludGVyZmFjZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9tb2RlbHMvaW50ZXJmYWNlc1wiKSxcclxuICAgICAgXCJAc2VydmljZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9zZXJ2aWNlc1wiKSxcclxuICAgICAgXCJAbW9kZWxzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbW9kZWxzXCIpLFxyXG4gICAgICBcIkB1dGlsc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL3V0aWxzXCIpLFxyXG4gICAgICBcIkBzdG9yZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9zdG9yZXNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQTRVLE9BQU8sVUFBVTtBQUM3VixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFNBQVM7QUFDaEIsT0FBTyxTQUFTO0FBSGhCLElBQU0sbUNBQW1DO0FBTXpDLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLElBQUk7QUFBQSxJQUNKLElBQUk7QUFBQSxNQUNGLGtCQUFrQjtBQUFBLElBQ3BCLENBQUM7QUFBQSxFQUNIO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxjQUFjO0FBQUEsSUFDZCxLQUFLO0FBQUE7QUFBQSxNQUVILE9BQU8sS0FBSyxRQUFRLGtDQUFXLGtCQUFrQjtBQUFBLE1BQ2pELE1BQU07QUFBQSxNQUNOLFNBQVMsQ0FBQyxNQUFNLEtBQUs7QUFBQSxNQUNyQixVQUFVLENBQUMsV0FBVyxpQkFBaUI7QUFBQSxJQUN6QztBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsVUFBVSxDQUFDLEtBQUs7QUFBQSxNQUNoQixRQUFRO0FBQUEsUUFDTixlQUFlLFdBQVc7QUFDeEIsY0FBSSxVQUFVLFNBQVMsaUJBQWlCO0FBQ3RDLG1CQUFPO0FBQUEsVUFDVDtBQUNBLGlCQUFPLFVBQVUsUUFBUTtBQUFBLFFBQzNCO0FBQUEsUUFDQSxTQUFTO0FBQUEsUUFDVCxTQUFTO0FBQUEsVUFDUCxLQUFLO0FBQUEsUUFDUDtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBO0FBQUEsTUFDcEMsZUFBZSxLQUFLLFFBQVEsa0NBQVcseUJBQXlCO0FBQUEsTUFDaEUsYUFBYSxLQUFLLFFBQVEsa0NBQVcsZ0JBQWdCO0FBQUEsTUFDckQsV0FBVyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLE1BQ2pELFVBQVUsS0FBSyxRQUFRLGtDQUFXLGFBQWE7QUFBQSxNQUMvQyxXQUFXLEtBQUssUUFBUSxrQ0FBVyxjQUFjO0FBQUEsSUFDbkQ7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
