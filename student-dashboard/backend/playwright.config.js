import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://localhost:3000/application-status',
        channel: 'chrome',
        headless: false,
    },
    webServer: {
        command: 'node app.js',
        url: 'http://localhost:3000/application-status',
        reuseExistingServer: !process.env.CI,
        timeout: 120000,
    },
});
