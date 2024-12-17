// @ts-check

import fs from 'fs';
const { test, expect } = require('@playwright/test');

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
  await page.waitForTimeout(48000);
  await page.click("//a[@class='childNavItem activeSubLink v-list-item--active v-list-item v-list-item--link theme--light']");
    await page.waitForTimeout(12000);
    await page.fill('input[type="text"]', 'AutomationTesting-v2');
    await page.waitForTimeout(6000);
    await page.click(".v-card.v-card--link.v-sheet");
    await page.waitForTimeout(15000);
    
    await page.getByLabel('Toggle Row Selection').check();
    await page.waitForTimeout(6000);
    await page.getByText('Wesco.pdf').click();
    await page.waitForTimeout(35000);
    await page.locator("//input[@name='Job_Name__custom']").scrollIntoViewIfNeeded();
    await page.waitForTimeout(6000);
    await page.fill('//input[@name="Job_Name__custom"]', 'Sanket Test');
    await page.waitForTimeout(6000);
    await page.click("//span[text()=' Save ']");
    
    await page.locator('//div[@class="ml-1"]').click();
    await page.waitForTimeout(6000);
    await page.getByText('Log out').click();
    await page.waitForTimeout(6000);
  
});



// test.describe('New Todo', () => {
//   test('should allow me to add todo items', async ({ page }) => {
//     await page.waitForTimeout(48000);
//     await page.click("//div[text()='Invoices ']");
//     await page.waitForTimeout(12000);
//     await page.fill('input[type="text"]', 'AutomationTesting-v2');
//     await page.waitForTimeout(6000);
//     await page.click(".v-card.v-card--link.v-sheet");
//     await page.waitForTimeout(15000);
    
//     await page.getByLabel('Toggle Row Selection').check();
//     await page.waitForTimeout(6000);
//     await page.getByText('Wesco.pdf').click();
//     await page.waitForTimeout(35000);
//     await page.locator("//input[@name='Job_Name__custom']").scrollIntoViewIfNeeded();
//     await page.waitForTimeout(6000);
//     await page.fill('//input[@name="Job_Name__custom"]', 'Sanket Test');
//     await page.waitForTimeout(6000);
//     await page.click("//span[text()=' Save ']");
    
//     await page.locator('//div[@class="ml-1"]').click();
//     await page.waitForTimeout(6000);
//     await page.getByText('Log out').click();
//     await page.waitForTimeout(6000);
//    // await browser.close();
//   });
// });

