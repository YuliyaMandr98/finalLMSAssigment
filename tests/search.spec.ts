// tests/search.spec.ts
import { test, expect, type Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { WaitUntilStrategy } from '../constants/WaitUntilStrategy';

test.describe('Search functionality', () => {
    let homePage: HomePage;
    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        await homePage.goToHomePage(WaitUntilStrategy.DOM_CONTENT_LOADED);
        // await homePage.verifyUserIsLoggedIn();
    });

    test('Search - iPhone', async ({ page }) => {
        const searchQuery = 'iPhone';

        await test.step(`1. Enter search query '${searchQuery}' in the search field`, async () => {
            await expect(homePage.searchInputField).toBeVisible({ timeout: 10000 });
            await homePage.enterSearchQuery(searchQuery);
            // await page.pause();
        });

        await test.step("2. Click on the search button", async () => {
            await expect(homePage.searchButton).toBeVisible({ timeout: 5000 });
            await homePage.clickSearchButton();
        });

        await test.step(`3. Verify that search results for '${searchQuery}' are displayed`, async () => {
            await page.waitForURL(`**/*amazon.com/s*k=${searchQuery}*`, { waitUntil: 'domcontentloaded' });
            const searchResultsHeader = page.locator(`span.a-color-state.a-text-bold:has-text("${searchQuery}")`);
            await expect(searchResultsHeader).toBeVisible({ timeout: 20000 });
            console.log(`Results for '${searchQuery}' are displayed successfully.`);
        });
    });
});