import { test } from "@playwright/test";
import { ProductListingAndPaginationPage } from "../pages/productListingPagination.page"
import { CartPage } from "../pages/cartPage.page";
import { cartProducts, user } from "../test-data/productPurchasing/productPurchasingTestData"
import { userData } from "../test-data/userData";

test.describe("Product listing & pagination", () => {

  let productListingAndPagination: ProductListingAndPaginationPage;
  let cart: CartPage;

  const challengeURL = "/challenges/product-listing-pagination";

  test.beforeEach(async ({page}) => {
    productListingAndPagination = new ProductListingAndPaginationPage(page);
    await page.goto(challengeURL);
  });

  test("Count products in each category", async ({page}) => {

  });

  test("Find specific product and identify its page", async ({page}) => {

  });

  test("Find highest rated product in each category", async ({page}) => {

  });

  test("Billing form validation", async ({page}) => {

  });

  test("Find most expensive product in each category", async ({page}) => {
   
  });

  test("Validate pagination controls", async ({page}) => {

  });

  test("Verify product card details format", async ({page}) => {

  });
});
