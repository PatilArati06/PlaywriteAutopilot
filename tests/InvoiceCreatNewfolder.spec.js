// @ts-check
import fs from 'fs';
const { test, expect } = require('@playwright/test');
const { login } = require('./Methods/common');


const { chromium } = require('@playwright/test');
test.beforeEach(async ({ page }) => {
  await page.goto('https://app-dev.briq.com/#/pages/login');
  await page.waitForTimeout(12000);
  await login(page, 'dev');
  
});
test('1.Navigate to folders Homepage', async({ page })=>{
    await page.click("//div[text()='Invoices ']");
    await page.waitForTimeout(12000);
    await page.getByRole('button', { name: 'Add Folder' }).click();
    await page.getByLabel('Name your folder (Required)').click();
    await page.getByLabel('Name your folder (Required)').fill('Automation Testing By playwright');
    await page.getByLabel('Description (optional)').click();
    await page.getByLabel('Description (optional)').fill('Testing folder');
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.locator('div').filter({ hasText: /^Select Destination System$/ }).getByRole('button').click();
    await page.getByText('Other').click();
    await page.getByRole('button', { name: 'Create Folder' }).click();
});
test('2.Verify the creat new folder button ',async({ page})=>{
    await page.click("//div[text()='Invoices ']");
    await page.waitForTimeout(12000);
    await page.getByRole('button', { name: 'Add Folder' }).isVisible();
    
   
});
// @ts-ignore
test('3.Verify the creat new folder',async({ page})=>{
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByRole('button', { name: 'Add Folder' }).click();
  await page.getByLabel('Name your folder (Required)').click();
  await page.getByLabel('Name your folder (Required)').fill('Automation Testing By playwright');
  await page.getByLabel('Description (optional)').click();
  await page.getByLabel('Description (optional)').fill('Testing folder');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  //
  await page.locator('div').filter({ hasText: /^Select Destination System$/ }).getByRole('button').click();
  await page.getByText('Other').click();
  await page.getByRole('button', { name: 'Create Folder' }).click();
});

test('4.Verify the search by folder name ',async({ page})=>{
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill('Automation Testing By playwright');
  // await page.locator("//input[@type='text']").fill('automation');
  // @ts-ignore
  const element = page.locator("(//div[@class='col-md-5 col-lg-3 col-xl-3 col'])[1]");
  const text = await element.textContent();

  // Check if the string is contained
  expect(text).toContain('Automation Testing By playwright');
   
});

test('5. Verify edit and delete folder on the folder card', async ({ page }) => {
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator('.question-card-menu-button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Description (optional)').click();
  await page.getByLabel('Description (optional)').fill('Spend Automation edit');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  // await page.getByRole('button', { name: 'Netsuite - VendorBill - Create' }).click();
  await page.getByText('Other').click();
  await page.getByRole('button', { name: 'Save Folder' }).click();
  
});

