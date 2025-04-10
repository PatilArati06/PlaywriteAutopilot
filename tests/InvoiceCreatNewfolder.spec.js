// @ts-check

const { test, expect, request } = require('@playwright/test');
// const { chromium } = require('playwright');
const { login,getGridColumnTextsByindex, checkDateInRange, getMonthInMmmFormat, waitForElementToVisible, getFullMonthName, createMapOfMap,createArrayOfMap, uploadInvoice, waitForAnalyzedSatatus, verifyAnalyzedSatatus , readPDF,getInvoiceNo, getInvoiceDate, getPaymentDueDate, getSubtotal, getTax, getTotalAmount, getformattedDate, getDescription, getPDFValWith1Regx, getNoOfItems, takeScreenShot, deleteAttachments,getRandomValue,getRandomValuesAsPerDataType,fetchInvoices } = require('./Methods/common');
const { error } = require('console');

// let browser,page;
var testData = new Map();

(async () => {
  testData = await createMapOfMap('testData.csv', 'TCID');
  
})();

var AlllineItemsFields = [];
test.beforeEach(async ({page}) => {
 // await page.goto('https://app-dev.briq.com/#/pages/login');
  //await page.waitForTimeout(12000);
  // console.log("in beforeEach..........")
  // browser = await chromium.launch();
  // const context = await browser.newContext();
  // page = await context.newPage(); 
  await login(page, 'dev');
  (async () => {
    AlllineItemsFields = await createArrayOfMap('Handshake_Construction_lineItemsFields.csv');
    
  })();
  
});
// test.afterEach(async () => {
//   await browser.close(); // Ensure the browser is closed
// console.log('Tests completed. Closing the browser...');
// });


test('1.Navigate to folders Homepage', async({ page })=>{
    await page.click("//div[text()='Invoices ']");
    await page.waitForTimeout(12000);
    let addFolder = false;
     
    addFolder = await page.getByRole('button', { name: 'Add Folder' }).isVisible();
    let count = 0;
    while(!addFolder){
      if(count == 10){
        break;
      }
      await page.waitForTimeout(10000);
      addFolder = await page.getByRole('button', { name: 'Add Folder' }).isVisible();
      count++;
    }
    // console.log("##### "+addFolder);
    // addFolder = false;
    if(addFolder == true){
      takeScreenShot(page,'Add Folder button','folderhome');
    
  }
    await expect(addFolder).toEqual(true);
  
});
 test('2.Verify the add folder button ',async({ page})=>{
  
    // await test.step('Navigate to Invoices', async () => {
      await page.click("//div[text()='Invoices ']");
      // await page.screenshot({ path: 'screenshots/invoices.png' });
    // });
    
    await page.waitForTimeout(12000);
    let addFolder = false;
     
    addFolder = await page.getByRole('button', { name: 'Add Folder' }).isVisible();
    let count = 0;
    while(!addFolder){
      if(count == 10){
        break;
      }
      await page.waitForTimeout(10000);
      addFolder = await page.getByRole('button', { name: 'Add Folder' }).isVisible();
      count++;
    }
    // console.log("##### "+addFolder);
    // addFolder = false;
    if(addFolder == true){
      takeScreenShot(page,'Add Folder button','addFolder');
    
  }
    await expect(addFolder).toEqual(true);
    
});
// @ts-ignore
test('3.Verify the creat folder',async({ page})=>{
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByRole('button', { name: 'Add Folder' }).click();
  await page.getByLabel('Name your folder (Required)').click();
  const folderName = testData.get('3').get('FolderName');
  const DescriptionForCreateFolder = testData.get('3').get('DescriptionForCreateFolder');
  const OCRModelTypeSpend = testData.get('3').get('OCRModelTypeSpend');
  await page.getByLabel('Name your folder (Required)').fill(folderName);
  await page.getByLabel('Description (optional)').click();
  await page.getByLabel('Description (optional)').fill(DescriptionForCreateFolder);
  await page.getByRole('button', { name: 'OCR Model Type (optional) Spend' }).click();
  await page.getByRole('option', { name: 'Spend 2.0' }).locator('div').first().click();
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  
  await page.locator('div').filter({ hasText: /^Select Destination System$/ }).getByRole('button').click();
  await page.getByText('Other').click();
  let createFolder = false;
  createFolder = await page.getByRole('button', { name: 'Create Folder' }).isVisible();
  let count = 0;
    while(!createFolder){
      if(count == 10){
        break;
      }
      await page.waitForTimeout(10000);
      createFolder = await page.getByRole('button', { name: 'Create Folder' }).isVisible();
      count++;
    }
    // console.log("##### "+createFolder);
  if(createFolder == true){
    takeScreenShot(page,'Create Folder button','createFolder');
 
}
  await expect(createFolder).toEqual(true);
  await page.getByRole('button', { name: 'Create Folder' }).click();
 
  // let isVisible = false;
  // isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();
  // await expect(isVisible).toEqual(true);

  // let isTextVisible = false;
  // isTextVisible = await page.getByText("Card createdx").isVisible();
  // count = 0;
  // while(!isTextVisible){
  //   if(count == 10){
  //     break;
  //   }
  //   await page.waitForTimeout(10000);
  //   isTextVisible = await page.getByText("Card createdx").isVisible();
  //   count++;
  // }
  takeScreenShot(page,'Folder Created','createFolder1');
 
    // expect(isTextVisible).toEqual(true);
});

test('4.Verify the search by folder name',async({ page})=>{
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill('Automation Testing By playwright');
  // await page.locator("//input[@type='text']").fill('automation');
  // @ts-ignore
  const element = page.locator("(//div[@class='col-md-5 col-lg-3 col-xl-3 col'])[1]");
  const text = await element.textContent();
  takeScreenShot(page,'folder name','folderName');
  
  // Check if the string is contained
  expect(text).toContain('Automation Testing By playwright');
   
});

test('5. Verify edit and delete folder on the folder card', async ({ page }) => {
  await page.getByRole('link', { name: 'Invoices' }).click();

  //create folder for edit
  await page.getByRole('button', { name: 'Add Folder' }).click();
  await page.getByLabel('Name your folder (Required)').click();
  await page.getByLabel('Name your folder (Required)').fill('New Folder for testing');
  await page.getByLabel('Description (optional)').click();
  await page.getByLabel('Description (optional)').fill('Testing folder new');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  await page.locator('div').filter({ hasText: /^Select Destination System$/ }).getByRole('button').click();
  await page.getByText('Other').click();
  await page.getByRole('button', { name: 'Create Folder' }).click();
  // await page.locator("//i[@class='v-icon notranslate mdi mdi-close theme--light']").click();

  //search new created folder and edit
  // await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByRole('button', { name: 'Invoices' }).click();
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill('New Folder for testing');
  takeScreenShot(page,'New folder name for edit','newfoldername');
  
  await page.locator('.question-card-menu-button').click();
  await page.getByRole('menuitem', { name: 'Edit' }).click();
  await page.getByLabel('Name your folder (Required)').click();
  await page.getByLabel('Name your folder (Required)').fill('New Folder for testing edited');
  await page.getByLabel('Description (optional)').click();
  await page.getByLabel('Description (optional)').fill('Testing folder edited');
  await page.getByRole('button', { name: 'Next', exact: true }).click();
  // await page.getByRole('button', { name: 'Netsuite - VendorBill - Create' }).click();
  // await page.getByText('Other').click();
  await page.getByRole('button', { name: 'Save Folder' }).click();

  //verify edited folder
//   let isTextVisible = false;
//   isTextVisible = await page.getByText("Card Edited!x").isVisible();
//   let count = 0;
//   while(!isTextVisible){
//     if(count == 10){
//       break;
//     }
//     await page.waitForTimeout(100000);
//     isTextVisible = await page.getByText("Card Edited!x").isVisible();
//     count++;
//   }
//   await test.step('Folder Created', async () => {
//     await page.screenshot({ path: 'screenshots/editFolder1.png' });
//  });
//     expect(isTextVisible).toEqual(true);
 
  await page.getByLabel('Search card').fill('New Folder for testing edited');
  let element = page.locator("(//div[@class='col-md-5 col-lg-3 col-xl-3 col'])[1]");
  let text = await element.textContent();
  takeScreenShot(page,'Take screenshot after editing folder name','editedfoldername');
  
  // Check if the string is contained
  expect(text).toContain('New Folder for testing edited');
  
  //Delete edited folder
  await page.locator('.question-card-menu-button').first().click();
  await page.getByText('Delete Card').click();
  await page.getByRole('button', { name: 'Yes' }).click();
  await page.waitForTimeout(100000);
  await page.getByLabel('Search card').fill('New Folder for testing edited');
  // element = page.locator("(//div[@class='col-md-5 col-lg-3 col-xl-3 col'])[1]");
  // text = await element.textContent();
  takeScreenShot(page,'Folder Deleted','deletefolder');
  
  // Check if the string is contained
  // expect(text).toContain('');

});

test('6. Click and open the folder ', async ({ page }) => {
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  let element = page.locator("//strong[normalize-space()='Automation Testing By playwright']");
  let text = await element.textContent();
  takeScreenShot(page,'Take screenshot after open folder','openfoldercheck');
  
  expect(text).toContain('Automation Testing By playwright');
  
});
test('7(a). . Verify upload invoice with single line item', async ({ page }) => {
    
    const folderName = testData.get('7A').get('FolderName');
    const fileToUpload = testData.get('7A').get('FilesToUpload');
    await page.click("//div[text()='Invoices ']");
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    await page.waitForTimeout(12000);
    uploadInvoice(page,'./FilesToUpload/'+fileToUpload);
    await page.waitForTimeout(120000);
    waitForAnalyzedSatatus(page,fileToUpload);
   
    // verifyAnalyzedSatatus(page);
    if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
      await page.locator("//input[@id='headerChk']").click(); 
    }
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    let statues = await getGridColumnTextsByindex(page, "3",rows);
    let fileNames = await getGridColumnTextsByindex(page, "2",rows);
    let statusReport = [];
    let isactualStatusValVisible = false;
    for (let i = 0; i < statues.length; i++) {
     
      const actualStatusVal = statues[i].trim();
      // console.log(`Processing: ${actualStatusVal}`);
      if(actualStatusVal === 'Analyzed'){
        isactualStatusValVisible = true;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
      }else{
        isactualStatusValVisible = false;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
      }
      
    }
    console.log(statusReport);
      if(statusReport.includes(false)){
        throw new Error("Some files not in Analyzed status");
      }
  
});
test('7(b).  Invoice with multiple line items', async ({ page }) => {
  const folderName = testData.get('7B').get('FolderName');
    const fileToUpload = testData.get('7B').get('FilesToUpload');
    await page.click("//div[text()='Invoices ']");
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    await page.waitForTimeout(12000);
    uploadInvoice(page,'./FilesToUpload/'+fileToUpload);
    await page.waitForTimeout(120000);
    waitForAnalyzedSatatus(page,fileToUpload);
   
    // verifyAnalyzedSatatus(page);
    if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
      await page.locator("//input[@id='headerChk']").click(); 
    }
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    let statues = await getGridColumnTextsByindex(page, "3",rows);
    let fileNames = await getGridColumnTextsByindex(page, "2",rows);
    let statusReport = [];
    let isactualStatusValVisible = false;
    for (let i = 0; i < statues.length; i++) {
     
      const actualStatusVal = statues[i].trim();
      // console.log(`Processing: ${actualStatusVal}`);
      if(actualStatusVal === 'Analyzed'){
        isactualStatusValVisible = true;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
      }else{
        isactualStatusValVisible = false;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
      }
      
    }
    console.log(statusReport);
      if(statusReport.includes(false)){
        throw new Error("Some files not in Analyzed status");
      }
  
});

