import { expect, Locator, Page } from "@playwright/test";
import { ProductPurchasingPage } from "./productPurchasing.page";

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
//adjust for more than 1 product
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

    async fillInCustomerData(name: string, surname: string, address: string) {
        await this.cartContent.getByText("First Name").locator("xpath=./following-sibling::div//input").fill(name);
        await this.cartContent.getByText("Last Name").locator("xpath=./following-sibling::div//input").fill(surname);
        await this.cartContent.getByRole('textbox', {name: "Address"}).fill(address);
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
//verify for more than 1 product
    async assertOrderData(expectedNameSurname: string, expectedAddress: string, expectedProductsData: string, totalAmount: string) {
        const actualNameSurname = await this.page.locator("xpath = //div[h6='Billing Details:']//p[1]").innerText();
        const actualAddress = await this.page.locator("xpath = //div[h6='Billing Details:']//p[2]").innerText();
        const actualProductsData = await this.page.locator("xpath = //div[h6='Billing Details:']//p[3]").innerText();
        expect(actualNameSurname).toEqual(expectedNameSurname);
        expect(actualAddress).toEqual(expectedAddress);
        expect(actualProductsData).toEqual(expectedProductsData);
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