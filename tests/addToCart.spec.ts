// tests/addToCart.spec.ts
import { test, expect, type Page } from '@playwright/test';
import dotenv from 'dotenv';
import { ProductPage } from '../pages/productPage';
import { HomePage } from '../pages/homePage';
import { authorizeUser } from '../utils/authUtils';
dotenv.config();

const PRODUCT_SEARCH_QUERY = 'The Book';

test.describe('Add to Cart', () => {
    let homePage: HomePage;
    let productPage: ProductPage;

    test.beforeEach(async ({ page }) => {
        homePage = new HomePage(page);
        productPage = new ProductPage(page);

        await test.step('Precondition: Authorization', async () => {
            await authorizeUser(page);
            await homePage.verifyUserIsLoggedIn();
        });

        await test.step('Precondition: Search for a product', async () => {
            await homePage.performSearch(PRODUCT_SEARCH_QUERY);

            const firstProductLink = page.locator('[data-component-type="s-search-result"] a.a-link-normal').first();
            await expect(firstProductLink).toBeVisible({ timeout: 10000 });
            await firstProductLink.click();
            console.log(`Page for product '${PRODUCT_SEARCH_QUERY}' is opened`);
            await expect(productPage.addToCartButton).toBeVisible({ timeout: 15000 });
        });
    });

    test('Add to Cart', async ({ page }) => {
        await test.step("1. Клик по [Add to Cart]", async () => {
            await productPage.clickAddToCart();
        });
        await test.step("Check [Added to Cart]", async () => {
            await productPage.verifyProductAddedToCart();
            // await expect(homePage.cartCountIcon).toHaveText('1', { timeout: 10000 });
            console.log('Product added to cart.');
        });
    });
});