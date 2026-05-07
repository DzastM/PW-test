import { expect, Locator, Page } from "@playwright/test";

export interface Products {
    name: string;
    quantity: string;
    price: string;
}

export class CartPage {
    private readonly cartContent: Locator;
    private readonly productName: Locator;
    private readonly productQuantity: Locator;
    private readonly productNumber: Locator;
    constructor(private page: Page) {        
        this.cartContent = this.page.locator("css=.space-y-4 > div");
        this.productName = this.cartContent.locator("xpath=.//p[contains(.,'($')]");
        this.productQuantity = this.cartContent.locator("css=.space-x-2 > p");
        this.productNumber = this.cartContent.locator("css=.font-semibold");
    }

    async getCartItems() : Promise<Products[]> {
        const items: Products[] = [];
        const cartItems = await this.cartContent.all();
        //Cart content looks like this:
        //<product name><$price>       -<quantity>+      <$price>
        
        for (const item of cartItems) {
            const name = (await this.productName.innerText()).split('(')[0].trim();
            const quantity = await this.productQuantity.innerText();
            const price = (await this.productNumber.innerText()).split('$')[1].trim();
            
            items.push({ name, quantity, price });
        }
        
        return items;
    }
    
    async verifyCartContent(productName: string, productQuantity: string, productPrice: string) {
        const items: Products[] = await this.getCartItems();
        for (const item of items) {
            expect(item.name).toEqual(productName);
            expect(item.price).toEqual(productPrice);
            expect(item.quantity).toEqual(productQuantity);
        }
    }
/*
    async clickViewCart(): Promise<CartPage> {
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
        */
}