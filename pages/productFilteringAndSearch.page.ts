import { expect, Locator, Page } from "@playwright/test";

export interface ProductData {
    name: string;
    category: string;
    price: number;
    starsNumber: number;
    inStock: string;
}

export class ProductFilteringAndSearchPage {
    private readonly productContainer: Locator;

    constructor(private page: Page) {
        const nameLocator = 
        this.productContainer = this.page.getByText("Products").locator("..//div");
    }

    async filterCategory(categoryName: string) : Promise<void> {
        await this.page.getByRole('combobox').click();
        await this.page.getByRole('option', {selected: false}).filter({hasText: categoryName}).click();
    } 

    async getAllProducts(): Promise<ProductData[]> {
        // Implementation to fetch products and return as list of ProductData
        // each product has data in following form: <name> <category> • ₹<price> • ⭐ <number of stars> <in stock?>
        // example: Running Shoes Sports • ₹60 • ⭐ 2 In Stock
        const productLocators = await this.productContainer.all();
        const products: ProductData[] = [];

        for(const product of productLocators) {
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