// pages/ProductPage.ts
import { test, expect, type Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';

export class ProductPage extends BasePage {
    readonly addToCartButton: Locator;
    readonly addedToCartConfirmation: Locator;
    readonly cartCountIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.addToCartButton = page.locator('#add-to-cart-button');
        this.addedToCartConfirmation = page.locator('#NATC_SMART_WAGON_CONF_MSG_SUCCESS h1:has-text("Added to cart")');
        this.cartCountIcon = page.locator('#nav-cart-count');
    }

    async clickAddToCart(): Promise<void> {
        await this.addToCartButton.click();
        console.log('Clicked "Add to Cart"');
    }

    async verifyProductAddedToCart(): Promise<void> {
        await expect(this.addedToCartConfirmation).toBeVisible({ timeout: 20000 });
        await expect(this.addedToCartConfirmation).toContainText('Added to cart');
        console.log('Подтверждение "Added to Cart" отображено.');
    }

}