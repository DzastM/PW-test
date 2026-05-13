import { test, expect } from "@playwright/test";
import { ProductFilteringAndSearchPage } from "../pages/productFilteringAndSearch.page"

test.describe("Product filtering & search", () => {

  let productFilteringAndSearch: ProductFilteringAndSearchPage;

  const challengeURL = "/challenges/product-filtering";
  enum categories {
    Electronics = "Electronics",
    Sports = "Sports",
    Clothing = "Clothing"
  }
  enum filters {
    Category = "Category",
    Price = "Price",
    Stars = "Stars",
    InStock = "In Stock"
  }
  

  test.beforeEach(async ({page}) => {
    productFilteringAndSearch = new ProductFilteringAndSearchPage(page);
    await page.goto(challengeURL);
  });

  test("Filter products by category", async ({page}) => {
    await productFilteringAndSearch.filterCategory(categories.Electronics);
    await productFilteringAndSearch.assertProductCategory(categories.Electronics);
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
    await productFilteringAndSearch.filterCategory(categories.Sports);
    await productFilteringAndSearch.filterStars("5");
    await productFilteringAndSearch.filterStock();
    await productFilteringAndSearch.setMaximumPrice("60");
    await productFilteringAndSearch.resetFilters();
    await productFilteringAndSearch.verifyFilter(filters.Category);
    await productFilteringAndSearch.verifyFilter(filters.Price);
    await productFilteringAndSearch.verifyFilter(filters.Stars);
    await productFilteringAndSearch.verifyFilter(filters.InStock);
  });
});