test('7(c). Invoice with vendor name detected', async ({ page }) => {
  const folderName = testData.get('7C').get('FolderName');
    const fileToUpload = testData.get('7C').get('FilesToUpload');
    await page.click("//div[text()='Invoices ']");
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    await page.waitForTimeout(12000);
    uploadInvoice(page,'./FilesToUpload/'+fileToUpload);
    await page.waitForTimeout(120000);
    waitForAnalyzedSatatus(page,fileToUpload);
   
    // verifyAnalyzedSatatus(page);
    if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
      await page.locator("//input[@id='headerChk']").click(); 
    }
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    let statues = await getGridColumnTextsByindex(page, "3",rows);
    let fileNames = await getGridColumnTextsByindex(page, "2",rows);
    let statusReport = [];
    let isactualStatusValVisible = false;
    for (let i = 0; i < statues.length; i++) {
     
      const actualStatusVal = statues[i].trim();
      // console.log(`Processing: ${actualStatusVal}`);
      if(actualStatusVal === 'Analyzed'){
        isactualStatusValVisible = true;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
      }else{
        isactualStatusValVisible = false;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
      }
      
    }
    console.log(statusReport);
      if(statusReport.includes(false)){
        throw new Error("Some files not in Analyzed status");
      }
  
});

test('7(d). Invoice with vendor name not detected  ', async ({ page }) => {
  const folderName = testData.get('7D').get('FolderName');
    const fileToUpload = testData.get('7D').get('FilesToUpload');
    await page.click("//div[text()='Invoices ']");
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    await page.waitForTimeout(12000);
    uploadInvoice(page,'./FilesToUpload/'+fileToUpload);
    await page.waitForTimeout(120000);
    waitForAnalyzedSatatus(page,fileToUpload);
   
    // verifyAnalyzedSatatus(page);
    if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
      await page.locator("//input[@id='headerChk']").click(); 
    }
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    let statues = await getGridColumnTextsByindex(page, "3",rows);
    let fileNames = await getGridColumnTextsByindex(page, "2",rows);
    let statusReport = [];
    let isactualStatusValVisible = false;
    for (let i = 0; i < statues.length; i++) {
     
      const actualStatusVal = statues[i].trim();
      // console.log(`Processing: ${actualStatusVal}`);
      if(actualStatusVal === 'Analyzed'){
        isactualStatusValVisible = true;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
      }else{
        isactualStatusValVisible = false;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
      }
      
    }
    console.log(statusReport);
      if(statusReport.includes(false)){
        throw new Error("Some files not in Analyzed status");
      }
  
});

test('7(e). Single page invoice ', async ({ page }) => {
  const folderName = testData.get('7E').get('FolderName');
    const fileToUpload = testData.get('7E').get('FilesToUpload');
    await page.click("//div[text()='Invoices ']");
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    await page.waitForTimeout(12000);
    uploadInvoice(page,'./FilesToUpload/'+fileToUpload);
    await page.waitForTimeout(120000);
    waitForAnalyzedSatatus(page,fileToUpload);
   
    // verifyAnalyzedSatatus(page);
    if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
      await page.locator("//input[@id='headerChk']").click(); 
    }
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    let statues = await getGridColumnTextsByindex(page, "3",rows);
    let fileNames = await getGridColumnTextsByindex(page, "2",rows);
    let statusReport = [];
    let isactualStatusValVisible = false;
    for (let i = 0; i < statues.length; i++) {
     
      const actualStatusVal = statues[i].trim();
      // console.log(`Processing: ${actualStatusVal}`);
      if(actualStatusVal === 'Analyzed'){
        isactualStatusValVisible = true;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
      }else{
        isactualStatusValVisible = false;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
      }
      
    }
    console.log(statusReport);
      if(statusReport.includes(false)){
        throw new Error("Some files not in Analyzed status");
      }
  
});

test('7(f). Multipage invoice with same invoice number  ', async ({ page }) => {
  const folderName = testData.get('7F').get('FolderName');
    const fileToUpload = testData.get('7F').get('FilesToUpload');
    await page.click("//div[text()='Invoices ']");
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    await page.waitForTimeout(12000);
    uploadInvoice(page,'./FilesToUpload/'+fileToUpload);
    await page.waitForTimeout(120000);
    waitForAnalyzedSatatus(page,fileToUpload);
   
    // verifyAnalyzedSatatus(page);
    if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
      await page.locator("//input[@id='headerChk']").click(); 
    }
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    let statues = await getGridColumnTextsByindex(page, "3",rows);
    let fileNames = await getGridColumnTextsByindex(page, "2",rows);
    let statusReport = [];
    let isactualStatusValVisible = false;
    for (let i = 0; i < statues.length; i++) {
     
      const actualStatusVal = statues[i].trim();
      // console.log(`Processing: ${actualStatusVal}`);
      if(actualStatusVal === 'Analyzed'){
        isactualStatusValVisible = true;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
      }else{
        isactualStatusValVisible = false;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
      }
      
    }
    console.log(statusReport);
      if(statusReport.includes(false)){
        throw new Error("Some files not in Analyzed status");
      }
  
});

test('7(g).Multipage invoice with different invoice number ', async ({ page }) => {
  const folderName = testData.get('7G').get('FolderName');
    const fileToUpload = testData.get('7G').get('FilesToUpload');
    await page.click("//div[text()='Invoices ']");
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    await page.waitForTimeout(12000);
    uploadInvoice(page,'./FilesToUpload/'+fileToUpload);
    await page.waitForTimeout(120000);
    waitForAnalyzedSatatus(page,fileToUpload);
   
    // verifyAnalyzedSatatus(page);
    if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
      await page.locator("//input[@id='headerChk']").click(); 
    }
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    let statues = await getGridColumnTextsByindex(page, "3",rows);
    let fileNames = await getGridColumnTextsByindex(page, "2",rows);
    let statusReport = [];
    let isactualStatusValVisible = false;
    for (let i = 0; i < statues.length; i++) {
     
      const actualStatusVal = statues[i].trim();
      // console.log(`Processing: ${actualStatusVal}`);
      if(actualStatusVal === 'Analyzed'){
        isactualStatusValVisible = true;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
      }else{
        isactualStatusValVisible = false;
        statusReport.push(isactualStatusValVisible);
        console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
      }
      
    }
    console.log(statusReport);
      if(statusReport.includes(false)){
        throw new Error("Some files not in Analyzed status");
      }
  
});


test('8.Verify Single and multiple selection of invoices from the table', async ({ page }) => {
  // await page.waitForTimeout(12000);
  // const folderName = testData.get('8').get('FolderName');
  await page.click("//div[text()='Invoices ']");
  await page.getByLabel('Search card').waitFor({ state: 'visible' });
  await page.getByLabel('Search card').fill('Automation Testing By playwright2.0');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright2.0']").click();
  // await page.waitForTimeout(120000);
  const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();

  if (!isVisible) {
    // await page.waitForTimeout(120000);
    await page.locator("//input[@id='headerChk']").click(); //click selectall checkbox
    //Verify all checkboxes in table checked or not
    const checkboxes = await page.locator("//div[@ref='eCheckbox']//input[@ref='eInput']");
    takeScreenShot(page,'All checkboxs checked','allcheckboxs');
    
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
    takeScreenShot(page,'Single CheckBoxe Checked','singlecheckbox');
    
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
    takeScreenShot(page,'Invoices not present in table','nocheckbox');
    
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
  await page.waitForTimeout(12000);
const Pre_Approved_tab = page.getByRole('tab', { name: 'Pre Approved' });
const Ready_For_Writebackpage_tab = page.getByRole('tab', { name: 'Ready For Writeback' });
const Rejected_tab = page.getByRole('tab', { name: 'Rejected' });
const Approved_tab = page.getByRole('tab', { name: 'Approved', exact: true });
const Needs_Attention_tab = page.getByRole('tab', { name: 'Needs Attention' });
const Failure_tab = page.getByRole('tab', { name: 'Failure' });
const Completed_tab = page.getByRole('tab', { name: 'Completed' });
const Duplicate_tab = page.getByRole('tab', { name: 'Duplicate' });
const All_tab = page.getByRole('tab', { name: 'All' });

 let isAllTabsVisible = true;
  //const Pre_Approved_tab = page.getByRole('tab', { name: 'Pre Approved' });
  if(await Pre_Approved_tab.isVisible()){
    await Pre_Approved_tab.click();
    console.log(`Pre_Approved_tab found.`);
  }else{
    console.error(`Pre_Approved_tab not found.`);
    isAllTabsVisible = false;
        //  return; // Exit test if column is not found
  }
  // expect(await Pre_Approved_tab.isVisible()).toBe(true);

  const Pending_Review_tab =page.getByRole('tab', { name: 'Pending Review' });
  if(await Pending_Review_tab.isVisible()){
    await Pending_Review_tab.click();
    console.log(`Pending_Review_tab found.`);
  }else{
    console.error(`Pending_Review_tab not found.`);
    isAllTabsVisible = false;
    // expect(await Pending_Review_tab.isVisible()).toBe(true);
        //  return; // Exit test if column is not found
  }
  // expect(await Pending_Review_tab.isVisible()).toBe(true);


 //const Ready_For_Writebackpage_tab = page.getByRole('tab', { name: 'Ready For Writeback' });
 if(await Ready_For_Writebackpage_tab.isVisible()){
  await Ready_For_Writebackpage_tab.click();
  console.log(`Ready_For_Writebackpage_tab found.`);
}else{
  console.error(`Ready_For_Writebackpage_tab not found.`);
  isAllTabsVisible = false;
      //  return; // Exit test if column is not found
}
// expect(await Ready_For_Writebackpage_tab.isVisible()).toBe(true);
  //await page.getByRole('tab', { name: 'Rejected' }).click();
  if(await Rejected_tab.isVisible()){
    await Rejected_tab.click();
    console.log("Rejected_tab found`")
  }else{
    console.error(`Rejected_tab not found.`);
    isAllTabsVisible = false;
        //  return; // Exit test if column is not found
  }
  // expect(await Ready_For_Writebackpage_tab.isVisible()).toBe(true);

  //await page.getByRole('tab', { name: 'Approved', exact: true }).click();
  if(await Approved_tab.isVisible()){
    await Approved_tab.click();
    console.log("Approved_tab found.`")
  }else{
    console.error(`Approved_tab not found.`);
    isAllTabsVisible = false;
        //  return; // Exit test if column is not found
  }
  // expect(await Approved_tab.isVisible()).toBe(true);
  takeScreenShot(page,'Tabs Present','tabs1');
 
  //await page.getByRole('tab', { name: 'Needs Attention' }).click();
  if(await Needs_Attention_tab.isVisible()){
    await Needs_Attention_tab.click();
    console.log("Needs_Attention_tab found.`")
  }else{
    console.error(`Needs_Attention_tab not found.`);
    isAllTabsVisible = false;
        //  return; // Exit test if column is not found
  }
  // expect(await Needs_Attention_tab.isVisible()).toBe(true);

  //await page.getByRole('tab', { name: 'Failure' }).click();
  if(await Failure_tab.isVisible()){
    await Failure_tab.click();
    console.log("Failure_tab found`")
  }else{
    console.error(`Failure_tab not found.`);
    isAllTabsVisible = false;
        //  return; // Exit test if column is not found
  }
  // expect(await Failure_tab.isVisible()).toBe(true);
  //await page.getByRole('tab', { name: 'Completed' }).click();
  if(await Completed_tab.isVisible()){
    await Completed_tab.click();
    console.log("Completed_tab found.`")
  }else{
    console.error(`Completed_tab not found.`);
    isAllTabsVisible = false;
        //  return; // Exit test if column is not found
  }
  // expect(await Completed_tab.isVisible()).toBe(true);
  //await page.getByRole('tablist').locator('i').nth(1).click();
 // await page.getByRole('tab', { name: 'Duplicate' }).click();
 if(await Duplicate_tab.isVisible()){
  await Duplicate_tab.click();
  console.log("Duplicate_tab found.`")
}else{
  console.error(`Duplicate_tab not found.`);
  isAllTabsVisible = false;
      //  return; // Exit test if column is not found
}
// expect(await Duplicate_tab.isVisible()).toBe(true);
  //await page.getByRole('tab', { name: 'All' }).click();
  if(await All_tab.isVisible()){
    await All_tab.click();
    console.log("All_tab found.`")
  }else{
    console.error(`All_tab not found.`);
    isAllTabsVisible = false;
  }
  // expect(await All_tab.isVisible()).toBe(true);
  expect(isAllTabsVisible).toBe(true);

});

//Verify the Search bar - by File name, invoice number, Vendor name
test ('10.1.Verify the Search bar - by File name, invoice number, Vendor name', async ({ page }) => {
   await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill('Automation Testing By playwright2.0');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright2.0']").click();
  let fileToSearch = "acent imaging.pdf".replace(".pdf","");
  await page.getByLabel('Search card').fill(fileToSearch)
  // await page.getByLabel('Search card').press('Enter');

  if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
    await page.locator("//input[@id='headerChk']").click(); 
  }
  let totalRows = 0;
  let columnTexts = "";
  if(await waitForElementToVisible(page,'//div[@ref="eCenterContainer"]')){
    await page.waitForTimeout(12000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    totalRows = await rows.count();
    columnTexts = await getGridColumnTextsByindex(page, "2",rows);
     
  }
  expect(totalRows).toEqual(columnTexts.length);
  for (let i = 0; i < columnTexts.length; i++) {
    expect(columnTexts[i]).toContain(fileToSearch);
  }
});

test ('10.2.Verify the Search bar - by Vendor name', async ({ page }) => {
  await page.waitForTimeout(12000);
 await page.getByRole('link', { name: 'Invoices' }).click();
 await page.getByLabel('Search card').fill('Automation Testing By playwright2.0');
 await page.locator("//strong[normalize-space()='Automation Testing By playwright2.0']").click();
 let vendorToSearch = "Red Wing Shoes";
 await page.getByLabel('Search card').fill(vendorToSearch)
 // await page.getByLabel('Search card').press('Enter');

 if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
   await page.locator("//input[@id='headerChk']").click(); 
 }
 let totalRows = 0;
 let columnTexts = "";
 if(await waitForElementToVisible(page,'//div[@ref="eCenterContainer"]')){
   await page.waitForTimeout(12000);
   const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   totalRows = await rows.count();
   columnTexts = await getGridColumnTextsByindex(page, "12",rows);
    
 }
 expect(totalRows).toEqual(columnTexts.length);
 for (let i = 0; i < columnTexts.length; i++) {
   expect(columnTexts[i]).toContain(vendorToSearch);
 }
});

