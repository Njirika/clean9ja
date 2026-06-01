import { defineConfig } from 'vitest/config';

// Isolated config so Vitest doesn't pick up the frontend's vite.config.ts
// (which pulls in the React/Tailwind plugins). The backend tests are plain
// Node unit tests.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
