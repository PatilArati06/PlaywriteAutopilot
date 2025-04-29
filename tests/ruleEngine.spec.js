// @ts-nocheck

const { test, expect, request } = require('@playwright/test');
const { login,fetchRules,getGridColumnTextsByindex, checkDateInRange, getMonthInMmmFormat, waitForElementToVisible, getFullMonthName, createMapOfMap,createArrayOfMap, uploadInvoice, waitForAnalyzedSatatus, verifyAnalyzedSatatus , readPDF,getInvoiceNo, getInvoiceDate, getPaymentDueDate, getSubtotal, getTax, getTotalAmount, getformattedDate, getDescription, getPDFValWith1Regx, getNoOfItems, takeScreenShot, deleteAttachments,getRandomValue,getRandomValuesAsPerDataType,fetchInvoices,fetchInvoiceLineItemFields,fetchWorkflowByInvoiceId,getWorkflowDefination} = require('./Methods/common');
const {RuleEngineDataParser} = require('./Methods/csv_data_parser');
const { error } = require('console');

let testData;
test.beforeEach(async ({page}) => {
  await login(page, 'dev');
  testData = await RuleEngineDataParser('./mock-data/ruleEngineMockData.csv', 'TCID');
});


  test.only('T1. Add new rules', async({ page })=>{
    const [data] = testData;
 
    await page.getByText('Briq Tools', { exact: true }).click();
    await page.getByRole('link', { name: 'Autopilot Config' }).click();
    await page.waitForTimeout(400);
    await page.locator('div[role="tab"]:has-text("Rules engine")').click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Rules Engine Settings' }).click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Create Rule' }).click();
    const input = page.getByPlaceholder('Enter name');
    await input.fill(data.ruleName);
    await input.press('Enter');
    
    await page.locator('label:has-text("RULE TYPE") + input').click();
    await page.locator(`div[role="option"]:has-text("${data.ruleType}")`).click();
    await page.waitForTimeout(1000);

    await page.locator('label:has-text("DATA") + input').click();
    await page.locator(`div[role="option"]:has-text("${data.dataSource}")`).click();
    await page.waitForTimeout(1000);
    
  
    await page.locator('label:has-text("Field") + input').first().click();
    await page.locator(`div[role="option"]:has-text("${data.field1}")`).click();
    await page.waitForTimeout(1000);

   
    await page.locator('label:has-text("OPERATOR") + input').first().click();
    await page.locator('label:has-text("OPERATOR") + input').first().fill(data.operator);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text=' + data.operator).first().click();
    await page.waitForTimeout(1000);
 

    const inputDate = page.locator('label:has-text("Date Options") + input');

    if (await inputDate.isVisible()) {
        await page.locator('label:has-text("Date Options") + input').first().click();
        await page.locator('label:has-text("Date Options") + input').first().fill(data.dateOption);
        await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
        await page.locator('div[role="listbox"]:visible >> text='+data.dateOption).first().click();
        await page.waitForTimeout(1000);
    }

    await page.locator('label:has-text("COMPARE WITH") + input').first().click();
    await page.locator('label:has-text("COMPARE WITH") + input').first().fill(data.compareWith);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+ data.compareWith).first().click();
    await page.waitForTimeout(1000);


    const inputObject = page.locator('label:has-text("Object") + input');

if (await inputObject.isVisible()) {
    await page.locator('label:has-text("Object") + input').first().click();
    await page.locator('label:has-text("Object") + input').first().fill(data.object);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+data.object).first().click();
    await page.waitForTimeout(1000);
}
    

    const inputField = page.locator('label:has-text("Field") + input').nth(1);
    if (await inputField.isVisible()) {
      await page.locator('label:has-text("Field") + input').nth(1).click();
      await page.locator('label:has-text("Field") + input').nth(1).fill(data.field2);
      await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
      await page.locator('div[role="listbox"]:visible >> text='+data.field2).first().click();
      await page.waitForTimeout(1000);
    }else{
      await page.locator('input[placeholder="Value"]').first().fill(data.value1);
    await page.waitForTimeout(1000);
    }

    await page.locator('label:has-text("DESTINATION") + input').first().click();
    await page.locator('label:has-text("DESTINATION") + input').first().fill(data.destination);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+data.destination).first().click();
    await page.waitForTimeout(1000);

    await page.locator('label:has-text("TARGET") + input').first().click();
    await page.locator('label:has-text("TARGET") + input').first().fill(data.target);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+data.target).first().click();
    await page.waitForTimeout(1000);


    await page.locator('label:has-text("ASSIGN VALUE") + input').first().click();
    await page.locator('label:has-text("ASSIGN VALUE") + input').first().fill(data.assignValue);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+data.assignValue).first().click();
  
    await page.waitForTimeout(1000);

    const inputAssign = await page.locator('label:has-text("ASSIGN VALUE") + input');
    const selectedValue = await inputAssign.inputValue();
    if(selectedValue=='User Entry')
    {
    await page.locator('input[placeholder="Value"]').nth(1).fill(data.value2);
    }else{
      const dropdowns = await page.locator('label:has-text("Field") + input');
      const visibleCount = await dropdowns.locator(':visible').count();
      await page.locator('label:has-text("Field") + input').nth(visibleCount-1).click();
      await page.locator('label:has-text("Field") + input').nth(visibleCount-1).fill(data.field3);
      await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
      await page.locator('div[role="listbox"]:visible >> text='+data.field3).first().click();
      await page.waitForTimeout(1000);

    }
    await page.waitForTimeout(1000);
    await page.locator('button.dialog-v2-save-btn.workflows-modal-save-btn.ml-4').click();
    await page.waitForTimeout(5000);
    await page.locator('button.dialog-v2-close-btn').click();
    const popup = page.locator('div.v-dialog.v-dialog--active', { hasText: 'Unsaved changes' });

    if (await popup.isVisible()) {
      await popup.locator('button:has-text("Save")').click();
    }
    
    
    await page.waitForTimeout(10000);
    await page.locator('input[placeholder="Search"]').fill(data.ruleName);
    await page.waitForTimeout(3000);
    const rows = page.locator('table tbody tr', { hasText: data.ruleName });

    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
   
    await page.waitForTimeout(10000);
  });