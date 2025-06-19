import { FrameLocator, Locator, Page } from "@playwright/test";
import { WaitUntilStrategy } from "../constants/WaitUntilStrategy";

export class BasePage {
    private readonly basePage: Page;

    protected constructor(page: Page) { this.basePage = page; }

    protected async goToUrl(url: string, strategy: WaitUntilStrategy): Promise<void> {
        await this.basePage.goto(url, { waitUntil: strategy });
    }

    async handleOptionalElementAndClick(locator: Locator, timeout: number = 5000, message: string = 'Optional element found and clicked.'): Promise<void> {
        if (await locator.isVisible({ timeout: timeout })) {
            console.log(message);
            await locator.click();
            // После клика ждем, пока страница не загрузится (или не произойдет перенаправление)
            await this.basePage.waitForLoadState('domcontentloaded');
        } else {
            console.log(`Optional element not found within ${timeout}ms. Continuing without click.`);
        }
    }

    public get browserName(): string {
        return this.basePage.context().browser()?.browserType().name() || 'unknown';
    }

    public getLocator(name: string): Locator {
        return this.basePage.locator(name);
    }

    protected getLocatorByRole(role: any, _name: string): Locator {
        return this.basePage.getByRole(role, { name: _name });
    }

    protected getLocatorByText(text: string) {
        return this.basePage.getByText(text);
    }

    protected fillInput(locator: Locator, text: string): Promise<void> {
        return locator.fill(text);
    }

    protected async waitForPageEvent(event: string, timeout: number): Promise<any> {
        return await this.basePage.waitForEvent(event as any, { timeout });
    }

    protected async close() {
        await this.basePage.close();
    }
}