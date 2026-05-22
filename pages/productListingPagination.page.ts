import { expect, Locator, Page } from "@playwright/test";
import { CartPage } from '../pages/cartPage.page'
import { productDataPLP } from "../interfaces/productDataPLP.interface";

export class ProductListingAndPaginationPage {
    private readonly header: Locator;
    private readonly productsInCartNumber : Locator;

    constructor(private page: Page) {        
        this.productsInCartNumber = this.page.locator('h2:has-text("Categories")').locator('..').locator('div.bg-white.border');
        this.header = this.page.locator("h1");
        this.productsInCartNumber = this.viewCartButton.locator("span .MuiBadge-badge");
    }
    async addProductToCart(productName: string) : Promise<void> {
        await this.page.getByText(productName).locator('..').getByRole('button', {name: 'Add to cart'}).click();
    } 


}