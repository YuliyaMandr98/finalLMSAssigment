// utils/authUtils.ts
import { Page, expect } from '@playwright/test';
import { HomePage } from '../pages/homePage';
import { LoginPage } from '../pages/loginPage';
import { WaitUntilStrategy } from '../constants/WaitUntilStrategy';
import dotenv from 'dotenv';

dotenv.config();
const puzzleIframeLocator = (page: Page) => page.locator('iframe#cvf-aamation-challenge-iframe');

export async function authorizeUser(page: Page): Promise<void> {
    const homePage = new HomePage(page);
    const loginPage = new LoginPage(page);

    const username = process.env.AMAZON_USERNAME!;
    const password = process.env.AMAZON_PASSWORD!;

    console.log('Global uauthorization started.');

    await homePage.goToHomePage(WaitUntilStrategy.DOM_CONTENT_LOADED);
    await expect(page.locator('#nav-logo, #nav-bb-logo')).toBeVisible();
    await homePage.handleIntermediatePage();

    await expect(homePage.expandAccountsAndListsButton).toBeVisible({ timeout: 10000 });
    await homePage.expandAccountsAndListsButton.click();
    await page.waitForTimeout(1500);
    await expect(homePage.signInButton).toBeVisible({ timeout: 15000 });

    // await expect(homePage.signInButton).toBeVisible({ timeout: 5000 });
    await homePage.signInButton.click({ timeout: 15000, force: true });
    await page.waitForURL('**/ap/signin*', { waitUntil: 'domcontentloaded' });

    await loginPage.enterEmailOrPhone(username);
    await loginPage.clickContinueButton();
    await expect(loginPage.getLocator('#ap_password')).toBeVisible();

    await loginPage.enterPassword(password);
    await loginPage.clickSignInButton();

    const accountLinkAfterSignIn = page.locator('#nav-link-accountList-nav-line-1');
    const successLoginPromise = expect(accountLinkAfterSignIn).toBeVisible({ timeout: 30000 });
    const puzzlePresentPromise = expect(puzzleIframeLocator(page)).toBeVisible({ timeout: 30000 });
    const cvfPagePromise = page.waitForURL('**/ap/cvf/request**', { timeout: 30000 });

    try {
        await Promise.race([successLoginPromise, puzzlePresentPromise, cvfPagePromise]);

        const isAccountLinkVisible = await accountLinkAfterSignIn.isVisible();
        const isPuzzleVisible = await puzzleIframeLocator(page).isVisible();
        const isCvfPage = page.url().includes('/ap/cvf/request');

        if (isAccountLinkVisible) {
            await expect(accountLinkAfterSignIn).toContainText(/Hello,|Witaj,/);
            console.log('user is logged in successfully');

        } else if (isPuzzleVisible || isCvfPage) {
            console.warn('CAPTCA is present');
            await homePage.goToHomePage(WaitUntilStrategy.DOM_CONTENT_LOADED);
        } else {
            throw new Error('Error authorization');
        }

    } catch (error) {
        console.error('Error authorization', error);
        throw error;
    }
}