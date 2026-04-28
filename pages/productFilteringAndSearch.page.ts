import { expect, Locator, Page } from "@playwright/test";

export interface ProductData {
    name: string;
    category: string;
    price: number;
    starsNumber: number;
    inStock: string;
}

export class ProductFilteringAndSearchPage {
    private readonly minPriceSlider: Locator;
    private readonly maxPriceSlider: Locator;

    constructor(private page: Page) {        
        this.minPriceSlider = this.page.locator("//p[contains(text(),'Price Range (₹)')]/..//input[@data-index='0']");
        this.maxPriceSlider = this.page.locator("//p[contains(text(),'Price Range (₹)')]/..//input[@data-index='1']");
    }

    async filterCategory(categoryName: string) : Promise<void> {
        await this.page.getByRole('combobox').click();
        await this.page.getByRole('option', {selected: false}).filter({hasText: categoryName}).click();
    } 

    async setMinimumPrice(price: string): Promise<void> {
        await this.minPriceSlider.fill(price);
    }

    async setMaximumPrice(price: string): Promise<void> {
        await this.maxPriceSlider.fill(price);
    }

    async assertProductsPriceRange(minPrice: string, maxPrice: string): Promise<void> {
        const products = await this.getAllProducts();
        for(const product of products) {
            expect(product.price).toBeLessThanOrEqual(Number(maxPrice));
            expect(product.price).toBeGreaterThanOrEqual(Number(minPrice));
        }   
    }

    async getAllProducts(): Promise<ProductData[]> {
        // Implementation to fetch products and return as list of ProductData
        // each product has data in following form: <name> <category> • ₹<price> • ⭐ <number of stars> <in stock?>
        // example: Running Shoes Sports • ₹60 • ⭐ 2 In Stock
        const productContainer = this.page.locator(".MuiCard-root");
        //const productContainer = this.page.getByText("Products").locator("..//div");
        const productLocators = await productContainer.all();
        const products: ProductData[] = [];

        if (productLocators.length === 0) {
            return [];
        }

        for(const product of productLocators) {
            // if(productLocators.length==0)
            //     break;
            const name = await product.locator("p.MuiTypography-body1").innerText();
            const categoryAndPrice = await product.locator("p.MuiTypography-body2").innerText();
            const category = categoryAndPrice.substring(0,categoryAndPrice.indexOf(' '));
            const price = Number(categoryAndPrice.substring(categoryAndPrice.indexOf('₹'), categoryAndPrice.indexOf(' '))); //
            const starsNumber = Number(categoryAndPrice.slice(-1));
            const inStock = await product.locator("span.MuiTypography-caption").innerText();
            
            products.push({
                name,
                category,
                price,
                starsNumber,
                inStock
            });
        }
        return products;
    }

    async assertProductCategory(categoryName: string, products: ProductData[]) : Promise<void> {
        for(const product of products) {
            expect(product.category).toEqual(categoryName);
        }
    }
}