test ('10.3.Verify the Search bar - by Invoice Serial Number', async ({ page }) => {
  await page.waitForTimeout(12000);
 await page.getByRole('link', { name: 'Invoices' }).click();
 await page.getByLabel('Search card').fill('Automation Testing By playwright2.0');
 await page.locator("//strong[normalize-space()='Automation Testing By playwright2.0']").click();
 let invoiceSerialNumberToSearch = "308-1-66600";
 await page.getByLabel('Search card').fill(invoiceSerialNumberToSearch)
 // await page.getByLabel('Search card').press('Enter');

 if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
   await page.locator("//input[@id='headerChk']").click(); 
 }
 let totalRows = 0;
 let columnTexts = "";
 if(await waitForElementToVisible(page,'//div[@ref="eCenterContainer"]')){
   await page.waitForTimeout(12000);
   const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   totalRows = await rows.count();
   columnTexts = await getGridColumnTextsByindex(page, "12",rows);
    
 }
 expect(totalRows).toEqual(columnTexts.length);
 for (let i = 0; i < columnTexts.length; i++) {
   expect(columnTexts[i]).toContain(invoiceSerialNumberToSearch);
 }
});

// 11 folder total rows 
test ('11 folder total rows', async ({ page }) => {

  // await page.getByRole('link', { name: 'Invoices' }).waitFor({ state: 'visible' });
  let isInvoiceVisible = await page.getByRole('link', { name: 'Invoices' }).isVisible();
  console.log(isInvoiceVisible)
  while(!isInvoiceVisible){
    // await page.waitForTimeout(12000);
    isInvoiceVisible = await page.getByRole('link', { name: 'Invoices' }).isVisible();
    console.log("in while.. "+isInvoiceVisible)
  }
  console.log(isInvoiceVisible)
 await page.getByRole('link', { name: 'Invoices' }).click();

await page.getByLabel('Search card').waitFor({ state: 'visible' });
 await page.getByLabel('Search card').fill('Automation Testing By playwright');
//  await page.locator('div').filter({ hasText: /^Automation Testing By playwright$/ }).nth(1).click();
await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
await page.setDefaultTimeout(1300000);

// await page.locator("//input[@id='headerChk']").waitFor({ state: 'visible' });
await page.locator("//input[@id='headerChk']").click(); 
const gridContainer = page.locator('//input[@id="headerChk"]');

if (await gridContainer.isVisible()) {
  console.log('Grid container is visible');
} else {
  console.error('Grid container is hidden');
}
const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');

const columnTexts = await getGridColumnTextsByindex(page, "11",rows);
// console.log('Column Texts:', columnTexts);
for (let i = 0; i < columnTexts.length; i++) {
  console.log(`Processing: ${columnTexts[i]}`);

}

// Get the index of the column with a specific header
// const headerCells = page.locator('//div[@ref="eBodyViewport"]');
// const expectedColumnHeader = 'Status'; // Replace with your column name
// const headerCount = await headerCells.count();

// let columnIndex = -1;
// for (let i = 1; i < headerCount; i++) {
//   const headerText = await headerCells.nth(i).textContent();
//   if(headerText != null){
//   console.log("---"+headerText.trim()+"---");
//   }
//   if( headerText != null && headerText.trim() === expectedColumnHeader) {
//     columnIndex = i;
//     break;
//   }
// }

// if (columnIndex === -1) {
//   throw new Error(`Column with header "${expectedColumnHeader}" not found`);
// }

// Get text for that specific column in all rows
// const rows = page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
// const rowCount = await rows.count();
// for (let i = 0; i < rowCount; i++) {
//   const columnText = await rows.nth(i).locator(`div[role="gridcell"]:nth-child(${columnIndex + 1})`).textContent();
//   console.log(`Row ${i + 1}, Column "${expectedColumnHeader}": ${columnText}`);
// }




});
//12.Verification of invoice import success and analyze
test ('12. Verification of invoice import success and analyze', async ({ page }) => {
  

 await page.getByRole('link', { name: 'Invoices' }).click();
 await page.getByLabel('Search card').fill('Automation Testing By playwright');
 await page.locator('div').filter({ hasText: /^Automation Testing By playwright$/ }).nth(1).click();

 const expectedfileName = testData.get('12').get('FilesToUpload');
 await page.getByLabel('Search card').fill(expectedfileName);
//  await page.waitForTimeout(12000);
let element;
let text;
if(await waitForElementToVisible(page,'//div[@ref="eCenterContainer"]')){
  element = page.locator('//div[@ref="eCenterContainer"]');
  text = await element.textContent();
}

 console.log("text===="+text?.trim()+"-----");
 if(text?.trim() !== "" && text?.trim() !== "No Rows To Show"){
  console.log("File already uploaded");
  await page.locator("//input[@id='headerChk']").click(); 
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Yes, delete file' }).click();
  // await page.getByRole('button', { name: 'Import', exact: true }).click();
  // await page.getByLabel('Browse Files').setInputFiles('./FilesToUpload/'+expectedfileName);
  
 }else{
  console.log("File already not uploaded");
  
 }
 await page.waitForTimeout(12000);
 await page.getByRole('button', { name: 'Import', exact: true }).click();
  await page.getByLabel('Browse Files').setInputFiles('./FilesToUpload/'+expectedfileName);
 await page.getByRole('button', { name: 'Next' }).click();
  await page.getByText('Done').click();

  await page.locator("//button[@class='v-icon notranslate v-icon--link mdi mdi-close theme--light danger--text']").click();
  await page.locator("//div[@class='ml-6 routeHeader d-flex align-center']").click();
  
  await page.getByLabel('Search card').fill(expectedfileName);

  
//  await page.waitForTimeout(120000);
 while(await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible() !== true){
  await page.waitForTimeout(1000);
  if(await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible() === true){
    break;
  }
 }
//  await page.getByLabel('Search card').fill(expectedfileName);
//  await page.getByLabel(expectedfileName).press('Enter');
//  await page.waitForTimeout(12000);
//  await page.getByLabel('Search card').press('Enter');
if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
  await page.locator("//input[@id='headerChk']").click(); 
}
const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
let statues = await getGridColumnTextsByindex(page, "3",rows);
let fileNames = await getGridColumnTextsByindex(page, "2",rows);
let statusReport = [];
let isactualStatusValVisible = false;
for (let i = 0; i < statues.length; i++) {
 
  const actualStatusVal = statues[i].trim();
  // console.log(`Processing: ${actualStatusVal}`);
  if(actualStatusVal === 'Analyzed'){
    isactualStatusValVisible = true;
    statusReport.push(isactualStatusValVisible);
    console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
  }else{
    
    statusReport.push(isactualStatusValVisible);
    console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
  }
  
}
// console.log(statusReport);
  if(statusReport.includes(false)){
    throw new error("Some files not in Analyzed status");
  }
// const searchfile = await page.getByRole('gridcell', { name: expectedfileName })
//      if (await searchfile.isVisible()) {
//           const filestatuscolumn =await page.getByRole('columnheader',{ name: 'Status', exact: true })
//           let isAnalyzedVisible = false;
//           if (await filestatuscolumn.isVisible()) {
//               // await filestatuscolumn.click();
//               // console.log(filestatuscolumn+"---"+filestatuscolumn.innerText)
//               isAnalyzedVisible = await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible();
//               console.log('file status found in the table:Analyzed ');
//             } else {
//               console.error(`File status '${filestatuscolumn}' not found in the list.`);
                         
//           }
//           expect(isAnalyzedVisible).toEqual(true);
          
//      } else {
//          console.error(`File name '${expectedfileName}' not found in the list.`);
//         throw new error(`File name '${expectedfileName}' not found in the list.`);
//      }

// await page.getByRole('columnheader', { name: 'Status', exact: true })

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

//14.Verify the filters - date imported
test('14.Verify the filters - date imported when invoices are found for selected dates', async({ page })=>{

  const currentYear = new Date().getFullYear();
// console.log(currentYear);
  const rangeStart = testData.get('14').get('StartDateRange');
  const startdate = new Date(rangeStart);
  let startmonth = (startdate.getMonth() + 1).toString();
  startmonth = await getMonthInMmmFormat(startmonth);
  // let startmonth = startdate.getUTCMonth(); // Get month (0-indexed, so add 1)
  let startday = startdate.getDate().toString(); // Get day
  let startyear = startdate.getFullYear(); // Get year
  // console.log("startmonth="+startmonth+" startday="+startday+" startyear="+startyear);

  const rangeEnd = testData.get('14').get('EndDateRange');
  const enddate = new Date(rangeEnd);
  let endmonth = (enddate.getMonth() + 1).toString(); // Get month (0-indexed, so add 1)
  endmonth = await getMonthInMmmFormat(endmonth);
  let endday = enddate.getDate().toString(); // Get day
  let endyear = enddate.getFullYear(); // Get year
  // console.log("endmonth="+endmonth+" endday="+endday+" endyear="+endyear);
  if(await waitForElementToVisible(page,'//div[text()="Invoices "]')){
    await page.click("//div[text()='Invoices ']");
  }
  await page.waitForTimeout(12000);
  
  await page.getByLabel('Search card').fill('Automation Testing By playwright2.0');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright2.0']").click();

  await page.getByRole('button', { name: '10' }).click();
  await page.getByText('1000').click();
  await waitForElementToVisible(page,'//div[@ref="eCenterContainer"]')

  await page.waitForTimeout(12000);
  // if(await waitForElementToVisible(page,"await page.getByLabel('Date Imported Range').isVisible()")){
    await page.getByLabel('Date Imported Range').click();
  // }
   

  //Select start range date
  await page.locator("//div[@class='v-date-picker-header__value']").click();
  // await page.locator("//div[@class='v-date-picker-header__value']").click();
  await page.locator("//button[normalize-space()='"+currentYear+"']").click();
  await page.locator("//li[normalize-space()='"+startyear+"']").click();
  await page.locator("//div[normalize-space()='"+startmonth+"']").click();
  await page.locator("//div[@class='v-date-picker-table v-date-picker-table--date theme--light']//td//button//div[text()='"+startday+"']").click();
  

  //Select end range date
  const fullMonthYear = await getFullMonthName(startmonth)+" "+startyear; 
  await page.locator("//button[normalize-space()='"+fullMonthYear+"']").click();
  // await page.locator('div').filter({ hasText: /^December 2024$/ }).nth(1).click();
  // await page.locator("//div[@class='v-date-picker-header__value']").click();
  await page.locator("//button[normalize-space()='"+startyear+"']").click();
  await page.locator("//li[normalize-space()='"+endyear+"']").click();
  await page.locator("//div[normalize-space()='"+endmonth+"']").click();
  await page.locator("//div[@class='v-date-picker-table v-date-picker-table--date theme--light']//td//button//div[text()='"+endday+"']").click();
  await page.getByRole('button', { name: 'OK' }).click();
  await page.waitForTimeout(12000);
  if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
    await page.locator("//input[@id='headerChk']").click(); 
  }
 if(await waitForElementToVisible(page,'//div[@ref="eCenterContainer"]')){
  await page.waitForTimeout(12000);
  // if(await waitForElementToVisible(page,"await page.locator('//input[@id='headerChk']').isVisible()")){
  //   await page.locator("//input[@id='headerChk']").click(); 
  // }
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    // await page.locator("//div[@ref='eCenterContainer']");
    const columnTexts = await getGridColumnTextsByindex(page, "11",rows);
    // console.log('Column Texts:', columnTexts);
    const notInRange = [];
    for (let i = 0; i < columnTexts.length; i++) {
      // console.log(`Processing: ${columnTexts[i]}`);
      let date = new Date(columnTexts[i].replace("@","")); // Parse the input date
      let month = (date.getMonth() + 1).toString().padStart(2, '0'); // Get month (0-indexed, so add 1)
      let day = date.getDate().toString().padStart(2, '0'); // Get day
      let year = date.getFullYear(); // Get year

      const dateToCheck = `${month}/${day}/${year}`;
      // console.log("----"+dateToCheck);

      const isInRange = await checkDateInRange(dateToCheck, rangeStart, rangeEnd);
      // console.log("Final=== "+isInRange)
      // Perform the check
      if (isInRange) {
        console.log(`${dateToCheck} is within the range ${rangeStart} to ${rangeEnd}`);
      } else {
        console.error(`${dateToCheck} is not within the range ${rangeStart} to ${rangeEnd}`);
        throw new Error(`${dateToCheck} is not within the range ${rangeStart} to ${rangeEnd}`);
        // notInRange.push(`${dateToCheck} is not within the range ${rangeStart} to ${rangeEnd} for row ${i + 1}`)

      }
    }
   
  }
});

