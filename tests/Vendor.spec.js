// @ts-check
const { test, expect } = require('@playwright/test');
import fs from 'fs';
test.beforeEach(async ({ page }) => {
  const loginDetails = fs.readFileSync('logindetails.csv',{
    encoding: 'utf-8'
  })
  .split(',');

  await page.goto('https://app-dev.briq.com/#/pages/login');
  await page.waitForTimeout(6000);

  // Perform login
  await page.fill('input#login-page-email-input', loginDetails[0]);  // username
  await page.fill('input#login-page-password-input', loginDetails[1]); //password
  await page.click('button.login-button');  //login button selector
  test.setTimeout(120_000);
  
});

test('Vendor', async ({ page }) => {
    await page.getByRole('button', { name: 'Invoices' }).click();
    await page.getByRole('link', { name: 'Vendors' }).click();
    await page.getByRole('button', { name: 'Add Vendor' }).click();
    await page.locator('#input-1354').click();
    await page.locator('#input-1354').fill('BLUNT');
    await page.locator('#input-1357').click();
    await page.locator('#input-1357').fill('B25B23');
    await page.getByRole('combobox').click();
    await page.locator('#input-1361').click();
    await page.locator('#input-1361').fill('BBLUNT');
    await page.locator('#input-1367').click();
    await page.locator('#input-1367').fill('G500, Ganesham fitness & Sports');
    await page.locator('#input-1368').click();
    await page.locator('#input-1368').fill('Pune');
    await page.locator('#input-1369').click();
    await page.locator('#input-1369').fill('Maharashtra');
    await page.locator('#input-1370').click();
    await page.locator('#input-1370').fill('205121');
    await page.locator('#input-1372').click();
    await page.locator('#input-1372').fill('Raghav');
    await page.locator('#input-1373').click();
    await page.locator('#input-1373').fill('Patil');
    await page.locator('div').filter({ hasText: /^New Vendor$/ }).click();
    await page.locator('#app div').filter({ hasText: 'New Vendor Basic Default' }).nth(1).press('ArrowDown');
    await page.locator('#app div').filter({ hasText: 'New Vendor Basic Default' }).nth(1).press('ArrowDown');
    await page.getByRole('tab', { name: 'Default Allocation' }).click();
    await page.getByRole('tab', { name: 'Mapping Rules' }).click();
    await page.getByRole('tab', { name: 'Identification Rules' }).click();
    await page.getByRole('tab', { name: 'Default Allocation' }).click();
    await page.getByRole('tab', { name: 'Basic' }).click();
    await page.getByText('New Vendor Basic Default').click({
      button: 'right'
    });
    await page.getByRole('dialog').locator('div').filter({ hasText: 'Cancel Save' }).nth(3).click();    
});
