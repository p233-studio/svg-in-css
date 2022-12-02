import { defineConfig } from "vite";
import solidPlugin from "vite-plugin-solid";

export default defineConfig({
  plugins: [solidPlugin()],
  css: {
    modules: {
      generateScopedName: "[hash:base64:5]"
    }
  },
  resolve: {
    alias: [{ find: "~", replacement: "/src/" }]
  },
  build: {
    target: "esnext"
  },
  server: {
    port: 3000
  }
});
