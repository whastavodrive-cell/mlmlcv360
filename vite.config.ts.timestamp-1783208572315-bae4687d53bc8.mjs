// vite.config.ts
import path from "path";
import react from "file:///home/project/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { defineConfig } from "file:///home/project/node_modules/vite/dist/node/index.js";
var __vite_injected_original_dirname = "/home/project";
var vite_config_default = defineConfig({
  plugins: [
    react(),
    {
      name: "spa-fallback",
      configureServer(server) {
        server.middlewares.use((_req, _res, next) => {
          const url = _req.url || "";
          if (!url.startsWith("/@") && !url.startsWith("/src/") && !url.includes(".") && !url.startsWith("/api/")) {
            _req.url = "/index.html";
          }
          next();
        });
      },
      configurePreviewServer(server) {
        server.middlewares.use((_req, _res, next) => {
          const url = _req.url || "";
          if (!url.startsWith("/@") && !url.startsWith("/src/") && !url.includes(".") && !url.startsWith("/api/")) {
            _req.url = "/index.html";
          }
          next();
        });
      }
    }
  ],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  optimizeDeps: {
    exclude: ["lucide-react"]
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvaG9tZS9wcm9qZWN0XCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCIvaG9tZS9wcm9qZWN0L3ZpdGUuY29uZmlnLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9ob21lL3Byb2plY3Qvdml0ZS5jb25maWcudHNcIjtpbXBvcnQgcGF0aCBmcm9tICdwYXRoJztcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XG5pbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJztcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgcGx1Z2luczogW1xuICAgIHJlYWN0KCksXG4gICAge1xuICAgICAgbmFtZTogJ3NwYS1mYWxsYmFjaycsXG4gICAgICBjb25maWd1cmVTZXJ2ZXIoc2VydmVyKSB7XG4gICAgICAgIHNlcnZlci5taWRkbGV3YXJlcy51c2UoKF9yZXEsIF9yZXMsIG5leHQpID0+IHtcbiAgICAgICAgICBjb25zdCB1cmwgPSBfcmVxLnVybCB8fCAnJztcbiAgICAgICAgICBpZiAoIXVybC5zdGFydHNXaXRoKCcvQCcpICYmICF1cmwuc3RhcnRzV2l0aCgnL3NyYy8nKSAmJiAhdXJsLmluY2x1ZGVzKCcuJykgJiYgIXVybC5zdGFydHNXaXRoKCcvYXBpLycpKSB7XG4gICAgICAgICAgICBfcmVxLnVybCA9ICcvaW5kZXguaHRtbCc7XG4gICAgICAgICAgfVxuICAgICAgICAgIG5leHQoKTtcbiAgICAgICAgfSk7XG4gICAgICB9LFxuICAgICAgY29uZmlndXJlUHJldmlld1NlcnZlcihzZXJ2ZXIpIHtcbiAgICAgICAgc2VydmVyLm1pZGRsZXdhcmVzLnVzZSgoX3JlcSwgX3JlcywgbmV4dCkgPT4ge1xuICAgICAgICAgIGNvbnN0IHVybCA9IF9yZXEudXJsIHx8ICcnO1xuICAgICAgICAgIGlmICghdXJsLnN0YXJ0c1dpdGgoJy9AJykgJiYgIXVybC5zdGFydHNXaXRoKCcvc3JjLycpICYmICF1cmwuaW5jbHVkZXMoJy4nKSAmJiAhdXJsLnN0YXJ0c1dpdGgoJy9hcGkvJykpIHtcbiAgICAgICAgICAgIF9yZXEudXJsID0gJy9pbmRleC5odG1sJztcbiAgICAgICAgICB9XG4gICAgICAgICAgbmV4dCgpO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgfSxcbiAgXSxcbiAgcmVzb2x2ZToge1xuICAgIGFsaWFzOiB7XG4gICAgICAnQCc6IHBhdGgucmVzb2x2ZShfX2Rpcm5hbWUsICcuL3NyYycpLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIGV4Y2x1ZGU6IFsnbHVjaWRlLXJlYWN0J10sXG4gIH0sXG59KTtcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBeU4sT0FBTyxVQUFVO0FBQzFPLE9BQU8sV0FBVztBQUNsQixTQUFTLG9CQUFvQjtBQUY3QixJQUFNLG1DQUFtQztBQUl6QyxJQUFPLHNCQUFRLGFBQWE7QUFBQSxFQUMxQixTQUFTO0FBQUEsSUFDUCxNQUFNO0FBQUEsSUFDTjtBQUFBLE1BQ0UsTUFBTTtBQUFBLE1BQ04sZ0JBQWdCLFFBQVE7QUFDdEIsZUFBTyxZQUFZLElBQUksQ0FBQyxNQUFNLE1BQU0sU0FBUztBQUMzQyxnQkFBTSxNQUFNLEtBQUssT0FBTztBQUN4QixjQUFJLENBQUMsSUFBSSxXQUFXLElBQUksS0FBSyxDQUFDLElBQUksV0FBVyxPQUFPLEtBQUssQ0FBQyxJQUFJLFNBQVMsR0FBRyxLQUFLLENBQUMsSUFBSSxXQUFXLE9BQU8sR0FBRztBQUN2RyxpQkFBSyxNQUFNO0FBQUEsVUFDYjtBQUNBLGVBQUs7QUFBQSxRQUNQLENBQUM7QUFBQSxNQUNIO0FBQUEsTUFDQSx1QkFBdUIsUUFBUTtBQUM3QixlQUFPLFlBQVksSUFBSSxDQUFDLE1BQU0sTUFBTSxTQUFTO0FBQzNDLGdCQUFNLE1BQU0sS0FBSyxPQUFPO0FBQ3hCLGNBQUksQ0FBQyxJQUFJLFdBQVcsSUFBSSxLQUFLLENBQUMsSUFBSSxXQUFXLE9BQU8sS0FBSyxDQUFDLElBQUksU0FBUyxHQUFHLEtBQUssQ0FBQyxJQUFJLFdBQVcsT0FBTyxHQUFHO0FBQ3ZHLGlCQUFLLE1BQU07QUFBQSxVQUNiO0FBQ0EsZUFBSztBQUFBLFFBQ1AsQ0FBQztBQUFBLE1BQ0g7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsT0FBTztBQUFBLE1BQ0wsS0FBSyxLQUFLLFFBQVEsa0NBQVcsT0FBTztBQUFBLElBQ3RDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsY0FBYztBQUFBLElBQ1osU0FBUyxDQUFDLGNBQWM7QUFBQSxFQUMxQjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
