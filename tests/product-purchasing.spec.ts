import { test, expect } from "@playwright/test";
import { ProductPurchasingPage } from "../pages/productPurchasing.page"
import { CartPage } from "../pages/cartPage.page";
import { waitForDebugger } from "node:inspector";

test.describe("Product purchasing", () => {

  let productPurchasing: ProductPurchasingPage;
  let cart: CartPage;

  const challengeURL = "/challenges/product-purchasing";
  const categoryElectronics = "Electronics";
  const categorySports = "Sports";
  const categoryClothing = "Clothing";

  test.beforeEach(async ({page}) => {
    productPurchasing = new ProductPurchasingPage(page);
    await page.goto(challengeURL);
  });

  test("Add product to cart and verify", async ({page}) => {
    await productPurchasing.addProductToCart("Smartphone Stand");
    cart = await productPurchasing.clickViewCartButton();
    await cart.verifyCartContent("Smartphone Stand", "1", "45");
  });

  test("Increase and decrease product quantity", async ({page}) => {
    await productPurchasing.addProductToCart("Wireless Headphones");
    await productPurchasing.addProductToCart("Fitness Band");
    cart = await productPurchasing.clickViewCartButton();
    await cart.updateProductQuantity("Wireless Headphones", 3);
    await cart.updateProductQuantity("Fitness Band", 3);
    await cart.updateProductQuantity("Wireless Headphones", 1);
    await cart.verifyProductQuantity("Fitness Band", 3);
    await cart.verifyProductQuantity("Wireless Headphones", 1);
  });

  test("Remove product from cart", async ({page}) => {
    await productPurchasing.addProductToCart("Wireless Headphones");
    await productPurchasing.addProductToCart("Fitness Band");
    cart = await productPurchasing.clickViewCartButton();
    await cart.updateProductQuantity("Wireless Headphones", 0);
    await cart.verifyCartContent("Fitness Band", "1", "60");
  });

  test("Billing form validation", async ({page}) => {
    await productPurchasing.addProductToCart("Bluetooth Speaker");
    cart = await productPurchasing.clickViewCartButton();
    await cart.clickProceedToAddressButton();
    await cart.assertProceedToPaymentButtonIsEnabled(false);
  });

  test("Successful payment flow", async ({page}) => {
    await productPurchasing.addProductToCart("Fitness Band");
    cart = await productPurchasing.clickViewCartButton();
    await cart.clickProceedToAddressButton();
    await cart.fillInCustomerData("John", "Doe", "Sesame Street 123");
    await cart.clickProceedToPaymentButton();
    await cart.clickPayNowButton();
    await cart.assertSuccessMessage("Order Placed Successfully");
    await cart.assertOrderData("John Doe", "Sesame Street 123", "Fitness Band x 1 = $60", "$60");
  });

  test("Failed payment flow", async ({page}) => {
    await productPurchasing.addProductToCart("Fitness Band");
    cart = await productPurchasing.clickViewCartButton();
    await cart.clickProceedToAddressButton();
    await cart.fillInCustomerData("John", "Doe", "Sesame Street 123");
    await cart.clickProceedToPaymentButton();
    await cart.clickCancelButton();
    await cart.verifyFailMessage("Payment Failed");
    await cart.verifyGoHomeButtonState(true);
  });

  test.only("Go Home resets flow", async ({page}) => {
    await productPurchasing.addProductToCart("Fitness Band");
    cart = await productPurchasing.clickViewCartButton();
    await cart.clickProceedToAddressButton();
    await cart.fillInCustomerData("John", "Doe", "Sesame Street 123");
    await cart.clickProceedToPaymentButton();
    await cart.clickPayNowButton();
    productPurchasing = await cart.clickBackToHomeButton();
    await productPurchasing.verifyPageHeader("E-commerce End-to-End Product Purchasing Flow");
    await productPurchasing.verifyCartProductNumber(0);
  });
});
