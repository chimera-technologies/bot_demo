import { defineConfig } from 'vitest/config';

// https://vite.dev/config/
export default defineConfig({
    test: {
        globals: true, // Enables globals like `describe`, `it`, and `expect`
        environment: 'jsdom', // Simulate the browser environment
      },
})