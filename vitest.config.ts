import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname),
    },
  },
  test: {
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.ts', '__tests__/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['app/api/**', 'lib/**'],
      exclude: ['lib/generated/**', 'node_modules/**', '__tests__/**'],
    },
    server: {
      deps: {
        inline: ['@prisma/client'],
      },
    },
  },
});
