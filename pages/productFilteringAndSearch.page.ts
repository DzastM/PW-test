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
    private readonly inStockOnlyCheckbox: Locator;
    private readonly resetFiltersButton: Locator;
    private readonly categoryFilter: Locator;
    private readonly starsFilter: Locator;

    constructor(private page: Page) {        
        this.minPriceSlider = this.page.locator("//p[contains(text(),'Price Range (₹)')]/..//input[@data-index='0']");
        this.maxPriceSlider = this.page.locator("//p[contains(text(),'Price Range (₹)')]/..//input[@data-index='1']");
        this.inStockOnlyCheckbox = this.page.getByText("In Stock Only").locator("..").getByRole('checkbox');
        this.resetFiltersButton = this.page.getByRole("button", {name: "Reset Filters"});
        this.categoryFilter = this.page.getByRole('combobox');
        this.starsFilter = this.page.locator('label');
    }

    async filterCategory(categoryName: string) : Promise<void> {
        await this.categoryFilter.click();
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
        const productLocators = await productContainer.all();
        const products: ProductData[] = [];

        if (productLocators.length === 0) {
            return [];
        }

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

    async assertProductCategory(categoryName: string) : Promise<void> {
        const products = await this.getAllProducts();
        for(const product of products) {
            expect(product.category).toEqual(categoryName);
        }
    }

    async filterStars(starsNumber: string) : Promise<void> {
        await this.starsFilter.locator( ':text-is("' + starsNumber + ' Stars")').click({force: true});      
    }

    async assertProductStars(starsNumber: string) : Promise<void> {
        const products = await this.getAllProducts();
        for(const product of products) {
            expect(product.starsNumber).toBeGreaterThanOrEqual(Number(starsNumber));
        } 
    }

    async filterStock() : Promise<void> {
        await this.inStockOnlyCheckbox.click();
    }

    async assertProductsInStock(instock: string) : Promise<void> {
        const products = await this.getAllProducts();
        for(const product of products) {
            expect(product.inStock).toEqual(instock);
        }
    }

    async resetFilters() {
        await this.resetFiltersButton.click();
    }

    async verifyFilter(filterName: string) {
        switch(filterName) {
            case "Category":
                await expect(this.categoryFilter).toHaveText("All");
                break;
            case "Price":
                await expect(this.minPriceSlider).toHaveAttribute("aria-valuenow","0");
                await expect(this.maxPriceSlider).toHaveAttribute("aria-valuenow","1000");
                break;
            case "Rating":
                for(let value=0.5; value <= 5; value += 0.5) {
                    await expect(this.starsFilter.locator( ':text-is("' + value + ' Stars")').locator("//preceding-sibling::span")).toHaveClass("MuiRating-iconEmpty");
                }
                break;
            case "In Stock":                
                expect(await this.inStockOnlyCheckbox.isChecked()).toBeFalsy();
                break;
        }
    }
}