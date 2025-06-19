// pages/loginPage.ts
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage'; // Импортируем базовый класс

export class LoginPage extends BasePage {
    // Локаторы элементов на странице логина
    private readonly emailInput: Locator;
    private readonly continueButton: Locator;
    private readonly passwordInput: Locator;
    private readonly signInButton: Locator;
    private readonly signInHeader: Locator; // Заголовок "Sign In" или "Вход"

    constructor(page: Page) {
        super(page); // Вызываем конструктор базового класса
        this.emailInput = page.locator('#ap_email_login, #ap_email');
        this.continueButton = page.locator('#continue').first();
        this.passwordInput = page.locator('#ap_password');
        this.signInButton = page.locator('#auth-signin-button, .nav-action-signin-button');
        this.signInHeader = page.locator('.a-spacing-small, #a-spacing-small').filter({ hasText: 'Sign in' }); // Или другой более универсальный локатор для заголовка
    }

    async verifyOnLoginPage(): Promise<void> {
        await expect(this.signInHeader).toBeVisible();
        await expect(this.emailInput).toBeVisible({ timeout: 10000 });
    }

    async enterEmailOrPhone(emailOrPhone: string): Promise<void> {
        await this.emailInput.fill(emailOrPhone);
        // console.log(`Entered email/phone: ${emailOrPhone}`);
    }
    async clickContinueButton(): Promise<void> {
        await this.continueButton.click();
        // Playwright автоматически подождет, пока кнопка станет кликабельной
        // console.log('Clicked Continue button');
    }

    async enterPassword(password: string): Promise<void> {
        await this.passwordInput.fill(password);
        // console.log('Entered password');
    }

    async clickSignInButton(): Promise<void> {
        await this.signInButton.click();
        // console.log('Clicked Sign In button');
    }

    async login(emailOrPhone: string, password: string): Promise<void> {
        await this.enterEmailOrPhone(emailOrPhone);
        await this.clickContinueButton();
        await this.enterPassword(password);
        await this.clickSignInButton();
    }
}