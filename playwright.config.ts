import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config(); // Загрузка переменных окружения из .env

export default defineConfig({
    testDir: './tests',
    fullyParallel: true, // Запускать тесты параллельно
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0, // Повторные попытки при запуске в CI
    workers: process.env.CI ? 1 : 1,
    reporter: [
        ['list'], // Вывод в консоль
        ['allure-playwright', {
            outputFolder: 'allure-results', // Папка для результатов Allure
            detail: true,
            suiteTitle: false,
        }],
    ],
    use: {
        baseURL: process.env.AMAZON_URL || 'https://www.amazon.com',
        trace: 'on-first-retry', // Сохранять трассировку при первой ошибке
        headless: false, // Запускать браузер в видимом режиме (true для headless)
        // viewport: { width: 1920, height: 1080 }, // Фиксируем размер окна
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
});