// 
test('15.Verify summery data with PDF', async({ page })=>{
  
  await page.waitForTimeout(12000);
  const fileName = testData.get('15').get('FilesToUpload');
  const folderName = testData.get('15').get('FolderName');
  let normalizedExtractedText = await readPDF('./FilesToUpload/'+fileName+'.pdf');
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  let fileToSearch = fileName.replace(".pdf","");
  await page.getByLabel('Search card').fill(fileToSearch)
  // await page.getByLabel('Search card').press('Enter');

  if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
    await page.locator("//input[@id='headerChk']").click(); 
  }
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  let totalRows = await rows.count();
  for (let i = 0; i < totalRows; i++) {
    let allCheck = true;
    // console.log(`Clicking on row ${i + 1}`);
    await rows.nth(i).click();
    await page.waitForTimeout(10000);
    takeScreenShot(page,'Summery Details','summery');
   
  //  await page.waitForTimeout(12000);

  //Summery fileds
   const actualInvoiceNo = await page.inputValue("//input[@name='Invoice_Number__standard']");
   let actualInvoiceDate = await page.inputValue("(//div[@name='Invoice_Date__standard'])[1] //input");
   actualInvoiceDate = await getformattedDate(actualInvoiceDate);
   if (actualInvoiceDate.startsWith('0')) {
    actualInvoiceDate = actualInvoiceDate.replace(/^0/, '');
  }
   let actualPaymentDueDate = await page.inputValue("(//div[@name='Payment_Due_Date__standard'])[1] //input");
   actualPaymentDueDate = await getformattedDate(actualPaymentDueDate);
   if (actualPaymentDueDate.startsWith('0')) {
    actualPaymentDueDate = actualPaymentDueDate.replace(/^0/, '');
  }
   let actualSubtotal = await page.inputValue("//input[@name='Subtotal__standard']"); 
   actualSubtotal = "$"+actualSubtotal;
   let  actualTax = await page.inputValue("//input[@name='Tax__standard']"); 
  //  actualTax = "$"+actualTax;
   let actualTotalAmount = await page.inputValue("//input[@name='Total_Amount__standard']"); 
   actualTotalAmount = "$"+actualTotalAmount;

   console.log(actualInvoiceNo,actualInvoiceDate,actualPaymentDueDate,actualSubtotal,actualTax,actualTotalAmount);
  
  //Verify invoice no
  
  let expectedInvoiceNo = await getInvoiceNo(normalizedExtractedText,actualInvoiceNo);
  
  if(expectedInvoiceNo === actualInvoiceNo){
    console.log("Invoice Number matches with PDF - "+expectedInvoiceNo);
  }else{
    console.error("Invoice Number not matches with PDF");
    allCheck = false;
  }

  //Verify Invoice Date
  let expectedInvoiceDate = await getInvoiceDate(normalizedExtractedText,actualInvoiceDate);
  
  if(expectedInvoiceDate === actualInvoiceDate){
    console.log("Invoice Date matches with PDF - "+expectedInvoiceDate);
  }else{
    console.error("Invoice Date not matches with PDF");
    allCheck = false;
  }
  
  //Verify Payment Due Date
  let expectedPaymentDueDate = await getPaymentDueDate(normalizedExtractedText,actualPaymentDueDate);
  
  if(expectedPaymentDueDate === actualPaymentDueDate){
    console.log("Payment Due Date matches with PDF - "+expectedPaymentDueDate);
  }else{
    console.error("Payment Due Date not matches with PDF");
    allCheck = false;
  }
  
  //Verify Subtotal
  let expectedSubtotal = await getSubtotal(normalizedExtractedText,actualSubtotal);
  
  if(expectedSubtotal === actualSubtotal){
    console.log("Subtotal matches with PDF - "+expectedSubtotal);
  }else{
    console.error("Subtotal not matches with PDF");
    allCheck = false;
  }

  //Verify Tax
  let expectedTax = await getTax(normalizedExtractedText,actualTax);
  
  if(expectedTax === actualTax){
    console.log("Tax matches with PDF - "+expectedTax);
  }else{
    console.error("Tax not matches with PDF");
    allCheck = false;
  }

  //Verify Total Amount
  let expectedTotalAmount = await getTotalAmount(normalizedExtractedText,actualTotalAmount);
  
  if(expectedTotalAmount === actualTotalAmount){
    console.log("Total Amount matches with PDF - "+expectedTotalAmount);
  }else{
    console.error("Total Amount not matches with PDF");
    allCheck = false;
  }
  console.log(expectedInvoiceNo,expectedInvoiceDate,expectedPaymentDueDate,expectedSubtotal,expectedTax,expectedTotalAmount);
  await page.locator('.row > div:nth-child(2) > button:nth-child(4)').click();
  expect(allCheck).toEqual(true);
}




});


test.only('16. Data verification in line items', async({ page })=>{
  const fileName = testData.get('16').get('FilesToUpload');
  const folderName = testData.get('16').get('FolderName');
  let normalizedExtractedText = await readPDF('./FilesToUpload/'+fileName);
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  let fileToSearch = fileName.replace(".pdf","");
  await page.getByLabel('Search card').fill(fileToSearch)
  if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
    await page.locator("//input[@id='headerChk']").click(); 
  }
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  let fileNames = await getGridColumnTextsByindex(page, "2",rows);
  let totalRows = await rows.count();
  let statusReport = [];
  for (let i = 0; i < totalRows; i++) {
    console.log("Validating line items for file - "+fileNames[i]);
    let allCheck = true;
    // console.log(`Clicking on row ${i + 1}`);
    await rows.nth(i).click();
    await page.waitForTimeout(10000);
    //Line Iteams 
   await page.locator("//div[@tab-value='line_items']").click();
    

   //Iterate through line items pages
   let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
   console.log("noOfLineItems = "+noOfLineItems);
   for (let l = 1; l <= noOfLineItems; l++) {
       takeScreenShot(page,'Line Items'+l,'lineItems'+l);
   //Description *
  await page.locator('.mr-2 > .px-1 > .v-input > .v-input__control > .v-input__slot > .v-text-field__slot').first().click();
  await page.getByRole('button', { name: '' }).first().click();
  await page.locator('.pl-4 > div > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon').click();
  await page.getByRole('option', { name: 'Description -' }).click();
  await page.getByRole('button', { name: 'SAVE MAPPING' }).click();

  //Unit Price 
  await page.getByRole('combobox').getByRole('button', { name: '' }).click();
  await page.locator('.pl-4 > div > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon').click();
  // if(await page.getByRole('option', { name: 'Price - $' }).isVisible){
  //   await page.getByRole('option', { name: 'Price - $' }).click();
  // }else{
  //   await page.getByRole('option', { name: 'Amount - $' }).click();
  // }
  if (await page.locator('option', { hasText: 'Amount' }).count() > 0) {
    await page.locator('option', { hasText: 'Amount' }).click();
    console.log('Clicked on "Amount"');
  } else if (await page.locator('option', { hasText: 'Price' }).count() > 0) {
    await page.locator('option', { hasText: 'Price' }).click();
    console.log('Clicked on "Price"');
  } else {
    console.log('Neither "amount" nor "price" found');
  }
  await page.getByRole('button', { name: 'SAVE MAPPING' }).click();
  //Quantity 
  await page.getByRole('button', { name: '' }).nth(2).click();
  await page.locator('.pl-4 > div > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon').click();
  await page.getByRole('option', { name: 'Ship -' }).click();
  await page.getByRole('button', { name: 'Clear Mapping' }).click();
  await page.getByRole('button', { name: 'Yes, clear mapping' }).click();
  await page.getByRole('button', { name: '' }).nth(2).click();
  await page.locator('.pl-4 > div > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon').click();
  await page.getByRole('option', { name: 'Ship -' }).click();
  await page.getByRole('button', { name: 'SAVE MAPPING' }).click();
  //Total Price 
  await page.getByRole('button', { name: '' }).nth(3).click();
  await page.locator('.pl-4 > div > .v-input > .v-input__control > .v-input__slot > .v-select__slot > .v-input__append-inner > .v-input__icon > .v-icon').click();
  await page.getByRole('option', { name: 'Amount - $' }).click();
  // await page.getByRole('button', { name: 'SAVE MAPPING' }).click();
  // await page.getByRole('button', { name: '' }).nth(3).click();
  // await page.locator("//span[normalize-space()='Data Operations']").click();
  // //await page.locator('.col-4 > .v-input > .v-input__control > .v-input__slot').click();
  // await page.locator("//div[normalize-space()='Length']/..//input").click();
  // await page.locator('.pl-4 > .col-12 > div').first().click();
  await page.getByRole('button', { name: 'SAVE MAPPING' }).click();
  await page.waitForTimeout(10000);
  takeScreenShot(page,'Line Items After Mapping'+l,'lineItemsaftermapping'+l);
  

  let actualDescription = await page.inputValue("//input[@column_name='Description__standard']");
  let actualUnitPrice = await page.inputValue("//input[@column_name='Unit_Price__standard']");
  let actualQuantity = await page.inputValue("//input[@column_name='Quantity__standard']");
  let actualTotalPrice = await page.inputValue("//input[@column_name='Total_Price__standard']");

  // console.log(actualDescription,actualUnitPrice,actualQuantity,actualTotalPrice);

  
  
  let expectedDescription = await getDescription(normalizedExtractedText,actualDescription);
  if(expectedDescription === actualDescription){
    console.log("Description matches with PDF - "+expectedDescription+" for page "+l);
  }else{
    console.error("Description not matches with PDF"+" for page "+l);
    console.error("Expected= "+expectedDescription);
    console.error("Actual= "+actualDescription);
    allCheck = false;
    statusReport.push(false);
  }
  
  let expectedUnitPrice = await getPDFValWith1Regx(normalizedExtractedText,actualUnitPrice);
  if(expectedUnitPrice === actualUnitPrice){
    console.log("UnitPrice matches with PDF - "+expectedUnitPrice+" for page "+l);
  }else{
    console.error("UnitPrice not matches with PDF"+" for page "+l);
    allCheck = false;
    statusReport.push(false);
  }

  let expectedQuantity = await getPDFValWith1Regx(normalizedExtractedText,actualQuantity);
  if(expectedQuantity === actualQuantity){
    console.log("Quantity matches with PDF - "+expectedQuantity+" for page "+l);
  }else{
    console.error("Quantity not matches with PDF"+" for page "+l);
    allCheck = false;
    statusReport.push(false);
  }

  let expectedTotalPrice = await getPDFValWith1Regx(normalizedExtractedText,actualTotalPrice);
  if(expectedTotalPrice === actualTotalPrice){
    console.log("TotalPrice matches with PDF - "+expectedTotalPrice+" for page "+l);
  }else{
    console.error("TotalPrice not matches with PDF"+" for page "+l);
    allCheck = false;
    statusReport.push(false);
  }


  // await page.locator('.row > div:nth-child(2) > button:nth-child(4)').click();
  // expect(allCheck).toEqual(true);
  console.log(noOfLineItems+" ==== "+l);
  if(noOfLineItems !== l){
    await page.locator("//button[@aria-label='Next page']").click();
  }
  await page.waitForTimeout(10000);
}
  }
  if(statusReport.includes(false)){
    throw new error("Value for some line items not matches with PDF values");
  }
});

