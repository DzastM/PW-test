import { test, expect } from '@playwright/test';

test('test', async ({ page }) => {
  await page.goto('https://demo-bank.vercel.app/');
  await page.getByTestId('login-input').fill('testlogi');
  await page.getByRole('link', { name: 'Demobank w sam raz do testów' }).press('Tab');
  await page.getByTestId('password-input').fill('testpass');
  await page.getByTestId('login-button').click();

  await expect(page.getByTestId('user-name')).toHaveText('Jan Demobankowy');

  await page.getByTestId('logout-button').click();

  
});
