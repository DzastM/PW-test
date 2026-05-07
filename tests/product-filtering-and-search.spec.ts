import { test, expect } from "@playwright/test";
import { ProductFilteringAndSearchPage } from "../pages/productFilteringAndSearch.page"

test.describe("Product filtering & search", () => {

  let productFilteringAndSearch: ProductFilteringAndSearchPage;

  const challengeURL = "/challenges/product-filtering";
  const categoryElectronics = "Electronics";
  const categorySports = "Sports";
  const categoryClothing = "Clothing";

  test.beforeEach(async ({page}) => {
    productFilteringAndSearch = new ProductFilteringAndSearchPage(page);
    await page.goto(challengeURL);
  });

  test("Filter products by category", async ({page}) => {
    await productFilteringAndSearch.filterCategory(categoryElectronics);
    await productFilteringAndSearch.assertProductCategory(categoryElectronics);
  });

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














  // test("prosty przelew", async ({ page }) => {


  //   await page.locator("#widget_1_transfer_receiver").selectOption(receiverId);
  //   await page.locator("#widget_1_transfer_amount").fill(transferAmount);    
  //   await page.locator("#widget_1_transfer_title").fill(transferTitle);

  //   await page.getByRole("button", { name: doItButton }).click();
  //   await page.getByTestId("close-button").click();
    
  //   await expect(page.locator("#show_messages")).toHaveText(
  //     `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - ${transferTitle}`);
  // });

  // test("doładownie telefonu", async ({ page }) => {
  //   await page.locator("#widget_1_topup_receiver").selectOption(topUpReceiver);
    
  //   await page.locator("#widget_1_topup_amount").fill(topUpAmount);
  //   await page.locator("#uniform-widget_1_topup_agreement").click();
  //   await page.getByRole("button", { name: "doładuj telefon" }).dblclick();
  //   await page.getByTestId("close-button").click();

  //   await expect(page.locator("#show_messages")).toHaveText(`Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReceiver}`);
  // });
});
