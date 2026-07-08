const { defineConfig } = require("vitest/config");

module.exports = defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.js"],
    setupFiles: ["tests/setup/test-env.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/services/product.service.js"],
    },
  },
});
