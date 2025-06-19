import { Page, Locator } from '@playwright/test';
import { BasePage } from './basePage';
import { WaitUntilStrategy } from '../constants/WaitUntilStrategy';
import { URLS } from '../constants/URLS';

export class HomePage extends BasePage {
    readonly accountsAndListsLink: Locator;
    readonly signInButton: Locator;
    readonly searchInput: Locator;
    readonly searchButton: Locator;
    readonly yourAccountLink: Locator;
    readonly expandAccountsAndListsButton: Locator;

    constructor(page: Page) {
        super(page);
        this.accountsAndListsLink = page.locator('//*[@id="nav-link-accountList"]/a');
        this.signInButton = page.locator('//*[@id="nav-flyout-ya-signin"]/a');
        this.searchInput = page.locator('#twotabsearchtextbox');
        this.searchButton = page.locator('#nav-search-submit-button');
        this.yourAccountLink = page.locator('#navbar-backup-backup > div > div.nav-bb-right > a:nth-child(1)');
        this.expandAccountsAndListsButton = page.getByLabel('Expand Account and Lists');
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

    // async clickSignInLink(): Promise<void> {
    //     await this.accountsAndListsLink.hover(); // Шаг 1: Наведение
    //     await this.signInButton.click(); // Шаг 2: Клик по "Войти"
    // }

    async searchForProduct(productName: string): Promise<void> {
        await this.searchInput.fill(productName);
        await this.searchButton.click();
    }
}