test('6. Click and open the folder ', async ({ page }) => {
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  
});
test('7(a). . invoice with single line item', async ({ page }) => {
    await page.click("//div[text()='Invoices ']");
    await page.getByLabel('Search card').fill('Automation Testing By playwright');
    await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
    await page.waitForTimeout(12000);
    const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

    if (isVisible) {
      await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
      // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
      console.log('file found  ');
    }else{
      await page.getByRole('button', { name: 'Import', exact: true }).click();
      // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
      await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
    }
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByText('Done').click();
    
});
test('7(b).  Invoice with multiple line items', async ({ page }) => {
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  await page.waitForTimeout(12000);
  const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

  if (isVisible) {
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
    console.log('file found  ');
  }else{
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Done').click();
  
});

test('7(c). Invoice with vendor name detected', async ({ page }) => {
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  await page.waitForTimeout(12000);
  const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

  if (isVisible) {
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
    console.log('file found  ');
  }else{
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Done').click();
  
});

test('7(d). Invoice with vendor name not detected  ', async ({ page }) => {
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  await page.waitForTimeout(12000);
  const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

  if (isVisible) {
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
    console.log('file found  ');
  }else{
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Done').click();
  
});

test('7(e). Single page invoice ', async ({ page }) => {
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  await page.waitForTimeout(12000);
  const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

  if (isVisible) {
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
    console.log('file found  ');
  }else{
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Done').click();
  
});

test('7(f). Multipage invoice with same invoice number  ', async ({ page }) => {
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  await page.waitForTimeout(12000);
  const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

  if (isVisible) {
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
    console.log('file found  ');
  }else{
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Done').click();
  
});

test('7(g).Multipage invoice with different invoice number ', async ({ page }) => {
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  await page.waitForTimeout(12000);
  const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

  if (isVisible) {
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
    console.log('file found  ');
  }else{
    await page.getByRole('button', { name: 'Import', exact: true }).click();
    // await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\handshake_construction_2024-Oct-30 10_10_10.pdf');
    await page.getByLabel('Browse Files').setInputFiles('D:\\Briq\\PlaywrightAutopilet\\FilesToUpload\\City of Glendale _2024-Jun-04 13_06_07.pdf');
  }
  await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Done').click();
  
});


test('8.Verify Single and multiple selection of invoices from the table', async ({ page }) => {
  // await page.waitForTimeout(12000);
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  await page.waitForTimeout(12000);
  const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

  if (!isVisible) {
    await page.locator("//input[@id='headerChk']").click(); //click selectall checkbox
    //Verify all checkboxes in table checked or not
    const checkboxes = await page.locator("//div[@ref='eCheckbox']//input[@ref='eInput']");
    const checkboxCount = await checkboxes.count(); 
    for (let i = 0; i < checkboxCount; i++) {
      const checkbox = checkboxes.nth(i);
      const isChecked = await checkbox.isChecked();
      console.log(`Checkbox ${i + 1} is ${isChecked ? 'checked' : 'unchecked'}`);
      expect(isChecked).toBe(true); // This will fail if any checkbox is not checked
    }
    await page.locator("//input[@id='headerChk']").click();
    //Verify single checkbox selection
    const checkbox1 = checkboxes.nth(0);
    await checkbox1.click();
    const isChecked1 = await checkbox1.isChecked();
    console.log(`Checkbox ${0 + 1} is ${isChecked1 ? 'checked' : 'unchecked'}`);
    expect(isChecked1).toBe(true);
    for (let i = 1; i < checkboxCount; i++) {
      const checkbox = checkboxes.nth(i);
      const isChecked = await checkbox.isChecked();
      console.log(`Checkbox ${i + 1} is ${isChecked ? 'checked' : 'unchecked'}`);
      expect(isChecked).toBe(false); // This will fail if any checkbox is checked
    }

  }else{
    throw new Error('Invoices not present in table');
  }
  
  
});
//verify the tabs  - Pending review, Approved, Rejected, Needs Attention, Completed, Duplicate and Failure
test('9.verify the tabs  - Pending review, Approved, Rejected, Needs Attention, Completed, Duplicate and Failure', async ({ page }) => {
  // await page.waitForTimeout(12000);
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator('div').filter({ hasText: /^Automation Testing By playwright$/ }).nth(1).click();
  //list of tabs
const Pending_Review_tab =page.getByRole('tab', { name: 'Pending Review' });
const Pre_Approved_tab = page.getByRole('tab', { name: 'Pre Approved' });
const Ready_For_Writebackpage_tab = page.getByRole('tab', { name: 'Ready For Writeback' });
const Rejected_tab = page.getByRole('tab', { name: 'Rejected' });
const Approved_tab = page.getByRole('tab', { name: 'Approved', exact: true });
const Needs_Attention_tab = page.getByRole('tab', { name: 'Needs Attention' });
const Failure_tab = page.getByRole('tab', { name: 'Failure' });
const Completed_tab = page.getByRole('tab', { name: 'Completed' });
const Duplicate_tab = page.getByRole('tab', { name: 'Duplicate' });
const All_tab = page.getByRole('tab', { name: 'All' });


  if(await Pending_Review_tab.isVisible()){
    await Pending_Review_tab.click();
  }else{
    console.error(`Column name '${Pending_Review_tab}' not found in the table.`);
         return; // Exit test if column is not found
  }

  //const Pre_Approved_tab = page.getByRole('tab', { name: 'Pre Approved' });
  if(await Pre_Approved_tab.isVisible()){
    await Pre_Approved_tab.click();
  }else{
    console.error(`Column name '${Pre_Approved_tab}' not found in the table.`);
         return; // Exit test if column is not found
  }

 //const Ready_For_Writebackpage_tab = page.getByRole('tab', { name: 'Ready For Writeback' });
 if(await Ready_For_Writebackpage_tab.isVisible()){
  await Ready_For_Writebackpage_tab.click();
}else{
  console.error(`Column name '${Ready_For_Writebackpage_tab}' not found in the table.`);
       return; // Exit test if column is not found
}
  //await page.getByRole('tab', { name: 'Rejected' }).click();
  if(await Rejected_tab.isVisible()){
    await Rejected_tab.click();
    console.log("Column name '${Rejected_tab}' found in the table.`")
  }else{
    console.error(`Column name '${Rejected_tab}' not found in the table.`);
         return; // Exit test if column is not found
  }

  //await page.getByRole('tab', { name: 'Approved', exact: true }).click();
  if(await Approved_tab.isVisible()){
    await Approved_tab.click();
    console.log("Column name '${Approved_tab}' found in the table.`")
  }else{
    console.error(`Column name '${Approved_tab}' not found in the table.`);
         return; // Exit test if column is not found
  }

  //await page.getByRole('tab', { name: 'Needs Attention' }).click();
  if(await Needs_Attention_tab.isVisible()){
    await Needs_Attention_tab.click();
    console.log("Column name '${Needs_Attention_tab}' found in the table.`")
  }else{
    console.error(`Column name '${Needs_Attention_tab}' not found in the table.`);
         return; // Exit test if column is not found
  }

  //await page.getByRole('tab', { name: 'Failure' }).click();
  if(await Failure_tab.isVisible()){
    await Failure_tab.click();
    console.log("Column name '${Failure_tab}' found in the table.`")
  }else{
    console.error(`Column name '${Failure_tab}' not found in the table.`);
         return; // Exit test if column is not found
  }
  //await page.getByRole('tab', { name: 'Completed' }).click();
  if(await Completed_tab.isVisible()){
    await Completed_tab.click();
    console.log("Column name '${Completed_tab}' found in the table.`")
  }else{
    console.error(`Column name '${Completed_tab}' not found in the table.`);
         return; // Exit test if column is not found
  }
  //await page.getByRole('tablist').locator('i').nth(1).click();
 // await page.getByRole('tab', { name: 'Duplicate' }).click();
 if(await Duplicate_tab.isVisible()){
  await Duplicate_tab.click();
  console.log("Column name '${Duplicate_tab}' found in the table.`")
}else{
  console.error(`Column name '${Duplicate_tab}' not found in the table.`);
       return; // Exit test if column is not found
}
  //await page.getByRole('tab', { name: 'All' }).click();
  if(await All_tab.isVisible()){
    await All_tab.click();
    console.log("Column name '${All_tab}' found in the table.`")
  }else{
    console.error(`Column name '${All_tab}' not found in the table.`);
         return; // Exit test if column is not found
  }
});

//Verify the Search bar - by File name, invoice number, Vendor name
test ('10.Verify the Search bar - by File name, invoice number, Vendor name', async ({ page }) => {
   await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  // await page.goto('https://app-dev.briq.com/#/spend-management/invoices');
  // await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator('div').filter({ hasText: /^Automation Testing By playwright$/ }).nth(1).click();
  await page.getByLabel('Search card').fill('City of Glendale _2024-Jun-04 13_06_07.pdf')
  // await page.getByLabel('Search card').press('Enter');;
 
});

// 11 folder total rows 
test ('11 folder total rows', async ({ page }) => {
  await page.waitForTimeout(12000);

 await page.getByRole('link', { name: 'Invoices' }).click();
 // await page.goto('https://app-dev.briq.com/#/spend-management/invoices');
 // await page.click("//div[text()='Invoices ']");
 await page.getByLabel('Search card').fill('Automation Testing By playwright');
 await page.locator('div').filter({ hasText: /^Automation Testing By playwright$/ }).nth(1).click();
 await page.getByLabel('Search card').fill('City of Glendale _2024-Jun-04 13_06_07.pdf');
 await page.getByLabel('Search card').press('Enter');
const expectedfileName = 'City of Glendale _2024-Jun-04 13_06_07.pdf';

const searchfile = await page.getByRole('gridcell', { name: expectedfileName })
     if (await searchfile.isVisible()) {
         await searchfile.click();
     } else {
         console.error(`File name '${expectedfileName}' not found in the list.`);
         return; // Exit test if file is not found
     }


 // Get all rows of the table
 const rows = await page.locator('.p-2');

 // Count total visible rows
 const totalRows = await rows.count();
 console.log(`Total rows found after search: ${totalRows}`);

 
 for (let i = 0; i < totalRows; i++) {
     // Get the text content of the 3rd column in the current row
     const columnText = await rows.nth(i).locator('td:nth-child(3)').innerText();

     // Check if the column text matches the expected file name
     if (columnText.trim() !== expectedfileName) {
         console.log(`Row ${i + 1}: MISMATCH - Found "${columnText}", expected "${expectedfileName}"`);
     } else {
         console.log(`Row ${i + 1}: PASSED - Correct file name "${columnText}"`);
     }
 }


});
//12.Verification of invoice import success and analyze
test ('12. Verification of invoice import success and analyze', async ({ page }) => {
  await page.waitForTimeout(120000);

 await page.getByRole('link', { name: 'Invoices' }).click();
 await page.getByLabel('Search card').fill('Automation Testing By playwright');
 await page.locator('div').filter({ hasText: /^Automation Testing By playwright$/ }).nth(1).click();
 await page.getByLabel('Search card').fill('City of Glendale _2024-Jun-04 13_06_07.pdf');
//  await page.getByLabel('Search card').press('Enter');
const expectedfileName = 'City of Glendale _2024-Jun-04 13_06_07.pdf';

const searchfile = await page.getByRole('gridcell', { name: expectedfileName })
     if (await searchfile.isVisible()) {
         await searchfile.click();
     } else {
         console.error(`File name '${expectedfileName}' not found in the list.`);
         return; // Exit test if file is not found
     }

// await page.getByRole('columnheader', { name: 'Status', exact: true })
try {
 const filestatuscolumn =await page.getByRole('columnheader',{ name: 'Status', exact: true })
 if (await filestatuscolumn.isVisible() && page.getByRole('gridcell', { name: 'Analyzed' }).first()) {
     await filestatuscolumn.click();
     console.log('file status found in the table:Analyzed ');
 } else {
     console.error(`File status '${filestatuscolumn}' not found in the list.`);
     
     return; // Exit test if file status not found
     
 }
 } catch (error) {
  console.log('file status not found in the table');
}
});
//13. Verify Approve, Reject, Reanalyze, Delete and move buttons on the listing page
test ('13. Verify Approve, Reject, Reanalyze, Delete and move buttons on the listing page', async ({ page }) => {
  await page.waitForTimeout(120000);

 await page.getByRole('link', { name: 'Invoices' }).click();
 // await page.goto('https://app-dev.briq.com/#/spend-management/invoices');
 // await page.click("//div[text()='Invoices ']");
 await page.getByLabel('Search card').fill('Automation Testing By playwright');
 await page.locator('div').filter({ hasText: /^Automation Testing By playwright$/ }).nth(1).click();
 await page.getByLabel('Search card').fill('City of Glendale _2024-Jun-04 13_06_07.pdf');
//  await page.getByLabel('Search card').press('Enter');
const expectedfileName = 'City of Glendale _2024-Jun-04 13_06_07.pdf';

const searchfile = await page.getByRole('gridcell', { name: expectedfileName })
     if (await searchfile.isVisible()) {
         await searchfile.click();
     } else {
         console.error(`File name '${expectedfileName}' not found in the list.`);
         return; // Exit test if file is not found
     }

     await page.getByRole('row', { name: 'Toggle Row Selection   City' }).getByLabel('Toggle Row Selection').check();
  //   await page.getByRole('button', { name: 'Reanalyze' }).click();
  try {
 const Reanalyze_button = page.getByRole('button', { name: 'Reanalyze' });

 if (await Reanalyze_button.isVisible()) {
     await Reanalyze_button.click();
     console.log('Reanalyze button found on the listing page ');
 } else {
     console.error(`Reanalyze button '${Reanalyze_button}' not on the listing page.`);
     
     return; // Exit test if Reanalyze button not found
     
 }
 } catch (error) {
  console.log('Reanalyze button not on the listing page');
}
  
  //await page.getByRole('button', { name: 'Cancel' }).click();
    try {
      const Cancel_button = page.getByRole('button', { name: 'Cancel' });
    
      if (await Cancel_button.isVisible()) {
          await Cancel_button.click();
          console.log('Cancel button found on the listing page ');
      } else {
          console.error(`Cancel_button '${Cancel_button}' not on the listing page.`);
          
          return; // Exit test if Cancel_button not found
          
      }
      } catch (error) {
      console.log('Cancel_button is not on the listing page');
    }
  //await page.getByRole('button', { name: 'Split' }).click();
  try {
    const Split_button = page.getByRole('button', { name: 'Split' });
   
    if (await Split_button.isVisible()) {
        await Split_button.click();
        console.log('Split_button found on the listing page ');
    } else {
        console.error(`Split_button '${Split_button}' not on the listing page.`);
        
        return; // Exit test if Split_button not found
        
    }
    } catch (error) {
     console.log('Split_button is not on the listing page');
   }
  await page.getByRole('button', { name: 'Cancel' }).click();

  //await page.getByRole('button', { name: 'Move' }).click();
  try {
    const Move_button = page.getByRole('button', { name: 'Move' });
   
    if (await Move_button.isVisible()) {
        await Move_button.click();
        console.log('Move_button found on the listing page ');
    } else {
        console.error(`Move_button '${Move_button}' not on the listing page.`);
        
        return; // Exit test if Move_button not found
        
    }
    } catch (error) {
     console.log('Move_button is not on the listing page');
   } 
  await page.locator('div').filter({ hasText: /^Move Invoices$/ }).first().click();
  await page.getByRole('button', { name: 'Cancel' }).click();
  await page.getByRole('row', { name: 'Toggle Row Selection   City' }).getByLabel('Toggle Row Selection').check();

 // await page.getByRole('button', { name: 'Delete' }).click();
 try {
  const Delete_button = page.getByRole('button', { name: 'Delete' });
 
  if (await Delete_button.isVisible()) {
      await Delete_button.click();
      console.log('Delete_button found on the listing page ');
  } else {
      console.error(`Delete_button '${Delete_button}' not on the listing page.`);
      
      return; // Exit test if Delete_button not found
      
  }
  } catch (error) {
   console.log('Delete_button is not on the listing page');
 } 
  await page.getByRole('button', { name: 'Cancel' }).click();

});