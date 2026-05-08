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
    private readonly proceedToAddressButton: Locator;
    private readonly proceedToPaymentButton: Locator;

    constructor(private page: Page) {        
        this.cartContent = this.page.locator("css=.space-y-4 > div");
        this.productName = this.cartContent.locator("xpath=.//p[contains(.,'($')]");
        this.productQuantity = this.cartContent.locator("css=.space-x-2 > p");
        this.productNumber = this.cartContent.locator("css=.font-semibold");
        this.proceedToAddressButton = this.page.getByRole("button", {name: 'Proceed To Address'});
        this.proceedToPaymentButton = this.page.getByRole("button", {name: 'Proceed To Payment'});
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

    async updateProductQuantity(productName: string, expectedQuantity: number) {
        const currentQuantity = Number(await this.cartContent.locator("xpath=.//p[contains(text(),'" + productName + "')]/following-sibling::div//p").innerText());
        const minusButton = this.cartContent.locator("xpath=.//p[contains(text(),'" + productName + "')]/following-sibling::div//button[1]");
        const plusButton = this.cartContent.locator("xpath=.//p[contains(text(),'" + productName + "')]/following-sibling::div//button[2]");
        if(currentQuantity > expectedQuantity) {
            for(let i=0; i<(currentQuantity-expectedQuantity);i++) {
                await minusButton.click();
            }
        } else if(currentQuantity < expectedQuantity) {
            for(let i=0; i<(expectedQuantity-currentQuantity);i++) {
                await plusButton.click();
            }
        }    
    }

    async verifyProductQuantity(productName: string, expectedQuantity: number) {
        const currentQuantity = Number(await this.cartContent.locator("xpath=.//p[contains(text(),'" + productName + "')]/following-sibling::div//p").innerText());
        expect(currentQuantity).toBe(expectedQuantity);
    }

    async clickProceedToAddressButton() {
        await this.proceedToAddressButton.click();
    }

    async assertProceedToPaymentButtonIsEnabled(state: boolean) {
        if(state) {
            await expect(this.proceedToPaymentButton).toBeEnabled();
        } else {
            await expect(this.proceedToPaymentButton).toBeDisabled();
        }
    }
}