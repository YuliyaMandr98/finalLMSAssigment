// // global-setup.ts
// import { chromium, expect, FullConfig, Page } from '@playwright/test';
// import dotenv from 'dotenv';
// import { HomePage } from './pages/homePage';
// import { LoginPage } from './pages/loginPage';
// import { WaitUntilStrategy } from './constants/WaitUntilStrategy';
// dotenv.config();
// const puzzleIframeLocator = (page: Page) => page.locator('iframe#cvf-aamation-challenge-iframe');

// async function globalSetup(config: FullConfig) {
//     const browser = await chromium.launch({ headless: true });  // Можно использовать 'chromium', 'firefox', 'webkit'
//     const page = await browser.newPage();

//     const homePage = new HomePage(page);
//     const loginPage = new LoginPage(page);

//     const username = process.env.AMAZON_USERNAME!;
//     const password = process.env.AMAZON_PASSWORD!;

//     console.log('Global setup started.');

//     await homePage.goToHomePage(WaitUntilStrategy.DOM_CONTENT_LOADED);
//     await expect(page.locator('#nav-logo, #nav-bb-logo')).toBeVisible();
//     await homePage.handleIntermediatePage();

//     await expect(homePage.expandAccountsAndListsButton).toBeVisible({ timeout: 10000 });
//     await homePage.expandAccountsAndListsButton.click();
//     await page.waitForTimeout(1000);
//     await expect(homePage.signInButton).toBeVisible({ timeout: 15000 });

//     await expect(homePage.signInButton).toBeVisible({ timeout: 5000 });
//     await homePage.signInButton.click({ timeout: 15000 });
//     await loginPage.verifyOnLoginPage();

//     await loginPage.enterEmailOrPhone(username);
//     await loginPage.clickContinueButton();
//     await expect(loginPage.getLocator('#ap_password')).toBeVisible();

//     await loginPage.enterPassword(password);
//     await loginPage.clickSignInButton();

//     // *** ДОБАВЛЕННАЯ ЛОГИКА ОБРАБОТКИ ПАЗЛА / CVF после попытки логина ***
//     const accountLinkAfterSignIn = page.locator('#nav-link-accountList-nav-line-1');
//     const successLoginPromise = expect(accountLinkAfterSignIn).toBeVisible();
//     const puzzlePresentPromise = expect(puzzleIframeLocator(page)).toBeVisible();

//     try {
//         await Promise.race([successLoginPromise, puzzlePresentPromise]);
//         const isPuzzleVisible = await puzzleIframeLocator(page).isVisible();

//         if (isPuzzleVisible) {
//             console.log('Puzzle is present.');
//         } else {
//             console.log('User is successfully logged in.');
//             await expect(accountLinkAfterSignIn).toContainText(/Hello,|Witaj,/);
//         }
//     } catch (error) {
//         console.error('Error', error);
//         throw error;
//     }
// }

// export default globalSetup;