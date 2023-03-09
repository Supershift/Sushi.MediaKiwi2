// vitest.config.ts
import { defineConfig as defineConfig2, mergeConfig } from "file:///D:/Codes2/SUSHI-MediaKiwi2.0/Sushi.MediaKiwi2/node_modules/vite/dist/node/index.js";

// vite.config.ts
import path from "path";
import { defineConfig } from "file:///D:/Codes2/SUSHI-MediaKiwi2.0/Sushi.MediaKiwi2/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/Codes2/SUSHI-MediaKiwi2.0/Sushi.MediaKiwi2/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import dts from "file:///D:/Codes2/SUSHI-MediaKiwi2.0/Sushi.MediaKiwi2/src/Sushi.MediaKiwi.Vue/node_modules/vite-plugin-dts/dist/index.mjs";
var __vite_injected_original_dirname = "D:\\Codes2\\SUSHI-MediaKiwi2.0\\Sushi.MediaKiwi2\\src\\Sushi.MediaKiwi.Vue";
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
import path2 from "path";
var __vite_injected_original_dirname2 = "D:\\Codes2\\SUSHI-MediaKiwi2.0\\Sushi.MediaKiwi2\\src\\Sushi.MediaKiwi.Vue";
var vitest_config_default = mergeConfig(vite_config_default, defineConfig2(
  {
    test: {
      globals: true,
      environment: "jsdom",
      alias: {
        "@": path2.resolve(__vite_injected_original_dirname2, "./src"),
        //'@': fileURLToPath(new URL('./src', import.meta.url)),
        "@interfaces": path2.resolve(__vite_injected_original_dirname2, "./src/models/interfaces"),
        "@services": path2.resolve(__vite_injected_original_dirname2, "./src/services"),
        "@models": path2.resolve(__vite_injected_original_dirname2, "./src/models"),
        "@utils": path2.resolve(__vite_injected_original_dirname2, "./src/utils"),
        "@stores": path2.resolve(__vite_injected_original_dirname2, "./src/stores")
      }
    }
  }
));
export {
  vitest_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZXN0LmNvbmZpZy50cyIsICJ2aXRlLmNvbmZpZy50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkQ6XFxcXENvZGVzMlxcXFxTVVNISS1NZWRpYUtpd2kyLjBcXFxcU3VzaGkuTWVkaWFLaXdpMlxcXFxzcmNcXFxcU3VzaGkuTWVkaWFLaXdpLlZ1ZVwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRDpcXFxcQ29kZXMyXFxcXFNVU0hJLU1lZGlhS2l3aTIuMFxcXFxTdXNoaS5NZWRpYUtpd2kyXFxcXHNyY1xcXFxTdXNoaS5NZWRpYUtpd2kuVnVlXFxcXHZpdGVzdC5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Q6L0NvZGVzMi9TVVNISS1NZWRpYUtpd2kyLjAvU3VzaGkuTWVkaWFLaXdpMi9zcmMvU3VzaGkuTWVkaWFLaXdpLlZ1ZS92aXRlc3QuY29uZmlnLnRzXCI7Ly8vIDxyZWZlcmVuY2UgdHlwZXM9XCJ2aXRlc3RcIiAvPlxyXG5pbXBvcnQgeyBkZWZpbmVDb25maWcsIG1lcmdlQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCB2aXRlQ29uZmlnIGZyb20gXCIuL3ZpdGUuY29uZmlnXCI7XHJcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBtZXJnZUNvbmZpZyggdml0ZUNvbmZpZywgZGVmaW5lQ29uZmlnKHtcclxuICB0ZXN0OiB7XHJcbiAgICBnbG9iYWxzOiB0cnVlLFxyXG4gICAgZW52aXJvbm1lbnQ6IFwianNkb21cIixcclxuICAgIGFsaWFzOiB7XHJcbiAgICAgIFwiQFwiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjXCIpLCAvLydAJzogZmlsZVVSTFRvUGF0aChuZXcgVVJMKCcuL3NyYycsIGltcG9ydC5tZXRhLnVybCkpLFxyXG4gICAgICBcIkBpbnRlcmZhY2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbW9kZWxzL2ludGVyZmFjZXNcIiksXHJcbiAgICAgIFwiQHNlcnZpY2VzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvc2VydmljZXNcIiksXHJcbiAgICAgIFwiQG1vZGVsc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL21vZGVsc1wiKSxcclxuICAgICAgXCJAdXRpbHNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy91dGlsc1wiKSxcclxuICAgICAgXCJAc3RvcmVzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvc3RvcmVzXCIpLFxyXG4gICAgfSxcclxuICB9LFxyXG59XHJcbikpIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxDb2RlczJcXFxcU1VTSEktTWVkaWFLaXdpMi4wXFxcXFN1c2hpLk1lZGlhS2l3aTJcXFxcc3JjXFxcXFN1c2hpLk1lZGlhS2l3aS5WdWVcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXENvZGVzMlxcXFxTVVNISS1NZWRpYUtpd2kyLjBcXFxcU3VzaGkuTWVkaWFLaXdpMlxcXFxzcmNcXFxcU3VzaGkuTWVkaWFLaXdpLlZ1ZVxcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovQ29kZXMyL1NVU0hJLU1lZGlhS2l3aTIuMC9TdXNoaS5NZWRpYUtpd2kyL3NyYy9TdXNoaS5NZWRpYUtpd2kuVnVlL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcclxuaW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcclxuaW1wb3J0IHZ1ZSBmcm9tIFwiQHZpdGVqcy9wbHVnaW4tdnVlXCI7XHJcbmltcG9ydCBkdHMgZnJvbSBcInZpdGUtcGx1Z2luLWR0c1wiO1xyXG5cclxuLy8gaHR0cHM6Ly92aXRlanMuZGV2L2NvbmZpZy9cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICB2dWUoKSxcclxuXHJcbiAgICBkdHMoe1xyXG4gICAgICBpbnNlcnRUeXBlc0VudHJ5OiB0cnVlLFxyXG4gICAgfSksXHJcbiAgXSxcclxuICBidWlsZDoge1xyXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxyXG4gICAgbGliOiB7XHJcbiAgICAgIC8vIENvdWxkIGFsc28gYmUgYSBkaWN0aW9uYXJ5IG9yIGFycmF5IG9mIG11bHRpcGxlIGVudHJ5IHBvaW50c1xyXG4gICAgICBlbnRyeTogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCJzcmMvZnJhbWV3b3JrLnRzXCIpLFxyXG4gICAgICBuYW1lOiBcIm1lZGlha2l3aVZ1ZVwiLFxyXG4gICAgICBmb3JtYXRzOiBbXCJlc1wiLCBcInVtZFwiXSxcclxuICAgICAgZmlsZU5hbWU6IChmb3JtYXQpID0+IGBtZWRpYWtpd2ktdnVlLiR7Zm9ybWF0fS5qc2AsXHJcbiAgICB9LFxyXG4gICAgcm9sbHVwT3B0aW9uczoge1xyXG4gICAgICBleHRlcm5hbDogW1widnVlXCJdLFxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICBleHBvcnRzOiBcIm5hbWVkXCIsXHJcbiAgICAgICAgZ2xvYmFsczoge1xyXG4gICAgICAgICAgdnVlOiBcIlZ1ZVwiLFxyXG4gICAgICAgIH0sXHJcbiAgICAgIH0sXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgXCJAXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmNcIiksIC8vJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSksXHJcbiAgICAgIFwiQGludGVyZmFjZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9tb2RlbHMvaW50ZXJmYWNlc1wiKSxcclxuICAgICAgXCJAc2VydmljZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9zZXJ2aWNlc1wiKSxcclxuICAgICAgXCJAbW9kZWxzXCI6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsIFwiLi9zcmMvbW9kZWxzXCIpLFxyXG4gICAgICBcIkB1dGlsc1wiOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCBcIi4vc3JjL3V0aWxzXCIpLFxyXG4gICAgICBcIkBzdG9yZXNcIjogcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgXCIuL3NyYy9zdG9yZXNcIiksXHJcbiAgICB9LFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQ0EsU0FBUyxnQkFBQUEsZUFBYyxtQkFBbUI7OztBQ0RtVyxPQUFPLFVBQVU7QUFDOVosU0FBUyxvQkFBb0I7QUFDN0IsT0FBTyxTQUFTO0FBQ2hCLE9BQU8sU0FBUztBQUhoQixJQUFNLG1DQUFtQztBQU16QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxJQUFJO0FBQUEsSUFFSixJQUFJO0FBQUEsTUFDRixrQkFBa0I7QUFBQSxJQUNwQixDQUFDO0FBQUEsRUFDSDtBQUFBLEVBQ0EsT0FBTztBQUFBLElBQ0wsY0FBYztBQUFBLElBQ2QsS0FBSztBQUFBO0FBQUEsTUFFSCxPQUFPLEtBQUssUUFBUSxrQ0FBVyxrQkFBa0I7QUFBQSxNQUNqRCxNQUFNO0FBQUEsTUFDTixTQUFTLENBQUMsTUFBTSxLQUFLO0FBQUEsTUFDckIsVUFBVSxDQUFDLFdBQVcsaUJBQWlCO0FBQUEsSUFDekM7QUFBQSxJQUNBLGVBQWU7QUFBQSxNQUNiLFVBQVUsQ0FBQyxLQUFLO0FBQUEsTUFDaEIsUUFBUTtBQUFBLFFBQ04sU0FBUztBQUFBLFFBQ1QsU0FBUztBQUFBLFVBQ1AsS0FBSztBQUFBLFFBQ1A7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQTtBQUFBLE1BQ3BDLGVBQWUsS0FBSyxRQUFRLGtDQUFXLHlCQUF5QjtBQUFBLE1BQ2hFLGFBQWEsS0FBSyxRQUFRLGtDQUFXLGdCQUFnQjtBQUFBLE1BQ3JELFdBQVcsS0FBSyxRQUFRLGtDQUFXLGNBQWM7QUFBQSxNQUNqRCxVQUFVLEtBQUssUUFBUSxrQ0FBVyxhQUFhO0FBQUEsTUFDL0MsV0FBVyxLQUFLLFFBQVEsa0NBQVcsY0FBYztBQUFBLElBQ25EO0FBQUEsRUFDRjtBQUNGLENBQUM7OztBRHhDRCxPQUFPQyxXQUFVO0FBSGpCLElBQU1DLG9DQUFtQztBQUt6QyxJQUFPLHdCQUFRLFlBQWEscUJBQVlDO0FBQUEsRUFBYTtBQUFBLElBQ25ELE1BQU07QUFBQSxNQUNKLFNBQVM7QUFBQSxNQUNULGFBQWE7QUFBQSxNQUNiLE9BQU87QUFBQSxRQUNMLEtBQUtDLE1BQUssUUFBUUMsbUNBQVcsT0FBTztBQUFBO0FBQUEsUUFDcEMsZUFBZUQsTUFBSyxRQUFRQyxtQ0FBVyx5QkFBeUI7QUFBQSxRQUNoRSxhQUFhRCxNQUFLLFFBQVFDLG1DQUFXLGdCQUFnQjtBQUFBLFFBQ3JELFdBQVdELE1BQUssUUFBUUMsbUNBQVcsY0FBYztBQUFBLFFBQ2pELFVBQVVELE1BQUssUUFBUUMsbUNBQVcsYUFBYTtBQUFBLFFBQy9DLFdBQVdELE1BQUssUUFBUUMsbUNBQVcsY0FBYztBQUFBLE1BQ25EO0FBQUEsSUFDRjtBQUFBLEVBQ0Y7QUFDQSxDQUFDOyIsCiAgIm5hbWVzIjogWyJkZWZpbmVDb25maWciLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSIsICJkZWZpbmVDb25maWciLCAicGF0aCIsICJfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSJdCn0K