test('17. Verification of Attachments tab', async({ page })=>{
  const fileName = testData.get('17').get('FilesToUpload');
  const folderName = testData.get('17').get('FolderName');
  const uploadFileAtt = testData.get('17').get('uploadFileAtt');
  const linkFileAtt = testData.get('17').get('linkFileAtt').replace(".pdf","");
  
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  let fileToSearch = fileName.replace(".pdf","");
  await page.getByLabel('Search card').fill(fileToSearch)
  if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
    await page.locator("//input[@id='headerChk']").click(); 
  }
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  let fileNames = await getGridColumnTextsByindex(page, "2",rows);
  let totalRows = await rows.count();
 
  for (let i = 0; i < totalRows; i++) {
    console.log("Validating Upload Attachments for file - "+fileNames[i]);

    // console.log(`Clicking on row ${i + 1}`);
    await rows.nth(i).click();
    await page.waitForTimeout(10000);
    //Line Iteams 
   
    //Initialy validate attachments no
   await page.locator("//div[@tab-value='attachments']").click();
   takeScreenShot(page,'Initialy validate attachments no','inivalidateattno');
   let noOfItems = await getNoOfItems(page,"//div[@tab-value='attachments']");
   expect(noOfItems).toEqual("0");
   
  //Upload file and verify attachments count
   await page.getByLabel('Click to upload').setInputFiles('./FilesToUpload/'+uploadFileAtt);
   await page.getByText('image.png').click();
   await page.getByRole('button', { name: 'Upload' }).click();
   await page.waitForTimeout(15000);
   takeScreenShot(page,'Upload file and verify attachments count','attnoafterupload');
   noOfItems = await getNoOfItems(page,"//div[@tab-value='attachments']");
   expect(noOfItems).toEqual("1");

  //Delete uploaded file and verify attachments count
  deleteAttachments(page,noOfItems)
  await page.waitForTimeout(15000);
  takeScreenShot(page,'Delete uploaded file and verify attachments count','attnoafterdelete');
  noOfItems = await getNoOfItems(page,"//div[@tab-value='attachments']");
  expect(noOfItems).toEqual("0");

   //Link files and validate attachments count 
   await page.getByText('Click to select files').click();
   await page.getByPlaceholder('Search').click();
   await page.getByPlaceholder('Search').fill(linkFileAtt);
   await page.getByPlaceholder('Search').press('Enter');
   await page.waitForTimeout(15000);
   await page.getByLabel('Select', { exact: true }).locator('div').nth(4).click();
   const linkFiles = await page.locator('//table//tbody//tr');
   let linkFilesCount = await linkFiles.count();
   await page.locator('div').filter({ hasText: /^LINK$/ }).click();
   await page.waitForTimeout(15000);
  takeScreenShot(page,'Link files and validate attachments count','linkfile');
  noOfItems = await getNoOfItems(page,"//div[@tab-value='attachments']");
  console.log("linkFilesCount = "+linkFilesCount);
  expect(Number(noOfItems)).toEqual(linkFilesCount);

  //Delete link file and verify attachments count
  deleteAttachments(page,noOfItems)
  await page.waitForTimeout(15000);
  takeScreenShot(page,'Delete link file and verify attachments count','deletelinkfile');
  noOfItems = await getNoOfItems(page,"//div[@tab-value='attachments']");
  expect(noOfItems).toEqual("0");
  }

  
});

test('18. Verify all Types added in allocations', async({ page })=>{
  const fileName = testData.get('18').get('FilesToUpload');
  const folderName = testData.get('18').get('FolderName');
  const TypestoAdd = testData.get('18').get('TypestoAdd');

  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  let fileToSearch = fileName.replace(".pdf","");
  await page.getByLabel('Search card').fill(fileToSearch)
  if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
    await page.locator("//input[@id='headerChk']").click(); 
  }
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  let fileNames = await getGridColumnTextsByindex(page, "2",rows);
  let totalRows = await rows.count();
 
  for (let i = 0; i < totalRows; i++) {
    console.log("Validating Allocations for file - "+fileNames[i]);

    // console.log(`Clicking on row ${i + 1}`);
    await rows.nth(i).click();
    await page.waitForTimeout(10000);
    await page.locator("//div[@tab-value='allocations']").click();
    await page.waitForTimeout(10000);
    let allocationsrows = await page.locator('//table//tr');
    
    let totalAllocationsRows = await allocationsrows.count();
    let typesToAdds = [];
    typesToAdds = TypestoAdd.split(',');
    await page.locator("//span[normalize-space()='Add new row']").click();
    // const arrayLength = typesToAdds.length;
    // let a = 0;
    let newrow = totalAllocationsRows + 1;
    for (let i = 0; i < typesToAdds.length; i++) {
      
      console.log("newrow---- "+newrow);
      await page.locator("(//table//tr["+newrow+"]//td//label[text()='Type']/..//input)[1]").click();
      await page.getByText(typesToAdds[i]).click();
      // await page.locator("//span[normalize-space()='Clear Values']").click();
      await page.waitForTimeout(10000);
      await page.locator("//span[normalize-space()='Add new row']").click();
      allocationsrows = await page.locator('//table//tr');
      totalAllocationsRows = await allocationsrows.count();
      newrow = totalAllocationsRows;
      // a++;
    }
  }
});

test('18_54. Enter the values for Allocation fields and hit save', async({ page })=>{
  const fileName = testData.get('18_54').get('FilesToUpload');
  const folderName = testData.get('18_54').get('FolderName');
  const ProjectNameToEdit = testData.get('18_54').get('ProjectNameToEdit');

  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  let fileToSearch = fileName.replace(".pdf","");
  await page.getByLabel('Search card').fill(fileToSearch)
  if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
    await page.locator("//input[@id='headerChk']").click(); 
  }
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  let fileNames = await getGridColumnTextsByindex(page, "2",rows);
  let totalRows = await rows.count();
 
  for (let i = 0; i < totalRows; i++) {
    console.log("Validating Allocations for file - "+fileNames[i]);

    // console.log(`Clicking on row ${i + 1}`);
    await rows.nth(i).click();
    await page.waitForTimeout(10000);
    await page.locator("//div[@tab-value='allocations']").click();

    // const allocationsrows = await page.locator('//table//tr');
    // let totalAllocationsRows = await allocationsrows.count();
    // for (let j = 1; j <= totalAllocationsRows; j++) {
    // await page.locator("(//table//tr[1]//td//label[text()='Project*']/..//input)[1]").click();
    await page.locator("(//table//tr[1]//td//label[text()='Project*']/..//input)[1]").click();
    await page.getByText(ProjectNameToEdit).click();

    await page.locator("(//table//tr[1]//td//label[text()='Amount']/..//input)[1]").clear();
    await page.locator("(//table//tr[1]//td//label[text()='Amount']/..//input)[1]").fill("4");

    await page.locator("//span[normalize-space()='Save']").click();
    await page.locator('.row > div:nth-child(2) > button:nth-child(4)').click(); //close

    //Verify edited values
    await rows.nth(i).click();
    await page.waitForTimeout(10000);
    await page.locator("//div[@tab-value='allocations']").click();
    const projectVal = await page.locator("(//table//tr[1]//td//label[text()='Project*']/..//input)[1]").inputValue();
    console.log("projectVal === "+projectVal);
    const amountVal = await page.locator("(//table//tr[1]//td//label[text()='Amount']/..//input)[1]").inputValue();
    console.log("amountVal === "+amountVal);
    expect(projectVal).toEqual(ProjectNameToEdit);
    expect(amountVal).toEqual("4.00");
  }
});
test.only('20.1. Check tabls visible in line items', async({ page })=>{
  await page.getByText('Red wing test DV_split_4.pdf').first().click();
  await page.getByRole('tab', { name: 'Line Items (10)' }).click();
  //Check tabls visible 
  await page.getByText('Table View of Line Items').isVisible();
  await page.getByText('Description').isVisible();
  await page.getByText('Description *').isVisible();
  await page.getByText('Unit Price').isVisible();
  await page.locator('div:nth-child(3) > .d-flex').first().isVisible();
  await page.getByText('Quantity').isVisible();
  await page.getByText('Quantity *').isVisible();
  await page.getByText('Total Price').isVisible();
  await page.getByText('Total Price *').isVisible();
  await page.locator('.mx-2 > .v-input > .v-input__control > .v-input__slot').isVisible();
  await page.getByRole('button', { name: 'Add Line Item' }).isVisible();
  

  
  
});

