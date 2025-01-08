// @ts-check

const { test, expect } = require('@playwright/test');
// const { chromium } = require('playwright');
const { login,getGridColumnTextsByindex, checkDateInRange, getMonthInMmmFormat, waitForElementToVisible, getFullMonthName, createMapOfMap, uploadInvoice, waitForAnalyzedSatatus, verifyAnalyzedSatatus , readPDF } = require('./Methods/common');
const { error } = require('console');

// let browser,page;
var testData = new Map();

(async () => {
  testData = await createMapOfMap('testData.csv', 'TCID');
  
})();

test.beforeEach(async ({page}) => {
 // await page.goto('https://app-dev.briq.com/#/pages/login');
  //await page.waitForTimeout(12000);
  // console.log("in beforeEach..........")
  // browser = await chromium.launch();
  // const context = await browser.newContext();
  // page = await context.newPage(); 
  await login(page, 'dev');
  
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
     
     await test.step('Add Folder button', async () => {
       await page.screenshot({ path: 'screenshots/folderhome.png' });
    });
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
     
     await test.step('Add Folder button', async () => {
       await page.screenshot({ path: 'screenshots/addFolder.png' });
    });
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
   
   await test.step('Create Folder button', async () => {
     await page.screenshot({ path: 'screenshots/createFolder.png' });
  });
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
  await test.step('Folder Created', async () => {
    await page.screenshot({ path: 'screenshots/createFolder1.png' });
 });
    // expect(isTextVisible).toEqual(true);
});

test('4.Verify the search by folder name',async({ page})=>{
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill('Automation Testing By playwright');
  // await page.locator("//input[@type='text']").fill('automation');
  // @ts-ignore
  const element = page.locator("(//div[@class='col-md-5 col-lg-3 col-xl-3 col'])[1]");
  const text = await element.textContent();
  await test.step('folder name', async () => {
    await page.screenshot({ path: 'screenshots/folderName.png' });
 });
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
  await test.step('New folder name for edit', async () => {
    // await page.screenshot({ path: 'screenshots/newfoldername.png' });
    const screenshotPath = 'screenshots/newfoldername.png';
    await page.screenshot({ path: screenshotPath });
    test.info().attach('Create new folder name screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });
 });
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
  await test.step('Take screenshot after editing folder name', async () => {
    // await page.screenshot({ path: 'screenshots/editedfoldername.png' });
    const screenshotPath = 'screenshots/editedfoldername.png';
  await page.screenshot({ path: screenshotPath });
  test.info().attach('Edited folder name screenshot', {
    path: screenshotPath,
    contentType: 'image/png',
  });
 });
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
  await test.step('Folder Deleted', async () => {
    // await page.screenshot({ path: 'screenshots/deletefolder.png' });
    const screenshotPath = 'screenshots/deletefolder.png';
    await page.screenshot({ path: screenshotPath });
    test.info().attach('Folder deleted screenshot', {
      path: screenshotPath,
      contentType: 'image/png',
    });
 });
  // Check if the string is contained
  // expect(text).toContain('');

});

test('6. Click and open the folder ', async ({ page }) => {
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').fill('Automation Testing By playwright');
  await page.locator("//strong[normalize-space()='Automation Testing By playwright']").click();
  let element = page.locator("//strong[normalize-space()='Automation Testing By playwright']");
  let text = await element.textContent();
  await test.step('Take screenshot after open folder', async () => {
    await page.screenshot({ path: 'screenshots/openfoldercheck.png' });
    });
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
    await test.step('All checkboxs checked', async () => {
      // await page.screenshot({ path: 'screenshots/allcheckboxs.png' });
      const screenshotPath = 'screenshots/allcheckboxs.png';
      await page.screenshot({ path: screenshotPath });
      test.info().attach('All CheckBoxes Checked', {
        path: screenshotPath,
        contentType: 'image/png',
      });
   });
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
    await test.step('Single CheckBoxe Checked', async () => {
      // await page.screenshot({ path: 'screenshots/singlecheckbox.png' });
      const screenshotPath = 'screenshots/singlecheckbox.png';
      await page.screenshot({ path: screenshotPath });
      test.info().attach('Single CheckBoxe Checked', {
        path: screenshotPath,
        contentType: 'image/png',
      });
   });
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
    await test.step('Invoices not present in table', async () => {
      const screenshotPath = 'screenshots/nocheckbox.png';
      await page.screenshot({ path: screenshotPath });
      test.info().attach('Invoices not present in table', {
        path: screenshotPath,
        contentType: 'image/png',
      });
   });
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

  await test.step('Tabs Present', async () => {
    const screenshotPath = 'screenshots/tabs1.png';
    await page.screenshot({ path: screenshotPath });
    test.info().attach('Tabs Present', {
      path: screenshotPath,
      contentType: 'image/png',
    });
 });

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
        console.log(`${dateToCheck} is not within the range ${rangeStart} to ${rangeEnd}`);
        throw new Error(`${dateToCheck} is not within the range ${rangeStart} to ${rangeEnd}`);
        // notInRange.push(`${dateToCheck} is not within the range ${rangeStart} to ${rangeEnd} for row ${i + 1}`)

      }
    }
   
  }
});

// 
test('15.Extract Text from PDF', async({ page })=>{
  const expectedText = "Invoice Number303-1-75869";
  readPDF('D:/Briq/PlaywrightAutopilet/FilesToUpload/Red wing test DV.pdf',expectedText);

});