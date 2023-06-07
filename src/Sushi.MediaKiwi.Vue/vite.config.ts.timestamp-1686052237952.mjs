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
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxDb2RlXFxcXFN1c2hpLk1lZGlhS2l3aTJcXFxcc3JjXFxcXFN1c2hpLk1lZGlhS2l3aS5WdWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkM6XFxcXENvZGVcXFxcU3VzaGkuTWVkaWFLaXdpMlxcXFxzcmNcXFxcU3VzaGkuTWVkaWFLaXdpLlZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vQzovQ29kZS9TdXNoaS5NZWRpYUtpd2kyL3NyYy9TdXNoaS5NZWRpYUtpd2kuVnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuXHJcbiAgICBkdHMoe1xyXG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgbGliOiB7XHJcbiAgICAgIC8vIENvdWxkIGFsc28gYmUgYSBkaWN0aW9uYXJ5IG9yIGFycmF5IG9mIG11bHRpcGxlIGVudHJ5IHBvaW50c1xyXG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvZnJhbWV3b3JrLnRzXCIpLFxyXG4gICAgICBuYW1lOiBcIm1lZGlha2l3aVZ1ZVwiLFxyXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcInVtZFwiXSxcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBtZWRpYWtpd2ktdnVlLiR7Zm9ybWF0fS5qc2AsXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1widnVlXCJdLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBhc3NldEZpbGVOYW1lcyhhc3NldEluZm8pIHtcclxuICAgICAgICAgIGlmIChhc3NldEluZm8ubmFtZSA9PT0gXCJmcmFtZXdvcmsuY3NzXCIpIHtcclxuICAgICAgICAgICAgcmV0dXJuIFwibWVkaWFraXdpLXZ1ZS5jc3NcIjtcclxuICAgICAgICAgIH1cclxuICAgICAgICAgIHJldHVybiBhc3NldEluZm8ubmFtZSB8fCBcIlwiO1xyXG4gICAgICAgIH0sXHJcbiAgICAgICAgZXhwb3J0czogXCJuYW1lZFwiLFxyXG4gICAgICAgIGdsb2JhbHM6IHtcclxuICAgICAgICAgIHZ1ZTogXCJWdWVcIixcclxuICAgICAgICB9LFxyXG4gICAgICB9LFxyXG4gICAgfSxcclxuICB9LFxyXG4gIHJlc29sdmU6IHtcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLCAvLydAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICBcIkBpbnRlcmZhY2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbW9kZWxzL2ludGVyZmFjZXNcIiksXHJcbiAgICAgIFwiQHNlcnZpY2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvc2VydmljZXNcIiksXHJcbiAgICAgIFwiQG1vZGVsc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL21vZGVsc1wiKSxcclxuICAgICAgXCJAdXRpbHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy91dGlsc1wiKSxcclxuICAgICAgXCJAc3RvcmVzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvc3RvcmVzXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59KTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUE0VSxPQUFPLFVBQVU7QUFDN1YsU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUhoQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFFSixJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxJQUNwQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsY0FBYztBQUFBLElBQ2QsS0FBSztBQUFBO0FBQUEsTUFFSCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUNqRCxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQVcsaUJBQWlCO0FBQUEsSUFDekM7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxLQUFLO0FBQUEsTUFDaEIsUUFBUTtBQUFBLFFBQ04sZUFBZSxXQUFXO0FBQ3hCLGNBQUksVUFBVSxTQUFTLGlCQUFpQjtBQUN0QyxtQkFBTztBQUFBLFVBQ1Q7QUFDQSxpQkFBTyxVQUFVLFFBQVE7QUFBQSxRQUMzQjtBQUFBLFFBQ0EsU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQTtBQUFBLE1BQ3BDLGVBQWUsS0FBSyxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLE1BQ2hFLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQ3JELFdBQVcsS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUNqRCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsV0FBVyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