test.only('20.2. Edit value in line iteam and save the changes in table view', async({ page })=>{
  const fileName = testData.get('20.2').get('FilesToUpload');
  const folderName = testData.get('20.2').get('FolderName');
  let unitPriceToUpdate = testData.get('20.2').get('UnitPrice');
  let QuantityToUpdate = testData.get('20.2').get('Quantity');
  let TotalPriceToUpdate = testData.get('20.2').get('TotalPrice');
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(12000);
  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
    await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  // takeScreenShot(page,'Before update UnitPrice,Quantity,TotalPrice','beforeupdatelineItems');
   
  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  console.log("actual noOfLineItems = "+noOfLineItems);
  // noOfLineItems = 2;
  console.log("noOfLineItems = "+noOfLineItems);
  let noValues = noOfLineItems * 3;
  const values = Array.from({ length: noValues }, getRandomValue);
  console.log("values====== "+values);
   
   let v = 0;
   let c = 2;
   for (let l = 1; l <= noOfLineItems; l++) {
    await page.waitForTimeout(1000);
        console.log("Editing line items "+l);
        unitPriceToUpdate = values[v];
        v = v + 1;
        QuantityToUpdate = values[v];
        v = v + 1;
        TotalPriceToUpdate = values[v];
        v = v + 1;

        unitPriceToUpdate = unitPriceToUpdate.toString();
        QuantityToUpdate = QuantityToUpdate.toString().split('.')[0];
        TotalPriceToUpdate = TotalPriceToUpdate.toString();
      
        // console.log("unitPriceToUpdate = "+unitPriceToUpdate);
        // console.log("QuantityToUpdate = "+QuantityToUpdate);
        // console.log("TotalPriceToUpdate = "+TotalPriceToUpdate);

       takeScreenShot(page,'Before Edit Line Items'+l,'lineItems'+l);
      // Edit value in one line iteam and save the changes 
      const unitPrice = page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="3"] div');
      await unitPrice.click();
      await page.keyboard.type(unitPriceToUpdate);  
      await page.keyboard.press('Enter');

      const quantity = page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="4"] div');
      await quantity.click();
      await page.keyboard.type(QuantityToUpdate);
      await page.keyboard.press('Enter');

      const totalPrice = page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="5"] div');
      await totalPrice.click();
      await page.keyboard.type(TotalPriceToUpdate);
      await page.keyboard.press('Enter');

     c++;
     await page.waitForTimeout(1000);
   }
 
   await page.getByRole('button', { name: 'Save' }).click();
   await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();
   

   await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 
   //Validate updated values
   await page.locator("//div[@tab-value='line_items']").click();
  
   noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  //  noOfLineItems = 2;

   v = 0;
   c = 2;
   for (let l = 1; l <= noOfLineItems; l++) {
    console.log("Validating edited line items "+l);
    takeScreenShot(page,'After Edit Line Items'+l,'lineItems'+l);

    unitPriceToUpdate = values[v];
    v = v + 1;
    QuantityToUpdate = values[v];
    v = v + 1;
    TotalPriceToUpdate = values[v];
    v = v + 1;

    unitPriceToUpdate = unitPriceToUpdate.toString();
    QuantityToUpdate = QuantityToUpdate.toString().split('.')[0];
    TotalPriceToUpdate = TotalPriceToUpdate.toString();

    console.log("in validation unitPriceToUpdate = "+unitPriceToUpdate);
    console.log("in validation QuantityToUpdate = "+QuantityToUpdate);
    console.log("in validation TotalPriceToUpdate = "+TotalPriceToUpdate);
       
  //  console.log('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="3"] div');
   const unitPrice = await page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="3"] div');
   const updatedUnitPrice = await unitPrice.textContent();
   console.log("updatedUnitPrice = "+updatedUnitPrice);
   if(updatedUnitPrice != null){
    expect(updatedUnitPrice.trim()).toBe(unitPriceToUpdate);
   }else{
    expect(null).toBe(unitPriceToUpdate);
   }

   const quantity = await page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="4"] div');
   const updatedquantity = await quantity.textContent();
   console.log("updatedquantity = "+updatedquantity);
   if(updatedquantity != null){
    expect(updatedquantity.trim()).toBe(QuantityToUpdate);
   }else{
    expect(null).toBe(QuantityToUpdate);
   }

   const totalPrice = await page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="5"] div');
   const updatedtotalPrice = await totalPrice.textContent();
   console.log("updatedtotalPrice = "+updatedtotalPrice);
   
   if(updatedtotalPrice != null){
    expect(updatedtotalPrice.trim()).toBe(TotalPriceToUpdate);
   }else{
    expect(null).toBe(TotalPriceToUpdate);
   }
   c++;
   await page.waitForTimeout(1000);
  }

});

test.only('20.2.1 Edit value in line iteam and save the changes in form mode', async({ page })=>{
  const fileName = testData.get('20.2.1').get('FilesToUpload');
  const folderName = testData.get('20.2.1').get('FolderName');
  let unitPriceToUpdate = testData.get('20.2.1').get('UnitPrice');
  let QuantityToUpdate = testData.get('20.2.1').get('Quantity');
  let TotalPriceToUpdate = testData.get('20.2.1').get('TotalPrice');
 
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(12000);
  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
    await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  // takeScreenShot(page,'Before update UnitPrice,Quantity,TotalPrice','beforeupdatelineItems');

  await page.getByRole('button', { name: '' }).click();
  await page.waitForTimeout(10000);

  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  noOfLineItems = 5;
  let noValues = noOfLineItems * 3;
  const values = Array.from({ length: noValues }, getRandomValue);
  console.log("values====== "+values);
   console.log("noOfLineItems = "+noOfLineItems);
   let v = 0;
   for (let l = 1; l <= noOfLineItems; l++) {
    await page.waitForTimeout(1000);
        console.log("Editing line items "+l);
        unitPriceToUpdate = values[v];
        v = v + 1;
        QuantityToUpdate = values[v];
        v = v + 1;
        TotalPriceToUpdate = values[v];
        v = v + 1;

        unitPriceToUpdate = unitPriceToUpdate.toString();
        QuantityToUpdate = QuantityToUpdate.toString().split('.')[0];
        TotalPriceToUpdate = TotalPriceToUpdate.toString();
      
        console.log("unitPriceToUpdate = "+unitPriceToUpdate);
        console.log("QuantityToUpdate = "+QuantityToUpdate);
        console.log("TotalPriceToUpdate = "+TotalPriceToUpdate);

       takeScreenShot(page,'Before Edit Line Items'+l,'lineItems'+l);
       const unitPrice = await page.locator('input[column_name="Unit_Price__standard"]');
       await unitPrice.clear();
       await unitPrice.fill(unitPriceToUpdate);
  
       const quantity = await page.locator('input[column_name="Quantity__standard"]');
        await quantity.clear();
        await quantity.fill(QuantityToUpdate);
       
        const totalPrice = await page.locator('input[column_name="Total_Price__standard"]');
        await totalPrice.clear();
        await totalPrice.fill(TotalPriceToUpdate);
       
        console.log(noOfLineItems+" ==== "+l);
        if(noOfLineItems !== l){
          await page.locator("//button[@aria-label='Next page']").click();
        }
        await page.waitForTimeout(10000);

   }

   await page.getByRole('button', { name: 'Save' }).click();
   await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();
   await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 

   //Validate edited line items
   await page.locator("//div[@tab-value='line_items']").click();
   await page.getByRole('button', { name: '' }).click();
   noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
   noOfLineItems = 5;

   v = 0;
   for (let l = 1; l <= noOfLineItems; l++) {
    console.log("Validating edited line items "+l);
    takeScreenShot(page,'After Edit Line Items'+l,'lineItems'+l);

    unitPriceToUpdate = values[v];
    v = v + 1;
    QuantityToUpdate = values[v];
    v = v + 1;
    TotalPriceToUpdate = values[v];
    v = v + 1;

    unitPriceToUpdate = unitPriceToUpdate.toString();
    QuantityToUpdate = QuantityToUpdate.toString().split('.')[0];
    TotalPriceToUpdate = TotalPriceToUpdate.toString();

    console.log("in validation unitPriceToUpdate = "+unitPriceToUpdate);
    console.log("in validation QuantityToUpdate = "+QuantityToUpdate);
       
      

    const updatedUnitPrice = await page.locator('input[column_name="Unit_Price__standard"]').inputValue();
    // console.log("updatedUnitPrice = "+updatedUnitPrice);
    // console.log("in validation unitPriceToUpdate1 = "+unitPriceToUpdate);
    // unitPriceToUpdate = Number(unitPriceToUpdate);
    // console.log("in validation unitPriceToUpdate2 = "+unitPriceToUpdate);
    // if(String(unitPriceToUpdate).includes('.')){
    //   unitPriceToUpdate = unitPriceToUpdate.toFixed(2).replace(/0$/, '');
    // }
    // console.log("in validation unitPriceToUpdate3 = "+unitPriceToUpdate);
    if(updatedUnitPrice != null){
      expect(updatedUnitPrice.trim()).toBe(unitPriceToUpdate);
    }else{
      expect(null).toBe(unitPriceToUpdate);
    } 

    const quantity = await page.locator('input[column_name="Quantity__standard"]');
    const updatedquantity = await quantity.inputValue();
  //  console.log("updatedquantity = "+updatedquantity);
   if(updatedquantity != null){
    expect(updatedquantity.trim()).toBe(QuantityToUpdate);
   }else{
    expect(null).toBe(QuantityToUpdate);
   }

   const totalPrice = await page.locator('input[column_name="Total_Price__standard"]');
   const updatedtotalPrice = await totalPrice.inputValue();
  //  console.log("updatedtotalPrice = "+updatedtotalPrice);
  // console.log("in validation TotalPriceToUpdate1 = "+TotalPriceToUpdate);
  //  TotalPriceToUpdate = Number(TotalPriceToUpdate);
  //  console.log("in validation TotalPriceToUpdate2 = "+TotalPriceToUpdate);
  //  if(String(TotalPriceToUpdate).includes('.')){
  //  TotalPriceToUpdate = TotalPriceToUpdate.toFixed(4).replace(/0$/, '');
  //  }
  //  console.log("in validation TotalPriceToUpdate = "+TotalPriceToUpdate);
  //  console.log("in validation updatedtotalPrice = "+updatedtotalPrice);
   if(updatedtotalPrice != null){
    expect(updatedtotalPrice.trim()).toBe(TotalPriceToUpdate);
   }else{
    expect(null).toBe(TotalPriceToUpdate);
   }

   if(noOfLineItems !== l){
    await page.locator("//button[@aria-label='Next page']").click();
  }
  await page.waitForTimeout(10000);
   }


});

test.only('20.3. Add new line item adding value into all coloums and validating after saving in table view', async({ page })=>{
  const fileName = testData.get('20.3').get('FilesToUpload');
  const folderName = testData.get('20.3').get('FolderName');
  const Description = testData.get('20.3').get('Description');
  const unitPrice = testData.get('20.3').get('UnitPrice');
  const Quantity = testData.get('20.3').get('Quantity');
  const TotalPrice = testData.get('20.3').get('TotalPrice');
 
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(12000);
  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
  await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  if(await page.getByRole('button', { name: 'Table View' }).isVisible()){
    //Shift to table view
    await page.getByRole('button', { name: 'Table View' }).click();
  }

  const lineitemsrows = await page.locator('div[ref="eCenterContainer"] div[role="row"]');
  let totalRows = await lineitemsrows.count();
  let extraRow = await totalRows + 2;
  takeScreenShot(page,'Before add line item','beforeaddlineItems');
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Add Line Item' }).click();

   // Add new line item adding value into all coloums ans validating after saving
  const desc = page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+ extraRow +'"] div[aria-colindex="2"]');
  await desc.click();
  await page.keyboard.type(Description);  
  await page.keyboard.press('Enter');

  const unitprice = page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+ extraRow +'"] div[aria-colindex="3"]');
  await unitprice.click();
  await page.keyboard.type(unitPrice);  
  await page.keyboard.press('Enter');

  const quantity = page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+ extraRow +'"] div[aria-colindex="4"]');
  await quantity.click();
  await page.keyboard.type(Quantity);  
  await page.keyboard.press('Enter');

  const totalprice = page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+ extraRow +'"] div[aria-colindex="5"]');
  await totalprice.click();
  await page.keyboard.type(TotalPrice);  
  await page.keyboard.press('Enter');
 
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();

  await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 
   await page.locator("//div[@tab-value='line_items']").click();
   await page.waitForTimeout(10000);

   //Validate updated values
   const updatedDesc = await desc.textContent();
   console.log("updatedDesc = "+updatedDesc);
   if(updatedDesc != null){
    expect(updatedDesc.trim()).toBe(Description);
   }else{
    expect(null).toBe(Description);
   }

   const updatedUnitPrice = await unitprice.textContent();
   console.log("updatedUnitPrice = "+updatedUnitPrice);
   if(updatedUnitPrice != null){
    expect(updatedUnitPrice.trim()).toBe(unitPrice);
   }else{
    expect(null).toBe(unitPrice);
   }

   const updatedquantity = await quantity.textContent();
   console.log("updatedquantity = "+updatedquantity);
   if(updatedquantity != null){
    expect(updatedquantity.trim()).toBe(Quantity);
   }else{
    expect(null).toBe(Quantity);
   }

   const updatedtotalPrice = await totalprice.textContent();
   console.log("updatedtotalPrice = "+updatedtotalPrice);
   
   if(updatedtotalPrice != null){
    expect(updatedtotalPrice.trim()).toBe(TotalPrice);
   }else{
    expect(null).toBe(TotalPrice);
   }
 
});

