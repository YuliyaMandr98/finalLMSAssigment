import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 1,
    reporter: [
        ['list'],
        ['allure-playwright', {
            outputFolder: 'allure-results',
            detail: true,
            suiteTitle: false,
            environmentInfo: true,
        }],
    ],
    use: {
        baseURL: process.env.AMAZON_URL || 'https://www.amazon.com',
        trace: 'on-first-retry',
        headless: true,
        storageState: 'storageState.json',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // {
        //     name: 'firefox',
        //     use: { ...devices['Desktop Firefox'] },
        // },
        // {
        //     name: 'webkit',
        //     use: { ...devices['Desktop Safari'] },
        // },
    ],
});