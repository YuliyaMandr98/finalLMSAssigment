import { expect, FrameLocator, Locator, Page } from "@playwright/test";
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

    async clearCart(): Promise<void> {
        console.log('Попытка очистить корзину...');
        await this.basePage.goto('https://www.amazon.com/gp/cart/view.html'); // Перейти на страницу корзины
        await this.basePage.waitForLoadState('domcontentloaded');

        // Локаторы для кнопок удаления и сообщения о пустой корзине
        // Важно: эти локаторы специфичны для страницы корзины Amazon, их нужно подтвердить
        const deleteButtons = this.basePage.locator('input[data-action="delete"]'); // Кнопки "Удалить" для товаров
        const emptyCartMessage = this.basePage.locator('h2:has-text("Your Amazon Cart is empty.")'); // Сообщение о пустой корзине

        // Если корзина уже пуста, выходим
        if (await emptyCartMessage.isVisible({ timeout: 3000 })) { // Короткий таймаут для проверки, пуста ли корзина
            console.log('Корзина уже пуста (обнаружено сообщение).');
            await this.basePage.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded' });
            return;
        }

        const count = await deleteButtons.count();

        if (count > 0) {
            console.log(`Найдено ${count} товаров в корзине. Удаляем...`);
            // Итерируем и удаляем, всегда кликая по первой видимой кнопке,
            // пока корзина не станет пустой или не исчезнут все кнопки удаления
            while (await deleteButtons.first().isVisible({ timeout: 1000 })) { // Короткий таймаут для видимости кнопки
                await deleteButtons.first().click();
                // Ждем обновления DOM после удаления или появления сообщения о пустой корзине
                await this.basePage.waitForLoadState('domcontentloaded');
                // Можно добавить более специфичное ожидание, если страница не всегда перезагружается полностью:
                // await expect(deleteButtons).not.toBeVisible(); // Если кнопка исчезает
                // Или await expect(emptyCartMessage).toBeVisible(); // Если сообщение появляется после последнего удаления
            }
            // После цикла, убеждаемся, что корзина действительно пуста
            await expect(emptyCartMessage).toBeVisible({ timeout: 10000 });
            console.log('Корзина очищена.');
        } else {
            // Это случай, если корзина не была пуста, но и deleteButtons не были найдены
            console.log('Корзина не пуста, но кнопки удаления не найдены или их количество равно 0. Возможно, проблема с локатором или состоянием.');
        }
        await this.basePage.goto('https://www.amazon.com/', { waitUntil: 'domcontentloaded' }); // Вернуться на главную страницу
    }

    protected async close() {
        await this.basePage.close();
    }
}