test.only('20.3.1 Add new line item adding value into all coloums and validating after saving in form mode', async({ page })=>{
  const fileName = testData.get('20.3.1').get('FilesToUpload');
  const folderName = testData.get('20.3.1').get('FolderName');
  const Description = testData.get('20.3.1').get('Description');
  const unitPrice = testData.get('20.3.1').get('UnitPrice');
  const Quantity = testData.get('20.3.1').get('Quantity');
  const TotalPrice = testData.get('20.3.1').get('TotalPrice');

  console.log("Description="+Description);
  console.log("unitPrice="+unitPrice);
  console.log("Quantity="+Quantity);
  console.log("TotalPrice="+TotalPrice);
 
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(12000);
  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
  await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  await page.getByRole('button', { name: '' }).click();
  await page.waitForTimeout(10000);

  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  let expected_noOfLineItems = Number(noOfLineItems) + 1;
  takeScreenShot(page,'Before add line item','beforeaddlineItems');
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Add Line Item' }).click();

  let noValues = noOfLineItems * 3;
  const values = Array.from({ length: noValues }, getRandomValue);
  console.log("values====== "+values);

   // Add new line item adding value into all coloums ans validating after saving
  await page.locator('input[column_name="Description__standard"]').fill(Description);
  await page.locator('(//input[@column_name="Unit_Price__standard"])[1]').fill(unitPrice);
  await page.locator('(//input[@column_name="Quantity__standard"])[1]').fill(Quantity);
  await page.locator('(//input[@column_name="Total_Price__standard"])[1]').fill('111.11');
  await page.locator('(//input[@column_name="Total_Price__standard"])[2]').fill(TotalPrice);
  
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();

  await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 
   await page.locator("//div[@tab-value='line_items']").click();
   await page.getByRole('button', { name: '' }).click();
   await page.waitForTimeout(10000);

   let actual_noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
   expect(Number(actual_noOfLineItems)).toBe(expected_noOfLineItems);
   await page.locator('//button[text()="'+actual_noOfLineItems+'"]').click();

   //Validate updated values
   const updatedDesc = await page.locator('input[column_name="Description__standard"]').inputValue();
   console.log("updatedDesc = "+updatedDesc);
   if(updatedDesc != null){
    expect(updatedDesc.trim()).toBe(Description);
   }else{
    expect(null).toBe(Description);
   }

   const updatedUnitPrice = await page.locator('input[column_name="Unit_Price__standard"]').inputValue();
   console.log("updatedUnitPrice = "+updatedUnitPrice);
   if(updatedUnitPrice != null){
    expect(updatedUnitPrice.trim()).toBe(unitPrice);
   }else{
    expect(null).toBe(unitPrice);
   }

   const updatedquantity = await page.locator('input[column_name="Quantity__standard"]').inputValue();
   console.log("updatedquantity = "+updatedquantity);
   if(updatedquantity != null){
    expect(updatedquantity.trim()).toBe(Quantity);
   }else{
    expect(null).toBe(Quantity);
   }

   const updatedtotalPrice = await page.locator('input[column_name="Total_Price__standard"]').inputValue();
   console.log("updatedtotalPrice = "+updatedtotalPrice);
   
   if(updatedtotalPrice != null){
    expect(updatedtotalPrice.trim()).toBe(TotalPrice);
   }else{
    expect(null).toBe(TotalPrice);
   }
 
});

test.only('20.4 Verify Delete line items in table view', async({ page })=>{
  const fileName = testData.get('20.4').get('FilesToUpload');
  const folderName = testData.get('20.4').get('FolderName');
 
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(12000);
  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
  await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  await page.waitForTimeout(1000);
  if(await page.getByRole('button', { name: 'Table View' }).isVisible()){
    //Shift to table view
    await page.getByRole('button', { name: 'Table View' }).click();
  }

  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  let noLIToDelete = noOfLineItems;
  if(Number(noOfLineItems) > 2){
    noLIToDelete = 2;
  }
  let expected_noOfLineItems = Number(noOfLineItems) - noLIToDelete;
  takeScreenShot(page,'Before delete line item','beforedellineItems');
  await page.waitForTimeout(10000);
  let c = 2;
 
  // await page.waitForTimeout(10000);
  for (let l = 1; l <= noLIToDelete; l++) {
    
    console.log('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="8"] div button')
    await page.locator('div[ref="eCenterContainer"] div[aria-rowindex="'+c+'"] div[aria-colindex="8"] div button').click();
    c++;
  }
 
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();
  takeScreenShot(page,'After delete line item','afterdellineItems');

  await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 
   await page.locator("//div[@tab-value='line_items']").click();
   await page.waitForTimeout(10000);

   let actual_noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
   expect(Number(actual_noOfLineItems)).toBe(expected_noOfLineItems);
 
   
});

test('20.4.1 Verify Delete line items in form view', async({ page })=>{
  const fileName = testData.get('20.4').get('FilesToUpload');
  const folderName = testData.get('20.4').get('FolderName');
 
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(12000);
  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
  await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  if(await page.locator("//strong[normalize-space()='Table View of Line Items']").isVisible()){
    //Shift to form view
    await page.getByRole('button', { name: '' }).click();
  }
  await page.waitForTimeout(10000);

  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  let noLIToDelete = noOfLineItems;
  if(Number(noOfLineItems) > 2){
    noLIToDelete = 2;
  }
  let expected_noOfLineItems = Number(noOfLineItems) - noLIToDelete;
  takeScreenShot(page,'Before delete line item','beforedellineItems');
  await page.waitForTimeout(10000);
 
  // await page.waitForTimeout(10000);
  for (let l = 1; l <= noLIToDelete; l++) {
    console.log("Deleting Line Item "+l);
    await page.getByRole('button', { name: 'Delete' }).click();
    await page.locator("//span[text()=' Delete Line Item ']/../..//button//span[text()=' Delete ']").click();
    if(noOfLineItems !== l){
      await page.locator("//button[@aria-label='Next page']").click();
    }
    await page.waitForTimeout(10000);
  }
 
  await page.waitForTimeout(1000);
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();

  

  await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 
   await page.locator("//div[@tab-value='line_items']").click();
   await page.waitForTimeout(10000);
   if(await page.locator("//strong[normalize-space()='Table View of Line Items']").isVisible()){
    //Shift to form view
    await page.getByRole('button', { name: '' }).click();
  }
  takeScreenShot(page,'After delete line item','afterdellineItems');
   let actual_noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
   console.log("Validating No of line items after delete");
    console.log("Actual= "+actual_noOfLineItems);
    console.log("Expected= "+expected_noOfLineItems);
   expect(Number(actual_noOfLineItems)).toBe(expected_noOfLineItems);
 
   
});

test('20.5 Invoice Settings', async({ page })=>{
  ////*[@id="app"]/div[1]/div[3]/div[3]/div/div/nav/div[1]/div[2]/div/div[3]/div/div/div[1]
  // await page.locator("//*[@id='app']/div[1]/div[3]/div[3]/div/div/nav/div[1]/div[2]/div/div[3]/div/div/div[1]").click();
  // await page.locator("//*[@id='app']/div[1]/div[3]/div[3]/div/div/nav/div[1]/div[2]/div/div[3]/div/div/div[2]/a[10]/div[1]").click();
  await page.locator("//*[@id='app']/div[1]/div[3]/div[3]/div/div/nav/div[1]/div[2]/div/div[3]/div/div/div[1]").scrollIntoViewIfNeeded();
  await page.getByRole("button", { name: "Admin" }).click();
 
  await page.getByRole('link', { name: 'Invoice Settings' }).click();
  await page.getByRole('tab', { name: 'Configuration' }).click();
  await page.locator('div:nth-child(7) > div > .mt-n5 > .v-input > .v-input__control > .v-input__slot > .v-input--radio-group__input > div:nth-child(2) > .v-input--selection-controls__input > .v-input--selection-controls__ripple').click();
  await page.getByRole('heading', { name: 'Validation of sum total' }).click();
  await page.getByRole('heading', { name: 'Auto invoice split' }).click();
  await page.locator('div:nth-child(2) > .overflow-hidden > div > .mb-2 > div > .d-flex > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple').first().click();
  await page.locator('div:nth-child(2) > .overflow-hidden > div > .mb-2 > div:nth-child(2) > .d-flex > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple').click();
  await page.locator('div:nth-child(2) > .overflow-hidden > div > .mb-2 > div:nth-child(2) > .d-flex > .v-input > .v-input__control > .v-input__slot > .v-input--selection-controls__input > .v-input--selection-controls__ripple').click();
  await page.locator('.w-100 > .v-input > .v-input__control > .v-input__slot > .v-input--radio-group__input > div:nth-child(2) > .v-input--selection-controls__input > .v-input--selection-controls__ripple').first().click();
  await page.locator('.w-100 > .v-input > .v-input__control > .v-input__slot > .v-input--radio-group__input > div > .v-input--selection-controls__input > .v-input--selection-controls__ripple').first().click();
  await page.getByRole('heading', { name: 'Receive automation failure' }).click();
  await page.getByRole('heading', { name: 'Validate against PO data' }).click();
  await page.getByRole('heading', { name: 'Line items table' }).click();
  await page.locator('div:nth-child(7) > div > .mt-n5 > .v-input > .v-input__control > .v-input__slot > .v-input--radio-group__input > div > .v-input--selection-controls__input > .v-input--selection-controls__ripple').first().click();
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'Save Changes' }).click();

});


test.only('21 Getting information from API', async({ page })=>{
  const apiContext = await request.newContext({
    baseURL: 'https://app-dev.briq.com/#/pages/login', // Your existing API
    extraHTTPHeaders: {
      'Authorization': 'Bearer your_token_here', // Optional
      'Content-Type': 'application/json'
    }
  });

  const response = await apiContext.get('/users/123');
  expect(response.ok()).toBeTruthy();

  const user = await response.json();
  console.log('User data:', user);
});

test.only('22. Edit value in company specific line iteam and save the changes in table view', async({ page })=>{
  const fileName = testData.get('22').get('FilesToUpload');
  const folderName = testData.get('22').get('FolderName');
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'All' }).click();
  await page.waitForTimeout(10000);

  //Get company specific selected line items from API
  const LineItemsFieldsForEdit = [];
  const data = await fetchInvoices();
  data.folder_data.invoice_line_item_fields.forEach((field, index) => {
    // console.log(`Field ${index + 1}:`, field);
    const { name, visible } = field;
    
    if (visible) {
      LineItemsFieldsForEdit.push(name); // or push the whole field if needed
    }
  });
  console.log(LineItemsFieldsForEdit);

  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
  await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  if(await page.getByRole('button', { name: 'Table View' }).isVisible()){
    //Shift to table view
    await page.getByRole('button', { name: 'Table View' }).click();
  }
  
  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  console.log("actual noOfLineItems = "+noOfLineItems);
  noOfLineItems = 1;
  console.log("noOfLineItems = "+noOfLineItems);

   let c = 2;
   var editedLineItemsMap = new Map();
   for (let l = 1; l <= noOfLineItems; l++) {
      await page.waitForTimeout(1000);
      console.log("Editing line items "+l);
     
      takeScreenShot(page,'Before Edit Line Items'+l,'lineItems'+l);

        // Edit value in one line iteam and save the changes 
        
          let colindex = 2;
          for (let i = 0; i < LineItemsFieldsForEdit.length; i++) {
            let xpath = "div[ref='eCenterContainer'] div[aria-rowindex='"+c+"'] div[aria-colindex='"+colindex+"']";
            const element = page.locator(xpath);
            let dataType = "number";
          if(LineItemsFieldsForEdit[i].includes('Description')){
            dataType = "string";
          }
          let value = await getRandomValuesAsPerDataType(dataType);
            console.log("Value ===== "+value);
            editedLineItemsMap.set("LineItem_"+l+"_"+LineItemsFieldsForEdit[i],xpath+"|"+value.toString());
            await element.click();
            await page.keyboard.type(value.toString());  
            await page.keyboard.press('Enter');
            colindex++;
      
            
          }
       
          c++;
          await page.waitForTimeout(10000);
   }
   console.log(editedLineItemsMap);
   await page.waitForTimeout(1000);
   await page.getByRole('button', { name: 'Save' }).click();
   await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();
   

   await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 
   //Validate updated values
   await page.locator("//div[@tab-value='line_items']").click();
  
  
   for (let l = 1; l <= noOfLineItems; l++) {
    for (let i = 0; i < LineItemsFieldsForEdit.length; i++) {
      let xpath = editedLineItemsMap.get("LineItem_"+l+"_"+LineItemsFieldsForEdit[i]).split("|")[0];
      let expectedValue = editedLineItemsMap.get("LineItem_"+l+"_"+LineItemsFieldsForEdit[i]).split("|")[1];
      // console.log(xpath+" --- "+expectedValue);
      const element = page.locator(xpath);
      let actualValue = await element.textContent();
      console.log("actualValue = "+actualValue);
      console.log("expectedValue = "+expectedValue);
      if(actualValue != null){
        expect(actualValue.trim()).toBe(expectedValue);
      }else{
        expect(null).toBe(expectedValue);
      }
    }

   }
 
});

