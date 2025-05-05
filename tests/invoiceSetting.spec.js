// @ts-nocheck

const { test, expect, request } = require('@playwright/test');
const { login,fetchRules,getGridColumnTextsByindex, checkDateInRange, getMonthInMmmFormat, waitForElementToVisible, getFullMonthName, createMapOfMap,createArrayOfMap, uploadInvoice, waitForAnalyzedSatatus, verifyAnalyzedSatatus , readPDF,getInvoiceNo, getInvoiceDate, getPaymentDueDate, getSubtotal, getTax, getTotalAmount, getformattedDate, getDescription, getPDFValWith1Regx, getNoOfItems, takeScreenShot, deleteAttachments,getRandomValue,getRandomValuesAsPerDataType,fetchInvoices,fetchInvoiceLineItemFields,fetchWorkflowByInvoiceId,getWorkflowDefination} = require('./Methods/common');
const {RuleEngineDataParser} = require('./Methods/csv_data_parser');
const { error } = require('console');

test.beforeEach(async ({page}) => {
  await login(page, 'dev');
});


  test('T1. Hide line item tab', async({ page })=>{
    //const data= await RuleEngineDataParser('./mock-data/ruleEngineMockData.csv', 'T1');
 
    //await page.getByText('ADMIN', { exact: true }).click();
    await page.click('div[role="button"] .v-list-item__title:has-text("Admin")');
    await page.getByRole('link', { name: 'Invoice Settings' }).click();
    await page.waitForTimeout(400);
    await page.locator('div[role="tab"]:has-text("Configuration")').click();
    await page.waitForTimeout(400);
    const section = page.locator('h5', { hasText: 'View line items' }).locator('..'); // Go to parent of the heading
    const radioGroup = section.locator('input[type="radio"][value="false"]'); // false = Off
    
    await radioGroup.check({ force: true });
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(400);
    await page.locator('button:has-text("Save Changes")').click();
    await page.waitForTimeout(500);
   
    await page.getByRole('button', { name: 'Invoices', exact: true }).click();
    await page.getByRole('link', { name: 'Invoices' }).click();
   // Check if the popup is visible
   const unsavedDialog = page.locator('div.v-dialog--active:has-text("Unsaved changes")');

   if (await unsavedDialog.isVisible()) {
     const saveButton = unsavedDialog.locator('button:has-text("Save")').last();
     await saveButton.click();
   }
    await page.waitForTimeout(1000);
    await page.getByLabel('Search card').fill('Automation Testing By playwright2.0');
    await page.locator("//strong[normalize-space()='Automation Testing By playwright2.0']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
    await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill('williams.pdf');
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    const tabGroup = page.locator('.v-slide-group__content');
    const lineItemTab = tabGroup.locator('div[role="tab"]', { hasText: 'Line Items' });
    await expect(lineItemTab).toHaveCount(0);
    await page.waitForTimeout(10000);
  });

  test.only('T2. Show line item tab', async({ page })=>{
    //const data= await RuleEngineDataParser('./mock-data/ruleEngineMockData.csv', 'T1');
 
    //await page.getByText('ADMIN', { exact: true }).click();
    await page.click('div[role="button"] .v-list-item__title:has-text("Admin")');
    await page.getByRole('link', { name: 'Invoice Settings' }).click();
    await page.waitForTimeout(400);
    await page.locator('div[role="tab"]:has-text("Configuration")').click();
    await page.waitForTimeout(400);
    const section = page.locator('h5', { hasText: 'View line items' }).locator('..'); // Go to parent of the heading
    const radioGroup = section.locator('input[type="radio"][value="true"]'); // false = Off
    
    await radioGroup.check({ force: true });
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Save' }).click();
    await page.waitForTimeout(400);
    await page.locator('button:has-text("Save Changes")').click();
    await page.waitForTimeout(500);
   
    await page.getByRole('button', { name: 'Invoices', exact: true }).click();
    await page.getByRole('link', { name: 'Invoices' }).click();
   // Check if the popup is visible
   const unsavedDialog = page.locator('div.v-dialog--active:has-text("Unsaved changes")');

   if (await unsavedDialog.isVisible()) {
     const saveButton = unsavedDialog.locator('button:has-text("Save")').last();
     await saveButton.click();
   }
    await page.waitForTimeout(1000);
    await page.getByLabel('Search card').fill('Automation Testing By playwright2.0');
    await page.locator("//strong[normalize-space()='Automation Testing By playwright2.0']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
    await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill('williams.pdf');
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(1000);
    await expect(page.locator('div[role="tab"]', { hasText: 'Line Items' })).toHaveCount(1);
    await page.waitForTimeout(1000);
  });
 