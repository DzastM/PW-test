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
    
  });

  test("Failed payment flow", async ({page}) => {
    
  });

  test("Go Home resets flow", async ({page}) => {
    
  });
/*
  test("Filter products by price range", async ({page}) => {
    await productFilteringAndSearch.setMinimumPrice("10");
    await productFilteringAndSearch.setMaximumPrice("70");
    await productFilteringAndSearch.assertProductsPriceRange("10","70");
  });

  test("Filter products by minimum rating", async ({page}) => {
    await productFilteringAndSearch.filterStars("3");
    await productFilteringAndSearch.assertProductStars("3");
  });

  test("Filter products by stock content", async ({page}) => {
    await productFilteringAndSearch.filterStock();
    await productFilteringAndSearch.assertProductsInStock("In Stock");
  });

  test("Reset filters", async({page}) => {
    await productFilteringAndSearch.filterCategory("Sports");
    await productFilteringAndSearch.filterStars("5");
    await productFilteringAndSearch.filterStock();
    await productFilteringAndSearch.setMaximumPrice("60");
    await productFilteringAndSearch.resetFilters();
    await productFilteringAndSearch.verifyFilter("Category");
    await productFilteringAndSearch.verifyFilter("Price");
    await productFilteringAndSearch.verifyFilter("Stars");
    await productFilteringAndSearch.verifyFilter("In Stock");
  });
  */
});