test.only('22.1. Edit value in company specific line iteam and save the changes in form view', async({ page })=>{
  const fileName = testData.get('22.1').get('FilesToUpload');
  const folderName = testData.get('22.1').get('FolderName');
  
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'All' }).click();
  await page.waitForTimeout(10000);

   //Get company specific selected line items from API
   const LineItemsFieldsForEdit = [];
   const data = await fetchInvoices();
   data.folder_data.invoice_line_item_fields.forEach((field, index) => {
     // console.log(`Field ${index + 1}:`, field);
     const { name, visible } = field;
     
     if (visible) {
       LineItemsFieldsForEdit.push(name); // or push the whole field if needed
     }
   });
   console.log(LineItemsFieldsForEdit);

  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
    await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  // takeScreenShot(page,'Before update UnitPrice,Quantity,TotalPrice','beforeupdatelineItems');

  if(await page.locator("//strong[normalize-space()='Table View of Line Items']").isVisible()){
    //Shift to form view
    await page.getByRole('button', { name: '' }).click();
  }
  await page.waitForTimeout(10000);

  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  noOfLineItems = 1;
  console.log("noOfLineItems = "+noOfLineItems);

  var editedLineItemsMap = new Map();
   for (let l = 1; l <= noOfLineItems; l++) {
    await page.waitForTimeout(1000);
      console.log("Editing line items "+l);
        takeScreenShot(page,'Before Edit Line Items'+l,'lineItems'+l);

        for (let i = 0; i < LineItemsFieldsForEdit.length; i++) {
          let dataType = "number";
          if(LineItemsFieldsForEdit[i].includes('Description')){
            dataType = "string";
          }
          let value = await getRandomValuesAsPerDataType(dataType);
          console.log("Value ===== "+value);
          let xpath = 'input[column_name="'+LineItemsFieldsForEdit[i]+'"]';
          // console.log("XPATH ==== "+xpath);
          const element = page.locator(xpath);
          editedLineItemsMap.set("LineItem_"+l+"_"+LineItemsFieldsForEdit[i],xpath+"|"+value.toString());
          await element.clear();
          await element.fill(value.toString());
         
        }

        // console.log(noOfLineItems+" ==== "+l);
        if(noOfLineItems !== l){
          await page.locator("//button[@aria-label='Next page']").click();
        }
        await page.waitForTimeout(10000);

   }
  //  console.log(editedLineItemsMap);

   await page.getByRole('button', { name: 'Save' }).click();
   await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();
   await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 

   //Validate edited line items
   await page.locator("//div[@tab-value='line_items']").click();
   if(await page.locator("//strong[normalize-space()='Table View of Line Items']").isVisible()){
    //Shift to form view
    await page.getByRole('button', { name: '' }).click();
    }
 
   for (let l = 1; l <= noOfLineItems; l++) {
    console.log("Validating edited line items "+l);
    takeScreenShot(page,'After Edit Line Items'+l,'lineItems'+l);

    for (let l = 1; l <= noOfLineItems; l++) {
      for (let i = 0; i < LineItemsFieldsForEdit.length; i++) {
        let xpath = editedLineItemsMap.get("LineItem_"+l+"_"+LineItemsFieldsForEdit[i]).split("|")[0];
        let expectedValue = editedLineItemsMap.get("LineItem_"+l+"_"+LineItemsFieldsForEdit[i]).split("|")[1];
        // console.log(xpath+" --- "+expectedValue);
        
        let actualValue = await page.locator(xpath).inputValue();
        console.log("actualValue = "+actualValue);
      console.log("expectedValue = "+expectedValue);
        if(actualValue != null){
          expect(actualValue.trim()).toBe(expectedValue);
        }else{
          expect(null).toBe(expectedValue);
        }
      }
  
     }
 
     if(noOfLineItems !== l){
    await page.locator("//button[@aria-label='Next page']").click();
  }
  await page.waitForTimeout(10000);
   }


});


test.only('23. Add new company specific line item adding value into all coloums and validating after saving in table view', async({ page })=>{
  const fileName = testData.get('23').get('FilesToUpload');
  const folderName = testData.get('23').get('FolderName');
  
 
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'All' }).click();
  await page.waitForTimeout(10000);

  //Get company specific selected line items from API
  const LineItemsFieldsForAdd = [];
  const data = await fetchInvoices();
  data.folder_data.invoice_line_item_fields.forEach((field, index) => {
    // console.log(`Field ${index + 1}:`, field);
    const { name, visible } = field;
    
    if (visible) {
      LineItemsFieldsForAdd.push(name); // or push the whole field if needed
    }
  });
  console.log(LineItemsFieldsForAdd);

  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
  await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  // noOfLineItems = 1;
  console.log("noOfLineItems = "+noOfLineItems);
  if(await page.getByRole('button', { name: 'Table View' }).isVisible()){
    //Shift to table view
    await page.getByRole('button', { name: 'Table View' }).click();
  }

  const lineitemsrows = await page.locator('div[ref="eCenterContainer"] div[role="row"]');
  let totalRows = await lineitemsrows.count();
  console.log("totalRows = "+totalRows);
  let extraRow = await Number(noOfLineItems) + 2;
  console.log("extraRow = "+extraRow);
  takeScreenShot(page,'Before add line item','beforeaddlineItems');
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Add Line Item' }).click();

   // Add new line item adding value into all coloums ans validating after saving
   const LineItemsToAdd = 1;
   var editedLineItemsMap = new Map();
   for (let l = 1; l <= LineItemsToAdd; l++) {
    let colindex = 2;
    for (let i = 0; i < LineItemsFieldsForAdd.length; i++) {
      let xpath = "div[ref='eCenterContainer'] div[aria-rowindex='"+extraRow+"'] div[aria-colindex='"+colindex+"']";
      const element = page.locator(xpath);
      let dataType = "number";
          if(LineItemsFieldsForAdd[i].includes('Description')){
            dataType = "string";
          }
          let value = await getRandomValuesAsPerDataType(dataType);
      console.log("Value ===== "+value);
      editedLineItemsMap.set("LineItem_"+l+"_"+LineItemsFieldsForAdd[i],xpath+"|"+value.toString());
      await element.click();
      await page.keyboard.type(value.toString());  
      await page.keyboard.press('Enter');
      colindex++;

      
    }
    extraRow++;
    if(LineItemsToAdd !== l){
      await page.getByRole('button', { name: 'Add Line Item' }).click();
    }
  }
 
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();

  await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 
   await page.locator("//div[@tab-value='line_items']").click();
   await page.waitForTimeout(10000);
   if(await page.getByRole('button', { name: 'Table View' }).isVisible()){
    //Shift to table view
    await page.getByRole('button', { name: 'Table View' }).click();
  }

   for (let l = 1; l <= LineItemsToAdd; l++) {
    for (let i = 0; i < LineItemsFieldsForAdd.length; i++) {
      let xpath = editedLineItemsMap.get("LineItem_"+l+"_"+LineItemsFieldsForAdd[i]).split("|")[0];
      let expectedValue = editedLineItemsMap.get("LineItem_"+l+"_"+LineItemsFieldsForAdd[i]).split("|")[1];
      
      const element = page.locator(xpath);
      let actualValue = await element.textContent();
      console.log("actualValue = "+actualValue);
      console.log("expectedValue = "+expectedValue);
      if(actualValue != null){
        expect(actualValue.trim()).toBe(expectedValue);
      }else{
        expect(null).toBe(expectedValue);
      }
    }

   }

    
});

test.only('23.1. Add new company specific line item adding value into all coloums and validating after saving in form view', async({ page })=>{
  const fileName = testData.get('23.1').get('FilesToUpload');
  const folderName = testData.get('23.1').get('FolderName');
  
 
  await page.waitForTimeout(12000);
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill(folderName);
  await page.locator("//strong[normalize-space()='"+folderName+"']").click();
  // let fileToSearch = fileName.replace(".pdf","");
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'All' }).click();
  await page.waitForTimeout(10000);

  //Get company specific selected line items from API
  const LineItemsFieldsForAdd = [];
  const data = await fetchInvoices();
  data.folder_data.invoice_line_item_fields.forEach((field, index) => {
    // console.log(`Field ${index + 1}:`, field);
    const { name, visible } = field;
    
    if (visible) {
      LineItemsFieldsForAdd.push(name); // or push the whole field if needed
    }
  });
  console.log(LineItemsFieldsForAdd);

  await page.getByPlaceholder('Search card').fill(fileName);
  await page.getByPlaceholder('Search card').press('Enter');
  const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  await rows.nth(0).click();
  await page.waitForTimeout(10000);

  await page.locator("//div[@tab-value='line_items']").click();
  let noOfLineItems = await getNoOfItems(page,"//div[@tab-value='line_items']");
  // noOfLineItems = 1;
  console.log("noOfLineItems = "+noOfLineItems);
  if(await page.locator("//strong[normalize-space()='Table View of Line Items']").isVisible()){
    //Shift to form view
    await page.getByRole('button', { name: '' }).click();
  }

  const lineitemsrows = await page.locator('div[ref="eCenterContainer"] div[role="row"]');
  let totalRows = await lineitemsrows.count();
  console.log("totalRows = "+totalRows);
  let extraRow = await Number(noOfLineItems) + 2;
  console.log("extraRow = "+extraRow);
  takeScreenShot(page,'Before add line item','beforeaddlineItems');
  await page.waitForTimeout(10000);
  await page.getByRole('button', { name: 'Add Line Item' }).click();

   // Add new line item adding value into all coloums ans validating after saving
   const LineItemsToAdd = 1;
   var editedLineItemsMap = new Map();
   for (let l = 1; l <= LineItemsToAdd; l++) {
    let colindex = 2;
    for (let i = 0; i < LineItemsFieldsForAdd.length; i++) {
      let xpath = 'input[column_name="'+LineItemsFieldsForAdd[i]+'"]';
      const element = page.locator(xpath);
      let dataType = "number";
      if(LineItemsFieldsForAdd[i].includes('Description')){
        dataType = "string";
      }
      let value = await getRandomValuesAsPerDataType(dataType);
      console.log("Value ===== "+value);
      editedLineItemsMap.set("LineItem_"+l+"_"+LineItemsFieldsForAdd[i],xpath+"|"+value.toString());
      await element.click();
      await page.keyboard.type(value.toString());  
      await page.keyboard.press('Enter');
      colindex++;

      
    }
    extraRow++;
    if(LineItemsToAdd !== l){
      await page.getByRole('button', { name: 'Add Line Item' }).click();
    }
  }
 
  await page.getByRole('button', { name: 'Save' }).click();
  await page.getByRole('button', { name: 'SAVE ANYWAYS' }).click();

  await page.locator('.buttons').click();
   await page.waitForTimeout(1000);
   await page.getByPlaceholder('Search card').fill(fileName);
   await page.getByPlaceholder('Search card').press('Enter');
   const rows1 = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
   await rows1.nth(0).click();
   await page.waitForTimeout(10000);
 
   await page.locator("//div[@tab-value='line_items']").click();
   await page.waitForTimeout(10000);
   if(await page.locator("//strong[normalize-space()='Table View of Line Items']").isVisible()){
    //Shift to form view
    await page.getByRole('button', { name: '' }).click();
  }

   for (let l = 1; l <= LineItemsToAdd; l++) {
    for (let i = 0; i < LineItemsFieldsForAdd.length; i++) {
      let xpath = editedLineItemsMap.get("LineItem_"+l+"_"+LineItemsFieldsForAdd[i]).split("|")[0];
      let expectedValue = editedLineItemsMap.get("LineItem_"+l+"_"+LineItemsFieldsForAdd[i]).split("|")[1];
     
      let actualValue = await page.locator(xpath).inputValue();
      console.log("actualValue = "+actualValue);
      console.log("expectedValue = "+expectedValue);
      if(actualValue != null){
        expect(actualValue.trim()).toBe(expectedValue);
      }else{
        expect(null).toBe(expectedValue);
      }
    }

   }

    
});