// @ts-check

const { test, expect, request } = require('@playwright/test');
// const { chromium } = require('playwright');
const { login,fetchRules,getGridColumnTextsByindex, checkDateInRange, getMonthInMmmFormat, waitForElementToVisible, getFullMonthName, createMapOfMap,createArrayOfMap, uploadInvoice, waitForAnalyzedSatatus, verifyAnalyzedSatatus , readPDF,getInvoiceNo, getInvoiceDate, getPaymentDueDate, getSubtotal, getTax, getTotalAmount, getformattedDate, getDescription, getPDFValWith1Regx, getNoOfItems, takeScreenShot, deleteAttachments,getRandomValue,getRandomValuesAsPerDataType,fetchInvoices,fetchInvoiceLineItemFields,fetchWorkflowByInvoiceId,getWorkflowDefination} = require('./Methods/common');
const { error } = require('console');

// let browser,page;
// var testData = new Map();

// (async () => {
//  testData = await createMapOfMap('testData.csv', 'TCID');
  
// })();

var AlllineItemsFields = [];
test.beforeEach(async ({page}) => {
  await login(page, 'dev');
  (async () => {
    AlllineItemsFields = await createArrayOfMap('Handshake_Construction_lineItemsFields.csv');
    
  })();
  
});



  test('4. verify workflow transition', async({ page })=>{
    const fileName = 'PDF Invoice Example.pdf';
    const folderName = 'Spend 2.0';
    
   
    await page.waitForTimeout(12000);
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
   await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill(fileName);
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    console.log("getting url data");
    const url = await page.url();

    // Use regex to extract the invoice ID
    const invoiceIdMatch = url.match(/invoices\/([a-f0-9-]+)/i);
    
    if (invoiceIdMatch && invoiceIdMatch[1]) {
      const invoiceId = invoiceIdMatch[1];
      console.log("Invoice ID:", invoiceId);
      const data = await fetchWorkflowByInvoiceId(invoiceId);
      // ✅ Get transition data from the first task
      const task = data.tasks[0];

      const transitions = task?.step?.transitions;
      const status = task?.status;

      console.log("Workflow Status before:", status);
      console.log("Transitions:", transitions);
      if (transitions && transitions.length > 0) {
        const transitionLabel = transitions[0];
        await page.getByRole('button', { name: transitionLabel }).click();
        await page.waitForTimeout(10000);
        const approveButton = page.getByRole('button', { name: 'Approve' });

        if (await approveButton.isVisible()) {
          console.log("Dialog is open. Clicking 'Approve'.");
          await approveButton.click();
        } else {
          console.log("Dialog not visible. Skipping 'Approve' click.");
        }
        await page.waitForTimeout(10000);
        const data1 = await fetchWorkflowByInvoiceId(invoiceId);
        const task1 = data1.tasks[0];
        const status1 = task1?.status;
        console.log("Workflow Status after:", status1);
        if(status!=status1)
        {
          console.log("workflow update sucessfully");
        }else{
          console.log("failed to update workflow");
        }

      } else {
        console.log("No transitions available. Button click skipped.");
      }
      
      
    } else {
      console.log("Invoice ID not found in URL");
    }
    await page.waitForTimeout(10000);
  });
  async function getFirstWorkflowStepName(workflowId)
{
  const data =  await getWorkflowDefination(workflowId); // Replace this with your actual parsed JSON

  const configList = data.workflow.tasks[0].parallel[0].config;
  
  // 1. Find config with name === "START"
  const startConfig = configList.find(cfg => cfg.name.toLowerCase() === "start");
  
  if (startConfig) {
    const nextId = startConfig.transitions?.[0]?.routes?.next;
  
    if (nextId) {
      // 2. Get the name of the config where id === nextId
      const nextStep = configList.find(cfg => cfg.id === nextId);
      if (nextStep) {
        console.log(`Next step name: ${nextStep.name}`);
        return nextStep.name;
      } else {
        console.log(`❌ No step found with ID ${nextId}`);
      }
    } else {
      console.log(`❌ No transition found in START config`);
    }
  } else {
    console.log(`❌ No START config found`);
  }
  return null;
}
  test('5. verify reanalyze button (Reanalyze without impacting workflow)', async({ page })=>{
    const fileName = 'PDF Invoice Example.pdf';
    const folderName = 'Spend 2.0';
    
   
    await page.waitForTimeout(12000);
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
   await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill(fileName);
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    
    await page.locator('button:has(path[d*="M13.6952 13H13.1619"])').click();
   
    await page.waitForTimeout(1000);
    const approveButton = page.getByRole('button', { name: 'Reanalyze' });

        if (await approveButton.isVisible()) {
          console.log("Dialog is open. Clicking 'Reanalyze'.");
          await approveButton.click();
        } else {
          console.log("Dialog not visible. Skipping 'Reanalyze' click.");
        }
        await page.waitForTimeout(10000);
        await expect(
          page.locator('div[role="row"]', { hasText: fileName }).locator('span:text("Processing")')
        ).toBeVisible();
        await page.waitForTimeout(10000);
        console.log("Successfully 'Reanalyze'.");
  });
  test('5.1. verify reanalyze button (Reanalyze & reset workflow)', async({ page })=>{
    const fileName = 'Construction Invoice_Table 2 NEW.pdf';
    const folderName = 'Spend 2.0';
    
   
    await page.waitForTimeout(12000);
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
   await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill(fileName);
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    // const url = await page.url();

    // // Use regex to extract the invoice ID
    // const invoiceIdMatch = url.match(/invoices\/([a-f0-9-]+)/i);
    // var workflowId ='';
    // if (invoiceIdMatch && invoiceIdMatch[1]) {
    //   const invoiceId = invoiceIdMatch[1];
    //   console.log("Invoice ID:", invoiceId);
    //   const data = await fetchWorkflowByInvoiceId(invoiceId);
    //   workflowId = data.tasks[0].workflow_id;
    // }
    // await page.waitForTimeout(1000);
    await page.locator('button:has(path[d*="M13.6952 13H13.1619"])').click();
   
    await page.waitForTimeout(1000);
    const approveButton = page.getByRole('button', { name: 'Reanalyze' });

        if (await approveButton.isVisible()) {
          console.log("Dialog is open. Clicking Radio button 2nd option.");
          await page.waitForTimeout(1000);
          await page.locator('label:has-text("Reanalyze & reset workflow")').click();
          await page.waitForTimeout(1000);
          await approveButton.click();
        } else {
          console.log("Dialog not visible. Skipping 'Reanalyze' click.");
        }

        await page.waitForTimeout(10000);
        await expect(
          page.locator('div[role="row"]', { hasText: fileName }).locator('span:text("Processing")')
        ).toBeVisible();
    //     await page.waitForTimeout(50000);
    //     await page.getByPlaceholder('Search card').fill(fileName);
    // await page.getByPlaceholder('Search card').press('Enter');
    // await page.waitForTimeout(10000);
    //     const nextStep = await getFirstWorkflowStepName(workflowId);
    //     await page.waitForTimeout(1000);
    //     await expect(
    //       page.locator('div[role="row"]', { hasText: fileName }).getByText(nextStep)
    //     ).toBeVisible();
        console.log("Successfully 'Reanalyze & reset workflow'.");
  });
  function extractFolderUrl(fullUrl) {
    const match = fullUrl.match(/(.*folders-v2\/[^/]+)/);
    return match ? match[1] : fullUrl;
  }
  test('6. verify move invoice button', async({ page })=>{
    const fileName = 'PDF Invoice Example.pdf';
    const folderName = 'Automation Testing By playwright2.0';
    
   
    await page.waitForTimeout(12000);
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
   await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill(fileName);
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    
    await page.locator('button:has(i.mdi-folder-move-outline)').click();
  
    await page.waitForTimeout(1000);
    const popup = page.locator('text=Move Invoices');
    if (await popup.isVisible()) {
      const destinationFolder = "Spend 2.0";
      const input = page.locator('input[placeholder="Select Folder"]');
      await input.click();
      
      // 2. Type folder name to trigger search/filter
      await input.fill(destinationFolder);
      
      // 3. Wait for dropdown with filtered results
      const filteredItem = page.locator('.v-menu__content.menuable__content__active .v-list-item', {
        hasText: destinationFolder,
      });
      await filteredItem.waitFor({ state: 'visible' });
      
      // 4. Click the matching item
      await filteredItem.click();
      await page.waitForTimeout(100);
      const updateButton = page.getByRole('button', { name: 'Update' });
      const originalUrl = extractFolderUrl(page.url());

      console.log("🔗 Original URL:", originalUrl);
      if (await updateButton.isVisible() && !(await updateButton.isDisabled())) {
        await updateButton.click();
      }
      await page.waitForTimeout(10000);
      await page.locator('.buttons').click();
      await page.waitForTimeout(10000);
      const newUrl = page.url();
      console.log("🔗 New URL:", newUrl);

      // 3. Compare URLs
      if (originalUrl !== newUrl) {
        console.log("✅ Invoice was moved. URL has changed.");
      } else {
        console.log("❌ Invoice URL did not change. Move may have failed.");
      }
     
      await page.waitForTimeout(10000);
    } else {
      console.log("❌ Popup is not open");
    }
   
        

  });



  test('6. verify approvers button', async({ page })=>{
    const fileName = 'williams.pdf';
    const folderName = 'Automation Testing By playwright2.0';
    
   
    await page.waitForTimeout(12000);
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
    await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill(fileName);
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    
    await page.locator('button:has(i.mdi-account-check-outline)').click();
  
    await page.waitForTimeout(1000);
    const popup = page.locator('text=Assign Approvers');
    if (await popup.isVisible()) {
      const oldCount = await page.locator('label:has-text("Search users")').count();
      console.log('Dropdowns count before adding:', oldCount);

      await page.click('button:has-text("Approver")');

     // Step 3: Wait for the new dropdown to appear
      await page.waitForTimeout(500); // Wait for DOM to update
      const newCount = await page.locator('label:has-text("Search users")').count();

      if (newCount <= oldCount) {
        throw new Error('No new dropdown was added');
      }

      // Step 1: Find the input field inside the last dropdown
      const allInputs = page.locator('input[type="text"][autocomplete="off"]');
      const lastInput = allInputs.nth(newCount);

      // Step 2: Click the input field to activate the dropdown
      await lastInput.click();

      // Step 3: Type into it
      await lastInput.fill('ganesh.jaybhay@briq.com');

      // Step 3: Wait for the dropdown items to appear (you might need to adjust this selector based on the structure)
      const dropdownItems = page.locator('.v-list-item');

      // Wait for the dropdown list to appear (ensure items are rendered)
      await dropdownItems.first().waitFor({ state: 'visible' });

      // Step 4: Search for the "Ganesh" item in the dropdown list and click it
      await dropdownItems.locator('text=ganesh.jaybhay@briq.com').click();


      await page.waitForTimeout(1000);
      await page.click('button:has-text("Update")');
      await page.waitForTimeout(10000);
      await page.locator('button:has(i.mdi-account-check-outline)').click();
  
      await page.waitForTimeout(1000);
      const popup = page.locator('text=Assign Approvers');
      if (await popup.isVisible()) {
        const afterSaveCount = await page.locator('label:has-text("Search users")').count();
       if(afterSaveCount>oldCount)
       {
        console.log("✅ approver added sucessfully.");
       }else{
        console.log("❌ failed to add approver.");
       }
      }
      await page.waitForTimeout(10000);
    } else {
      console.log("❌ Popup is not open");
    }
  });
  
  test('8. verify Delete invoice button', async({ page })=>{
    const fileName = 'Sliced Invoices.pdf';
    const folderName = 'Automation Testing By playwright2.0';
    
   
    await page.waitForTimeout(12000);
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
    await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill(fileName);
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    
    await page.locator('button:has(.mdi-delete)').first().click();
  
    await page.waitForTimeout(1000);
    const popup = page.locator('text=Are you sure you want to delete this file?').first();
    if (await popup.isVisible()) {
      const url = await page.url();
      await page.click('button:has-text("Yes, delete file")');
      await page.waitForTimeout(10000);
      const newurl = await page.url();
      if(url!=newurl)
      {
      console.log("✅ Invoice deleted.");
      }else{
        console.log("❌ Invoice not deleted! test failed"); 
      }
      expect(url).not.toBe(newurl);
      await page.waitForTimeout(1000);
    } else {
      console.log("❌ Popup is not open");
    }
  });

  test('9. verify downlaod invoice button', async({ page })=>{
    const fileName = 'Sliced Invoices.pdf';
    const folderName = 'Automation Testing By playwright2.0';
    
   
    await page.waitForTimeout(12000);
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
    await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill(fileName);
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    
   // await page.locator('button:has(i.mdi-download)').first().click();
  
    await page.waitForTimeout(1000);
    const [newPage] = await Promise.all([
      page.waitForEvent('popup'), // waits for the new tab
      page.click('button:has(i.mdi-download)'), // click the download button
    ]);
    
    // Ensure the new tab is fully loaded
    await newPage.waitForLoadState('load');
    
    // Get the URL of the new tab
    const newTabUrl = newPage.url();
    console.log('New tab opened with URL:', newTabUrl);
    
    // Check if it is a PDF
    if (newTabUrl.includes('.pdf')) {
      console.log('✅ PDF successfully opened in new tab.');
    } else {
      console.error('❌ Unexpected file type or URL:', newTabUrl);
    }
  });

  test('10. verify invoice split button(switch to manual)', async({ page })=>{
    const fileName = 'ServiceInvoice_0167040 NEW.pdf';
    const folderName = 'Automation Testing By playwright2.0';
    
   
    await page.waitForTimeout(12000);
    await page.getByRole('link', { name: 'Invoices' }).click();
    await page.getByLabel('Search card').fill(folderName);
    await page.locator("//strong[normalize-space()='"+folderName+"']").click();
    // let fileToSearch = fileName.replace(".pdf","");
    await page.waitForTimeout(10000);
    await page.getByRole('button', { name: 'All' }).click();
    await page.waitForTimeout(10000);
  
    //Get company specific selected line items from API

    await page.getByPlaceholder('Search card').fill(fileName);
    await page.getByPlaceholder('Search card').press('Enter');
    await page.waitForTimeout(10000);
    const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
    await rows.nth(0).click();
    await page.waitForTimeout(10000);
    
    await page.click('button:has(div[style*="scissor.0d85a88b.svg"])');
  
    await page.waitForTimeout(1000);
    const popup = page.locator('text=Split invoice').first();
    if (await popup.isVisible()) {
      await page.waitForTimeout(1000);
      console.log('✅ clicking on swtch');
      const label = await page.locator('label:has-text("Manually Split Invoice")').first();
      const switchContainer = label.locator('xpath=ancestor::div[contains(@class, "v-input--switch")]');

// Step 3: Find the thumb inside that switch and click it
const thumb = switchContainer.locator('.v-input--switch__thumb');

// Step 4: Click the thumb to toggle the switch
await thumb.click({ force: true });
const input = switchContainer.locator('input[role="switch"]');
const checked = await input.getAttribute('aria-checked');
console.log(`Switch is now: ${checked === 'true' ? 'ON ✅' : 'OFF ❌'}`);
      await page.waitForTimeout(1000);
      // Get all cutIcon buttons
      const cutButtons = await page.$$('.cutIcon');

      // Flag to check if we clicked any
      let clicked = false;

      for (const btn of cutButtons) {
        if (await btn.isVisible()) {
          await btn.click();
          console.log('✅ Clicked the first visible cut button.');
          clicked = true;
          break;
        }
      }
      await page.waitForTimeout(1000);
      if (clicked) {
        await page.click('button:has-text("Done")');
        await page.waitForTimeout(10000);
      //Split_1_
      const newFileName = 'Split_1_'+fileName;
      await page.locator('.buttons').click();
      await page.waitForTimeout(10000);
      await page.getByRole('button', { name: 'All' }).click();
      await page.waitForTimeout(10000);
    
      //Get company specific selected line items from API
  
      await page.getByPlaceholder('Search card').fill(newFileName);
      await page.getByPlaceholder('Search card').press('Enter');
      await page.waitForTimeout(10000);
      const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
      // Get the count
const rowCount = await rows.count();

if (rowCount > 0) {
  console.log(`✅ Split sucessfully`);
} else {
  console.log('❌ failed to split');
}
expect(rowCount).toBeGreaterThan(0);
      }else{
        console.log('⚠️ No visible cut buttons found.');
      }
    } else {
      console.log("❌ Popup is not open");
    }
  });