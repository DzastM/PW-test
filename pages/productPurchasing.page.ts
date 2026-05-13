import { expect, Locator, Page } from "@playwright/test";
import { CartPage } from '../pages/cartPage.page'
import { Products } from "../interfaces/products.interface";

export interface ProductData {
    name: string;
    category: string;
    price: number;
    starsNumber: number;
    inStock: string;
}

export class ProductPurchasingPage {
    private readonly viewCartButton: Locator;
    private readonly header: Locator;
    private readonly productsInCartNumber : Locator;

    constructor(private page: Page) {        
        this.viewCartButton = this.page.locator("header button")
        this.header = this.page.locator("h1");
        this.productsInCartNumber = this.viewCartButton.locator("span .MuiBadge-badge");
    }
//add possibility to add product more than once
    async addProductToCart(productName: string) : Promise<void> {
        await this.page.getByText(productName).locator('..').getByRole('button', {name: 'Add to cart'}).click();
    } 

    async addProductsToCart(...products: Products[]) {
        for (const product of products) {
            await this.page.getByText(product.name).locator('..').getByRole('button', {name: 'Add to cart'}).click();
        }
    }

    async clickViewCartButton(): Promise<CartPage> {
        await this.viewCartButton.click();
        return new CartPage(this.page);
    }

    async verifyPageHeader(expectedHeader: string) {
        const actualHeader = await this.header.innerText();
        expect(actualHeader).toEqual(expectedHeader);
    }

    async verifyCartProductNumber(expectedNumber: number) {
        if(expectedNumber === 0) {
            await expect(this.productsInCartNumber).toHaveClass(/MuiBadge-invisible/);
        } else {
            expect(Number(await this.productsInCartNumber.innerText())).toBe(expectedNumber);
        }
    }
}