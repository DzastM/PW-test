import { test, expect } from "@playwright/test";

test.describe("Pulpit tests", () => {
  test("prosty przelew", async ({ page }) => {
    await page.goto("https://demo-bank.vercel.app/");
    await page.getByTestId("login-input").fill("testlogi");
    await page.getByTestId("password-input").fill("testpass");
    await page.getByTestId("login-button").click();

    await page.locator("#widget_1_transfer_receiver").selectOption("2");
    await page.locator("#widget_1_transfer_amount").fill("150");
    await page.locator("#widget_1_transfer_title").fill("zwrot środków");
    await page.getByRole("button", { name: "wykonaj" }).click();
    await page.getByTestId("close-button").click();

    await expect(page.locator("#show_messages")).toHaveText(
      "Przelew wykonany! Chuck Demobankowy - 150,00PLN - zwrot środków",
    );
  });

  test("doładownie telefonu", async ({ page }) => {

    await page.goto("https://demo-bank.vercel.app/");
    await page.getByTestId("login-input").fill("testlogi");
    await page.getByTestId("password-input").fill("testpass");
    await page.getByTestId("login-button").click();
    await page.locator("#widget_1_topup_receiver").selectOption("500 xxx xxx");
    await page.locator("#widget_1_topup_amount").fill("40");
    await page.locator("#uniform-widget_1_topup_agreement").click();
    await page.getByRole("button", { name: "doładuj telefon" }).dblclick();
    await page.getByTestId("close-button").click();

    await expect(page.locator("#show_messages")).toHaveText("Doładowanie wykonane! 40,00PLN na numer 500 xxx xxx");
  });
});
