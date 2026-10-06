import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: { alias: { "@": path.resolve(__dirname, "src") } },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["src/setupTests.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "lcov"],
      include: ["src/**/*.{ts,tsx}"],
      exclude: [
        "src/**/*.test.{ts,tsx}",
        "src/app/**",
        "src/components/**",
        "src/features/**/pages/**",
        "src/features/**/layouts/**",
        "src/features/**/components/**",
        "src/features/**/modals/**",
        "src/types/**",
        "src/lib/empty.ts",
        "src/server.ts",
        "src/setupTests.ts",
        "src/test-utils.tsx",
      ],
      thresholds: { lines: 100, functions: 100, branches: 100, statements: 100 },
    },
  },
});