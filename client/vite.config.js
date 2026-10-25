import { defineConfig } from "vitest/config";
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    exclude: [
    "**/node_modules/**",
    "**/dist/**",
    "e2e/**"
    ],
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTests.js",
  },
});



