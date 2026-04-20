import { test, expect } from "@playwright/test";

test.describe("Pulpit tests", () => {

  const url = "https://demo-bank.vercel.app/";
  const username = "testlogi";
  const password = "testpass";
  const topUpAmount = "40"; 
  const topUpReceiver = "500 xxx xxx";
  const transferAmount = "150";
  const transferTitle = "zwrot środków";
  const doItButton = "wykonaj";
  const receiverId = "2";

  test("prosty przelew", async ({ page }) => {
    await page.goto(url);
    await page.getByTestId("login-input").fill(username);
    await page.getByTestId("password-input").fill(password);
    await page.getByTestId("login-button").click();

    await page.locator("#widget_1_transfer_receiver").selectOption(receiverId);
    await page.locator("#widget_1_transfer_amount").fill(transferAmount);    
    await page.locator("#widget_1_transfer_title").fill(transferTitle);

    await page.getByRole("button", { name: doItButton }).click();
    await page.getByTestId("close-button").click();
    
    await expect(page.locator("#show_messages")).toHaveText(
      `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - ${transferTitle}`);
  });

  test("doładownie telefonu", async ({ page }) => {

    await page.goto(url);
    await page.getByTestId("login-input").fill(username);
    await page.getByTestId("password-input").fill(password);
    await page.getByTestId("login-button").click();
    await page.locator("#widget_1_topup_receiver").selectOption(topUpReceiver);
    
    await page.locator("#widget_1_topup_amount").fill(topUpAmount);
    await page.locator("#uniform-widget_1_topup_agreement").click();
    await page.getByRole("button", { name: "doładuj telefon" }).dblclick();
    await page.getByTestId("close-button").click();

    
    await expect(page.locator("#show_messages")).toHaveText(`Doładowanie wykonane! ${topUpAmount},00PLN na numer ${topUpReceiver}`);
  });
});
