import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    testDir: './tests',
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : 1,
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
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] },
        },
        {
            name: 'webkit',
            use: { ...devices['Desktop Safari'] },
        },
    ],
    reporter: [
        // Обязательно оставьте 'list' или 'dot' для вывода в консоль во время выполнения
        ['list'], // Или 'dot'
        // *** Вот ваша настройка Allure репортера ***
        ['allure-playwright', {
            outputFolder: 'allure-results', // Папка, куда Playwright будет сохранять XML/JSON файлы Allure.
            // Создастся в корне вашего Playwright проекта.
            detail: true,                 // Добавляет подробности (шаги, логи) в отчет
            suiteTitle: false,            // Если true, использует название файла теста как suite
            environmentInfo: true,        // Добавляет информацию об окружении (ОС, Node.js, браузеры)
            // categories: [],            // Опционально: для настройки категорий ошибок
            // resultsDir: 'allure-raw-results', // Можно настроить другое имя для исходных результатов
        }],
    ],
});