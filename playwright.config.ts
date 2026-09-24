import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './tests/e2e',
  timeout: 60000,
  fullyParallel: false,
  workers: 1,
  use: {
    baseURL: process.env.TEST_BASE_URL || 'http://localhost:3100',
    headless: true,
    viewport: { width: 1280, height: 900 },
    reducedMotion: 'reduce',
  },
  reporter: [['list'], ['json', { outputFile: '../design-reference/test-results.json' }]],
});
