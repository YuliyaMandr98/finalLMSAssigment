import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './basePage';
import { WaitUntilStrategy } from '../constants/WaitUntilStrategy';
import { URLS } from '../constants/URLS';

export class HomePage extends BasePage {
    readonly accountsAndListsLink: Locator;
    readonly signInButton: Locator;
    readonly searchInput: Locator;
    readonly yourAccountLink: Locator;
    readonly expandAccountsAndListsButton: Locator;
    readonly searchInputField: Locator;
    readonly searchButton: Locator;
    readonly accountLinkAfterSignIn: Locator;
    readonly cartCountIcon: Locator;

    constructor(page: Page) {
        super(page);
        this.accountsAndListsLink = page.locator('//*[@id="nav-link-accountList"]/a');
        this.signInButton = page.locator('//*[@id="nav-flyout-ya-signin"]/a');
        this.searchInput = page.locator('#twotabsearchtextbox');
        this.yourAccountLink = page.locator('#navbar-backup-backup > div > div.nav-bb-right > a:nth-child(1)');
        this.expandAccountsAndListsButton = page.getByLabel('Expand Account and Lists');
        this.searchInputField = page.locator('#twotabsearchtextbox, #nav-bb-search');
        this.searchButton = page.locator('#nav-search-submit-button, .nav-bb-button');
        this.accountLinkAfterSignIn = page.locator('#nav-link-accountList-nav-line-1');
        this.cartCountIcon = page.locator('#nav-cart-count');
    }

    async goToHomePage(strategy: WaitUntilStrategy) {
        await this.goToUrl(URLS.HOME_PAGE, strategy);
    }

    async handleIntermediatePage(): Promise<void> {
        await this.handleOptionalElementAndClick(
            this.yourAccountLink,
            5000,
            'Optional element found and clicked.'
        );
    }

    async searchForProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }

    async enterSearchQuery(query: string): Promise<void> {
        await this.searchInputField.fill(query);
        console.log(`Entered search query: '${query}'`);
    }

    async clickSearchButton(): Promise<void> {
        await this.searchButton.click();
        console.log('Clicked search button.');
    }

    async performSearch(query: string): Promise<void> {
        await this.enterSearchQuery(query);
        await this.clickSearchButton();
    }

    async verifyUserIsLoggedIn(): Promise<void> {
        await expect(this.accountLinkAfterSignIn).toBeVisible({ timeout: 20000 });
        await expect(this.accountLinkAfterSignIn).toContainText(/Hello,|Witaj,/);
        console.log('User is logged in successfully.');
    }
}