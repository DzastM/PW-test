import { expect, Locator, Page } from "@playwright/test";
import { CartPage } from '../pages/cartPage.page'
import { productDataPLP } from "../interfaces/productDataPLP.interface";

export class ProductListingAndPaginationPage {
    private readonly header: Locator;
    private readonly productsInCartNumber : Locator;
    private readonly nextPageButton: Locator;
    private readonly previousPageButton: Locator;

    constructor(private page: Page) {        
        this.productsInCartNumber = this.page.locator('h2:has-text("Categories")').locator('..').locator('div.bg-white.border');
        this.header = this.page.locator("h1");
        this.nextPageButton = this.page.getByRole('button', {name: 'Next'});
        this.previousPageButton = this.page.getByRole('button', {name: 'Prev'});
    }

    async clickNextPageButton() {
        await this.nextPageButton.click();
    }

    async clickPreviousPageButton() {
        await this.previousPageButton.click();
    }

    async getAllProductsInformation() : Promise<productDataPLP[]> {
        const productContainer = this.page.locator("css: div .grid-cols-1");
        const allProducts: productDataPLP[] = [];
        while(this.nextPageButton.isEnabled) {            
            const productsLocatorsOnPage = await productContainer.locator("div").all();
            for(const productLocator of productsLocatorsOnPage) {
                const name = await productLocator.locator("h6").first().innerText();
                const priceText = await productLocator.locator("h6").nth(2).innerText();
                const price = Number(priceText.substring(priceText.indexOf(' '),priceText.indexOf(priceText.slice(-1))));
                const category = await productLocator.locator("p").innerText();
                const starsText = await productLocator.locator("span").getAttribute("aria-label");
                const stars = Number(starsText?.charAt(0));
                allProducts.push({
                    name,
                    category,
                    price, 
                    stars
                });
            }            
            await this.clickNextPageButton();
        }
        return allProducts;
    }

    async countProductsInCategory(categoryName: string): Promise<number> {
    let numberOfProducts = 0;
        
    return numberOfProducts;
    }

    async assertProductNumberInCategory(categoryName: string) {

    }


}