import { expect, Locator, Page } from "@playwright/test";
import { ProductPurchasingPage } from "./productPurchasing.page";
import { Products } from "../interfaces/products.interface"
import { UserData } from "../interfaces/userData.interface";
import { user } from "../test-data/productPurchasing/productPurchasingTestData";

export class CartPage {
    private readonly cartContent: Locator;
    private readonly productName: Locator;
    private readonly productQuantity: Locator;
    private readonly productNumber: Locator;
    private readonly proceedToAddressButton: Locator;
    private readonly proceedToPaymentButton: Locator;
    private readonly payNowButton: Locator;
    private readonly fullMessage: Locator;
    private readonly cancelButton: Locator;
    private readonly failMessage: Locator;
    private readonly backToHome: Locator;

    constructor(private page: Page) {        
        this.cartContent = this.page.locator("css=.space-y-4 > div");
        this.productName = this.cartContent.locator("xpath=.//p[contains(.,'($')]");
        this.productQuantity = this.cartContent.locator("css=.space-x-2 > p");
        this.productNumber = this.cartContent.locator("css=.font-semibold");
        this.proceedToAddressButton = this.page.getByRole("button", {name: 'Proceed To Address'});
        this.proceedToPaymentButton = this.page.getByRole("button", {name: 'Proceed To Payment'});
        this.payNowButton = this.page.getByRole("button", {name: "Pay Now"});
        this.fullMessage = this.page.locator("css=.space-y-6 > div");
        this.cancelButton = this.page.getByRole("button").getByText("Cancel");
        this.failMessage = this.page.locator("css = .space-y-4 > h6");
        this.backToHome = this.page.getByRole("button").getByText("Back to Home");
    }

    async getCartItems() : Promise<Products[]> {
        const items: Products[] = [];
        const cartItems = await this.cartContent.all();
        //Cart content looks like this:
        //<product name><$price>       -<quantity>+      <$price>
        
        cartItems.forEach(async () =>  {
            const name = (await this.productName.innerText()).split('(')[0].trim();
            const quantity = await this.productQuantity.innerText();
            const price = (await this.productNumber.innerText()).split('$')[1].trim();
            
            items.push({ name, quantity, price });
        })
        
        return items;
    }
    
    async verifyCartContent(...expectedProducts: Products[]) {
        const actualProducts: Products[] = await this.getCartItems();

        for (const expectedProduct of expectedProducts) {
            const matchingItem = actualProducts.find(item => item.name === expectedProduct.name);
            expect(matchingItem).toBeDefined();

            expect(matchingItem?.price).toEqual(expectedProduct.price);
            expect(matchingItem?.quantity).toEqual(expectedProduct.quantity);
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
    
    async verifyProductCartData(productName: string, expectedQuantity?: number, expectedPrice?: number) {
        if(typeof expectedQuantity !== 'undefined') {
            const currentQuantity = Number(await this.cartContent.locator("xpath=.//p[contains(text(),'" + productName + "')]/following-sibling::div//p").innerText());
            expect(currentQuantity).toBe(expectedQuantity);
        }
        if(typeof expectedPrice !== 'undefined') {
            const currentPrice =  Number((await this.cartContent.locator("xpath=.//p[contains(text(),'" + productName + "')]/following-sibling::p").innerText()).split('$')[1].trim());
            expect(currentPrice).toBe(expectedPrice);
        }    
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

    async fillInCustomerData(userData: UserData) {        
        await this.cartContent.getByText("First Name").locator("xpath=./following-sibling::div//input").fill(userData.name);
        await this.cartContent.getByText("Last Name").locator("xpath=./following-sibling::div//input").fill(userData.surname);
        await this.cartContent.getByRole('textbox', {name: "Address"}).fill(userData.address);
    }

    async clickProceedToPaymentButton() {
        await this.proceedToPaymentButton.click();
    }

    async clickPayNowButton() {
        await this.payNowButton.click();
    }

    async assertSuccessMessage(expectedMessage: string) {        
        const actualMessage = (await this.fullMessage.locator("h5").innerText()).replace(/[^a-zA-Z0-9\s]/g, '').trim();
        expect(actualMessage).toEqual(expectedMessage);
    }
    
    async assertOrderData(userData: UserData, totalAmount: string, ...expectedProducts: Products[]) {
        const actualNameSurname = await this.page.locator("xpath = //div[h6='Billing Details:']//p[1]").innerText();
        const actualAddress = await this.page.locator("xpath = //div[h6='Billing Details:']//p[2]").innerText();
        const actualProductsData = await this.page.locator("xpath = //h6[text()='Order Summary:']/following-sibling::p").all();
        const items: Products[] = [];
        
        for(const product of actualProductsData) {
            const fullData = await product.innerText();
                // Bluetooth Speaker x 1 = $80
            const match = fullData.match(/(.*)\s+x\s+(\d+)\s+=\s+\$(\d+)/);
            if (!match) {
                continue;
            }
            const [, name, quantity, price] = match;

            items.push({
                name: name.trim(),
                quantity: quantity.trim(),
                price: price.trim()
            });
        };

        expect(actualNameSurname).toEqual(userData.name + " " + userData.surname);
        expect(actualAddress).toEqual(userData.address);

        for (const expectedProduct of expectedProducts) {
            const matchingItem = items.find(item => item.name === expectedProduct.name);
            
            expect(matchingItem).toBeDefined();

            expect(matchingItem?.price).toEqual(expectedProduct.price);
            expect(matchingItem?.quantity).toEqual(expectedProduct.quantity);
        }
    }

    async clickCancelButton() {
        await this.cancelButton.click();
    }

    async verifyFailMessage(expectedMessage: string) {
        const actualMessage = (await this.failMessage.innerText()).replace(/[^a-zA-Z0-9\s]/g, '').trim()
        expect(actualMessage).toEqual(expectedMessage);
    }

    async verifyGoHomeButtonState(expectedState: boolean) {
        if(expectedState) {
            expect(this.backToHome).toBeVisible();
        } else expect(this.backToHome).toBeHidden();   
    }

    async clickBackToHomeButton(): Promise<ProductPurchasingPage> {
        await this.backToHome.click();
        return new ProductPurchasingPage(this.page);
    }
}