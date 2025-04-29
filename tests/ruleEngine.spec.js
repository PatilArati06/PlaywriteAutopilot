// @ts-nocheck

const { test, expect, request } = require('@playwright/test');
const { login,fetchRules,getGridColumnTextsByindex, checkDateInRange, getMonthInMmmFormat, waitForElementToVisible, getFullMonthName, createMapOfMap,createArrayOfMap, uploadInvoice, waitForAnalyzedSatatus, verifyAnalyzedSatatus , readPDF,getInvoiceNo, getInvoiceDate, getPaymentDueDate, getSubtotal, getTax, getTotalAmount, getformattedDate, getDescription, getPDFValWith1Regx, getNoOfItems, takeScreenShot, deleteAttachments,getRandomValue,getRandomValuesAsPerDataType,fetchInvoices,fetchInvoiceLineItemFields,fetchWorkflowByInvoiceId,getWorkflowDefination} = require('./Methods/common');
const {RuleEngineDataParser} = require('./Methods/csv_data_parser');
const { error } = require('console');

test.beforeEach(async ({page}) => {
  await login(page, 'dev');
});


  test('T1. Add new rules', async({ page })=>{
    const data= await RuleEngineDataParser('./mock-data/ruleEngineMockData.csv', 'T1');
 
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
    const toggleValue = data.conditionType.toLowerCase(); // e.g., 'all' or 'any'
    if (toggleValue === 'all') {
      // Click the "ALL" button (value="AND")
      await page.locator('button[value="AND"]').click();
    } else {
      // Click the "ANY" button (value="OR")
      await page.locator('button[value="OR"]').click();
    }

    // started condition setup
      let totalConditions = data.conditions.length;
      let inputIndex = 0;
      let valueIndex = 0;
    for (let i = 0; i < totalConditions; i++) {
      const condition = data.conditions[i];
     
    // If not the first condition, click on the 'Add Condition' button
    if (i > 0) {
      await page.click('button:has-text("Add condition")');
    }
    await page.locator('label:has-text("DATA") + input').nth(i).click();
    await page.locator('label:has-text("DATA") + input').nth(i).fill(condition.dataSource);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text=' + condition.dataSource).first().click();
    await page.waitForTimeout(1000);
    
  
    await page.locator('label:has-text("Field") + input').nth(inputIndex).click();
    await page.locator('label:has-text("Field") + input').nth(inputIndex).fill(condition.field1);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text=' + condition.field1).first().click();;
    await page.waitForTimeout(1000);
    inputIndex++;
   
    await page.locator('label:has-text("OPERATOR") + input').nth(i).click();
    await page.locator('label:has-text("OPERATOR") + input').nth(i).fill(condition.operator);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text=' + condition.operator).first().click();
    await page.waitForTimeout(1000);
 

    const inputDate = page.locator('label:has-text("Date Options") + input');

    if (await inputDate.isVisible()) {
        await page.locator('label:has-text("Date Options") + input').nth(i).click();
        await page.locator('label:has-text("Date Options") + input').nth(i).fill(condition.dateOption);
        await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
        await page.locator('div[role="listbox"]:visible >> text='+condition.dateOption).first().click();
        await page.waitForTimeout(1000);
    }

    await page.locator('label:has-text("COMPARE WITH") + input').nth(i).click();
    await page.locator('label:has-text("COMPARE WITH") + input').nth(i).fill(condition.compareWith);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+ condition.compareWith).first().click();
    await page.waitForTimeout(1000);


    const inputObject = page.locator('label:has-text("Object") + input');

if (await inputObject.isVisible()) {
    await page.locator('label:has-text("Object") + input').nth(i).click();
    await page.locator('label:has-text("Object") + input').nth(i).fill(condition.object);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+condition.object).first().click();
    await page.waitForTimeout(1000);
}
    

    
    if (condition.compareWith==='User Entry') {
      await page.locator('input[placeholder="Value"]').nth(valueIndex).fill(condition.value1);
      valueIndex++;
      await page.waitForTimeout(1000);
    }else{
      await page.locator('label:has-text("Field") + input').nth(inputIndex).click();
      await page.locator('label:has-text("Field") + input').nth(inputIndex).fill(condition.field2);
      await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
      await page.locator('div[role="listbox"]:visible >> text='+condition.field2).first().click();
      await page.waitForTimeout(1000);
      inputIndex++;
    }
  
  } //end condtion setup
    // started assign setup
      let totalAssignments = data.assignments.length;
    for (let i = 0; i < totalAssignments; i++) {
      const assignment = data.assignments[i];

    // If not the first condition, click on the 'Add Condition' button
    if (i > 0) {
      await page.click('button:has-text("Assign more")');
    }
    if(data.ruleType!='Business Exception')
    {
    await page.locator('label:has-text("DESTINATION") + input').nth(i).click();
    await page.locator('label:has-text("DESTINATION") + input').nth(i).fill(assignment.destination);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+assignment.destination).first().click();
    await page.waitForTimeout(1000);
    }
    await page.locator('label:has-text("TARGET") + input').nth(i).click();
    await page.locator('label:has-text("TARGET") + input').nth(i).fill(assignment.target);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+assignment.target).first().click();
    await page.waitForTimeout(1000);
    

    if(data.ruleType!='Business Exception')
      {
    await page.locator('label:has-text("ASSIGN VALUE") + input').nth(i).click();
    await page.locator('label:has-text("ASSIGN VALUE") + input').nth(i).fill(assignment.assignValue);
    await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
    await page.locator('div[role="listbox"]:visible >> text='+assignment.assignValue).first().click();
    await page.waitForTimeout(1000);
      

    if(assignment.assignValue=='User Entry')
    {
    await page.locator('input[placeholder="Value"]').nth(valueIndex).fill(assignment.value);
    valueIndex++;
    }else{
      await page.locator('label:has-text("Field") + input').nth(inputIndex).click();
      await page.locator('label:has-text("Field") + input').nth(inputIndex).fill(assignment.field);
      await page.locator('div[role="listbox"]:visible').first().waitFor({ state: 'visible' });
      await page.locator('div[role="listbox"]:visible >> text='+assignment.field).first().click();
      inputIndex++;
      await page.waitForTimeout(1000);
    }
  }else
  {
    await page.locator('input[placeholder="Message"]').nth(i).fill(assignment.message);
  }
  }// end assign
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

  test('T2. Edit existing rule', async({ page })=>{
    const data = await RuleEngineDataParser('./mock-data/ruleEngineMockData.csv', 'T2');
 
    await page.getByText('Briq Tools', { exact: true }).click();
    await page.getByRole('link', { name: 'Autopilot Config' }).click();
    await page.waitForTimeout(400);
    await page.locator('div[role="tab"]:has-text("Rules engine")').click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Rules Engine Settings' }).click();
    await page.waitForTimeout(400);

     await page.locator('input[placeholder="Search"]').fill(data.ruleName);
     await page.waitForTimeout(3000);
     const ruleRow = page.locator('table tbody tr', { hasText: data.ruleName});
     await ruleRow.hover(); // This makes the edit button visible
     await ruleRow.locator('button .mdi-pencil-outline').click();
     await page.waitForTimeout(1000);

    
    const input = page.getByPlaceholder('Enter name');
    const value = await page.getByPlaceholder('Enter name').inputValue();
    const editedName = value+' Edited';
    await input.fill(editedName);
    await input.press('Enter');
    
    await page.locator('label:has-text("RULE TYPE") + input').click();
    await page.locator(`div[role="option"]:has-text("${data.ruleType}")`).click();
    await page.waitForTimeout(1000);

        const toggleValue = 'any'; // e.g., 'all' or 'any'
        if (toggleValue === 'all') {
          // Click the "All" button (value="AND")
          await page.locator('button[value="AND"]').click();
        } else {
          // Click the "ANY" button (value="OR")
          await page.locator('button[value="OR"]').click();
        }
        await page.waitForTimeout(1000);
    
        if(data.ruleType=='Business Exception')
        {
          await page.locator('input[placeholder="Message"]').first().fill("New Exception");
        }


    await page.locator('button.dialog-v2-save-btn.workflows-modal-save-btn.ml-4').click();
    await page.waitForTimeout(5000);
    await page.locator('button.dialog-v2-close-btn').click();
    const popup = page.locator('div.v-dialog.v-dialog--active', { hasText: 'Unsaved changes' });

    if (await popup.isVisible()) {
      await popup.locator('button:has-text("Save")').click();
    }
    
    
    await page.waitForTimeout(10000);
    await page.locator('input[placeholder="Search"]').fill(editedName);
    await page.waitForTimeout(3000);
    const editedRow = page.locator('table tbody tr', { hasText: editedName});
    await editedRow.hover(); // This makes the edit button visible
    await editedRow.locator('button .mdi-pencil-outline').click();
    await page.waitForTimeout(1000);
    const nameAfterEdit = await page.getByPlaceholder('Enter name').inputValue();
    expect(nameAfterEdit).toMatch(editedName);
    const msgAfterEdit = await page.getByPlaceholder('Message').first().inputValue();
    expect(msgAfterEdit).toMatch('New Exception');
   
    await page.waitForTimeout(10000);
  });


  test('T3. Delete existing rule entry', async({ page })=>{
    const data = await RuleEngineDataParser('./mock-data/ruleEngineMockData.csv', 'T3');
 
    await page.getByText('Briq Tools', { exact: true }).click();
    await page.getByRole('link', { name: 'Autopilot Config' }).click();
    await page.waitForTimeout(400);
    await page.locator('div[role="tab"]:has-text("Rules engine")').click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Rules Engine Settings' }).click();
    await page.waitForTimeout(400);

     await page.locator('input[placeholder="Search"]').fill(data.ruleName);
     await page.waitForTimeout(3000);
     const row = page.locator('table tbody tr').filter({ hasText: data.ruleName }).first();
     await row.hover();
     await row.locator('i.mdi-delete-outline').click();
     await page.waitForTimeout(1000);

    const popup = page.locator('div.v-dialog.v-dialog--active', { hasText: 'Delete Rule' });

    if (await popup.isVisible()) {
      await popup.locator('button:has-text("DELETE")').click();
    }
    
    await page.waitForTimeout(10000);
    await page.locator('input[placeholder="Search"]').fill(data.ruleName);
    await page.waitForTimeout(3000);
    const editedRow = page.locator(`table tbody tr:has-text("${data.ruleName}")`);
    expect(await editedRow.count()).toBe(0);
  
    await page.waitForTimeout(1000);
  }); 

  test.only('T4. Disable/Enable existing rule entry', async({ page })=>{
    const data = await RuleEngineDataParser('./mock-data/ruleEngineMockData.csv', 'T4');
 
    await page.getByText('Briq Tools', { exact: true }).click();
    await page.getByRole('link', { name: 'Autopilot Config' }).click();
    await page.waitForTimeout(400);
    await page.locator('div[role="tab"]:has-text("Rules engine")').click();
    await page.waitForTimeout(400);
    await page.getByRole('button', { name: 'Rules Engine Settings' }).click();
    await page.waitForTimeout(400);

     await page.locator('input[placeholder="Search"]').fill(data.ruleName);
     await page.waitForTimeout(3000);
     const row = page.locator('table tbody tr').filter({ hasText: data.ruleName }).first();
     await row.hover();
     const switchToggle = row.locator('input[role="switch"][type="checkbox"]');
      const isChecked = await switchToggle.getAttribute('aria-checked');

      if (isChecked === 'true') {
        console.log('Switch is active. Disabling it...');
        await switchToggle.waitFor({ state: 'visible' });
        await switchToggle.click({ force: true });
        await page.waitForTimeout(1000);
        const popup = page.locator('div.v-dialog.v-dialog--active', { hasText: 'Disable Rule' });

    if (await popup.isVisible()) {
      await page.waitForTimeout(1000);
      await popup.locator('button:has-text("Disable Rule")').click();
    }
      } else {
        console.log('Switch is inactive. Enabling it...');
        await switchToggle.waitFor({ state: 'visible' });
        await switchToggle.click({ force: true });
        await page.waitForTimeout(1000);
        const popup = page.locator('div.v-dialog.v-dialog--active', { hasText: 'Enable Rule' });

    if (await popup.isVisible()) {
      await page.waitForTimeout(1000);
      await popup.locator('button:has-text("Enable Rule")').click();
    }
      }
    
    await page.waitForTimeout(10000);
    await page.locator('input[placeholder="Search"]').fill(data.ruleName);
    await page.waitForTimeout(3000);
    const rows = page.locator('table tbody tr').filter({ hasText: data.ruleName }).first();
    await rows.hover();
    const switchToggle1 = rows.locator('input[role="switch"][type="checkbox"]');
    const isChecked1 = await switchToggle1.getAttribute('aria-checked');
    expect(isChecked1).not.toBe(isChecked);
  
    await page.waitForTimeout(1000);
  }); 