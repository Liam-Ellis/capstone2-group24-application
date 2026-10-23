import { defineConfig } from '@playwright/test';

export default defineConfig({
    testDir: './tests',
    use: {
        baseURL: 'http://127.0.0.1:3000',
        
    },

    webServer: [
        {
            command: 'npm run dev -- --host 127.0.0.1',
            cwd: '../frontend',
            url: 'http://127.0.0.1:5173',
            reuseExistingServer: true,
        },
        {
        command: 'node app.js',
        url: 'http://127.0.0.1:3000/api/application/status',
        reuseExistingServer: true,
        },
    ]
});
