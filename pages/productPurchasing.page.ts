import { expect, Locator, Page } from "@playwright/test";
import { CartPage } from '../pages/cartPage.page'

export interface ProductData {
    name: string;
    category: string;
    price: number;
    starsNumber: number;
    inStock: string;
}

export class ProductPurchasingPage {
    private readonly viewCartButton: Locator;
    constructor(private page: Page) {        
        this.viewCartButton = this.page.locator("header button")
    }

    async addProductToCart(productName: string) : Promise<void> {
        await this.page.getByText(productName).locator('..').getByRole('button', {name: 'Add to cart'}).click();
        //await this.page.getByRole('option', {selected: false}).filter({hasText: categoryName}).click();
    } 

    async clickViewCartButton(): Promise<CartPage> {
        await this.viewCartButton.click();
        return new CartPage(this.page);
    }
}