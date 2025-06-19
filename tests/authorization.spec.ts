// tests/authorization.spec.ts
import { test, expect, Page } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { WaitUntilStrategy } from '../constants/WaitUntilStrategy';
import dotenv from 'dotenv';

dotenv.config();
const puzzleIframeLocator = (page: Page) => page.locator('iframe#cvf-aamation-challenge-iframe');

test.describe('Authorization', () => {

    test('Successful authorization', async ({ page }) => {
        const homePage = new HomePage(page);
        const loginPage = new LoginPage(page);

        const username = process.env.AMAZON_USERNAME!;
        const password = process.env.AMAZON_PASSWORD!;

        await test.step('Redirect to home page', async () => {
            await homePage.goToHomePage(WaitUntilStrategy.DOM_CONTENT_LOADED);
            await expect(page.locator('#nav-logo, #nav-bb-logo')).toBeVisible();
            await homePage.handleIntermediatePage();
        });

        await test.step("Hover over the 'Accounts and Lists' in the header", async () => {
            await expect(homePage.expandAccountsAndListsButton).toBeVisible({ timeout: 10000 });
            await homePage.expandAccountsAndListsButton.click();
            await page.waitForTimeout(1500);
            await expect(homePage.signInButton).toBeVisible({ timeout: 15000 });
        });

        await test.step("Click on the 'Sign In' button", async () => {
            await expect(homePage.signInButton).toBeVisible({ timeout: 5000 });
            await homePage.signInButton.click({ timeout: 15000 });
            await loginPage.verifyOnLoginPage();
        });

        await test.step("Enter a valid value in the 'Email' field and click on [Continue]", async () => {
            await loginPage.enterEmailOrPhone(username);
            await loginPage.clickContinueButton();
            await expect(loginPage.getLocator('#ap_password')).toBeVisible();
        });

        await test.step("Enter a valid value in the Password field and click on [Log In]", async () => {
            await loginPage.enterPassword(password);
            await loginPage.clickSignInButton();
        });

        await test.step("Verification: The user is successfully logged in or there is a verification puzzle", async () => {
            const accountLinkAfterSignIn = page.locator('#nav-link-accountList-nav-line-1');
            const successLoginPromise = expect(accountLinkAfterSignIn).toBeVisible();
            const puzzlePresentPromise = expect(puzzleIframeLocator(page)).toBeVisible();

            try {
                await Promise.race([successLoginPromise, puzzlePresentPromise]);
                const isPuzzleVisible = await puzzleIframeLocator(page).isVisible();

                if (isPuzzleVisible) {
                    console.log('Puzzle is present.');
                } else {
                    console.log('User is successfully logged in.');
                    await expect(accountLinkAfterSignIn).toContainText(/Hello,|Witaj,/);
                }
            } catch (error) {
                console.error('Error', error);
                throw error;
            }
        });
    });
});