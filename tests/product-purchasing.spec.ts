import { test } from "@playwright/test";
import { ProductPurchasingPage } from "../pages/productPurchasing.page"
import { CartPage } from "../pages/cartPage.page";
import { cartProducts, user } from "../test-data/productPurchasing/productPurchasingTestData"
import { userData } from "../test-data/userData";

test.describe("Product purchasing", () => {

  let productPurchasing: ProductPurchasingPage;
  let cart: CartPage;

  const challengeURL = "/challenges/product-purchasing";

  test.beforeEach(async ({page}) => {
    productPurchasing = new ProductPurchasingPage(page);
    await page.goto(challengeURL);
  });

  test("Add product to cart and verify", async ({page}) => {
    await productPurchasing.addProductsToCart(...cartProducts.add_to_cart_and_verify);
    cart = await productPurchasing.clickViewCartButton();
    await cart.verifyCartContent(...cartProducts.add_to_cart_and_verify);
  });

  test("Increase and decrease product quantity", async ({page}) => {
    await productPurchasing.addProductsToCart(...cartProducts.increase_decrease)
    cart = await productPurchasing.clickViewCartButton();
    await cart.updateProductQuantity("Wireless Headphones", 3);
    await cart.updateProductQuantity("Fitness Band", 3);
    await cart.updateProductQuantity("Wireless Headphones", 1);
    await cart.verifyProductCartData("Fitness Band", 3);
    await cart.verifyProductCartData("Wireless Headphones", 1);
  });

  test("Remove product from cart", async ({page}) => {
    await productPurchasing.addProductsToCart(...cartProducts.remove_product);
    cart = await productPurchasing.clickViewCartButton();
    await cart.updateProductQuantity("Wireless Headphones", 0);
    await cart.verifyCartContent(...cartProducts.remove_product);
  });

  test("Billing form validation", async ({page}) => {
    await productPurchasing.addProductsToCart(...cartProducts.billing_form_validation);
    cart = await productPurchasing.clickViewCartButton();
    await cart.clickProceedToAddressButton();
    await cart.assertProceedToPaymentButtonIsEnabled(false);
  });

  test("Successful payment flow", async ({page}) => {
    await productPurchasing.addProductsToCart(...cartProducts.successfull_payment_flow);
    cart = await productPurchasing.clickViewCartButton();
    await cart.clickProceedToAddressButton();
    await cart.fillInCustomerData(userData.userBigBird);
    await cart.clickProceedToPaymentButton();
    await cart.clickPayNowButton();
    await cart.assertSuccessMessage("Order Placed Successfully");
    await cart.assertOrderData(userData.userBigBird, "" , ...cartProducts.successfull_payment_flow);
  });

  test("Failed payment flow", async ({page}) => {
    await productPurchasing.addProductToCart("Fitness Band");
    cart = await productPurchasing.clickViewCartButton();
    await cart.clickProceedToAddressButton();
    await cart.fillInCustomerData(userData.userBigBird);
    await cart.clickProceedToPaymentButton();
    await cart.clickCancelButton();
    await cart.verifyFailMessage("Payment Failed");
    await cart.verifyGoHomeButtonState(true);
  });

  test("Go Home resets flow", async ({page}) => {
    await productPurchasing.addProductToCart("Fitness Band");
    cart = await productPurchasing.clickViewCartButton();
    await cart.clickProceedToAddressButton();
    await cart.fillInCustomerData(userData.userBigBird);
    await cart.clickProceedToPaymentButton();
    await cart.clickPayNowButton();
    productPurchasing = await cart.clickBackToHomeButton();
    await productPurchasing.verifyPageHeader("E-commerce End-to-End Product Purchasing Flow");
    await productPurchasing.verifyCartProductNumber(0);
  });
});
