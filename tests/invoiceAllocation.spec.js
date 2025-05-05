// @ts-check
import fs from "fs";
import { test, expect } from "@playwright/test";
const { readCsvSync } = require('./Methods/csv_data_parser');
const { login} = require('./Methods/common');


test.setTimeout(120000); 

let invoiceFolderName;
let invoiceName;
let companyId;
let projectId; // Declare shared variable

test.beforeEach(async ({ page }) => {
  console.log("Starting login process...");
  await login(page, 'dev');
  console.log("Login process completed.");

  const csvData = await readCsvSync(
    "./mock-data/allocationData.csv"
  );
  invoiceFolderName = csvData[0].invoiceFolderName; // Initialize shared variable
  invoiceName = csvData[0].invoiceName;
  companyId = csvData[0].companyId;
  projectId = csvData[0].projectId;
});
test("Validate Invoice allocation setting ", async ({ page }) => {
  //invoice allocation setting
  await page.getByRole("button", { name: "Admin" }).click();
  await page.getByRole("link", { name: "Invoice Settings" }).click();
  const allocationTab = page.locator(
    "//div[@class='d-flex align-top']//div[@class='v-responsive__content']"
  );
  const isVisible = await allocationTab.isVisible();
  if (!isVisible) {
    console.log("Navigating to invoice allocation setting...");
    await page
      .locator(
        "div[class='v-input black--text mb-n6 v-input--is-label-active v-input--is-dirty theme--light v-input--selection-controls v-input--radio-group v-input--radio-group--row'] div[class='v-radio theme--light v-item--active'] div[class='v-input--selection-controls__ripple']"
      )
      .click();
    await page
      .locator(".mr-8 > .v-image > .v-responsive__content")
      .first()
      .click();
  } else {
    console.log("The radio button is checked.");
  }
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();
});


test("Validate dropdown options for type Job", async ({ page }) => {
  //adding new type
  await page.goto("https://app-dev.briq.com/#/ap-config");
  await page.getByRole('button', { name: 'Create New' }).click();
  await page.goto('https://app-dev.briq.com/#/ap-config/invoice-allocation?document=invoice');
  await page.getByLabel('TYPE *').click();
  await page.getByPlaceholder('Type').fill('Testing -Field');
  await page.getByRole('option', { name: 'Testing -Field' }).locator('div').nth(1).click();
  await page.locator('div').filter({ hasText: /^Click to add field$/ }).nth(1).click();
  await page.getByPlaceholder('Search Field').click();
  await page.getByRole('option', { name: 'Project ID' }).locator('i').click();
  await page.getByRole('option', { name: 'Company ID' }).locator('i').click();
  await page.getByText('Field NameProject IDCompany ID').click();
  await page.getByRole('dialog').getByRole('button', { name: 'Save' }).click();
  await page.getByRole("button", { name: "Save", exact: true }).nth(0).click();
  const types = await page.locator("div:has-text('Field Name') + div").allTextContents();
  // Log the extracted types
  console.log("List of Types:", types);
  await page.getByRole('button', { name: 'Invoices', exact: true }).click();
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').click();
  await page.fill('input[type="text"]', invoiceFolderName);
  await page
    .locator("div")
    .filter({ hasText: /^Automation Testing By playwright2\.0$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Approved", exact: true }).click();
  await page.getByText("williams.pdf").click();
  await page.getByRole("tab", { name: "Allocations" }).click();
//   // Open the dropdown
  await page.getByLabel('Type', { exact: true }).click();
//   // Get all options in the dropdown
//  const options = await page.locator("input[type='text']").allTextContents();
  const options = await page.locator("div[role='option']").allTextContents();
 console.log("Options:", options);
 // const expectedOptions = ["General Overhead", "Purchase Order", "test_allocation", "Testing -Field", "Job"];

 expect(options).toEqual(expect.arrayContaining(types));

  console.log("Dropdown contains the expected options:", options);

  // Remove the added type
  await page.goto("https://app-dev.briq.com/#/ap-config");
  await page.locator('#allocations div').filter({ hasText: 'Fields Table for Testing -' }).first().click();
  await page.locator('#allocations').getByRole('button').nth(2).click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Invoices', exact: true }).click();
  await page.getByRole('link', { name: 'Invoices' }).click();
  await page.getByLabel('Search card').click();
  await page.fill('input[type="text"]', invoiceFolderName);
  await page
    .locator("div")
    .filter({ hasText: /^Automation Testing By playwright2\.0$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Approved", exact: true }).click();
  await page.getByText("williams.pdf").click();
  await page.getByRole("tab", { name: "Allocations" }).click();
 // Open the dropdown
  await page.getByLabel('Type', { exact: true }).click();
 // Get all options in the dropdown
 console.log("Options:", options);
 expect(options).toEqual(expect.arrayContaining(expectedOptions));

 console.log("Dropdown contains the expected options:", options);


 });

//invoice folder
test.only("Add values in fields present in allocation tap and validate", async ({
  page,
}) => {
  console.log("Navigating to invoice folder...");
  // await page.getByRole("button", { name: "Invoices", exact: true }).click();
  await page.getByRole("link", { name: "Invoices" }).click();
  await page.fill('input[type="text"]', invoiceFolderName);
  await page
    .locator("div")
    .filter({ hasText: /^Automation Testing By playwright2\.0$/ })
    .nth(1)
    .click();
  await page.getByRole("button", { name: "All", exact: true }).click();
  await page.getByText("williams.pdf").click();
  //await page.goto("https://app-dev.briq.com/#/spend-management/folders-v2/65806f42-4115-44ae-9c01-066cd82d8dbe_v2/invoices/8dc23d6e-517f-4fbe-98b5-23845006d9d4");
  //opening Allocation tab and updating values
  console.log("Opening Allocation tab and adding values...");
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.getByLabel("Company ID").click();
  //await page.getByRole("button", { name: "Load More" }).click();
  await page.getByText(companyId).click();
  //await page.waitForSelector('button#save');
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(6000);
  //await page.getByRole("button", { name: "SAVE ANYWAYS" }).click();
  await page.locator(".buttons").click();

  //reopen invoice and validate saved values
  await page.getByText("williams.pdf").first().click();
  await page.waitForTimeout(6000);
  await page.getByRole("tab", { name: "Allocations" }).click();
  const inputValue1 = await page.getByLabel("Company ID").inputValue();
  expect(inputValue1).toBe(companyId);
});

test("Update values in allocation tab and close without saving and validate", async ({
  page,
}) => {
  console.log(
    "Scenario 2: Update values in allocation tab and close without saving..."
  );
  await page.getByRole("link", { name: "Invoices" }).click();
  await page.fill('input[type="text"]', invoiceFolderName);
  await page
    .locator("div")
    .filter({ hasText: new RegExp(`^${invoiceFolderName}$`) })
    .nth(1)
    .click();
  await page.getByText("williams.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.getByLabel("Project ID").click();
  await page.getByText(projectId).click();
  //await page.getByLabel("Friendly Cost Code*").click();
  //await page.getByRole("cell", { name: "Badge" }).locator("i").click();
  await page.locator(".buttons").click();

  //reopen invoice and validate saved values
  await page.getByText("williams.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  const inputValue2 = await page.getByLabel("Project ID").inputValue();
  expect(inputValue2).not.toBe(projectId);
});

test("3.Update values in allocation tab and save and validate", async ({
  page,
}) => {
  console.log("Scenario 3: Update values in allocation tab and save...");
  await page.getByRole("link", { name: "Invoices" }).click();
  await page.fill('input[type="text"]', invoiceFolderName);
  await page
    .locator("div")
    .filter({ hasText: new RegExp(`^${invoiceFolderName}$`) })
    .nth(1)
    .click();
  await page.getByText("williams.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.getByLabel("Project ID").click();
  await page.getByText(projectId).click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(6000);
  //await page.getByRole("button", { name: "SAVE ANYWAYS" }).click();
  await page.locator(".buttons").click();

  //reopen invoice and validate saved values
  await page.getByText("williams.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  const inputValue3 = await page.getByLabel("Project ID").inputValue();
  expect(inputValue3).toBe(projectId);
});

test("4.Removing value in allocation tab and save and validate", async ({
  page,
}) => {
  console.log("Scenario 4: Removing value in allocation tab and save...");
  await page.getByRole("link", { name: "Invoices" }).click();
  await page.fill('input[type="text"]', invoiceFolderName);
  await page
    .locator("div")
    .filter({ hasText: /^Automation Testing By playwright2\.0$/ })
    .nth(1)
    .click();
  await page.getByText("williams.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.getByLabel("Project ID").click();
  await page.getByLabel("Project ID").fill("");
  //await page.getByLabel('Project ID').press('Control+A');
  //await page.getByLabel('Project ID').press('Backspace');
  // await page.getByLabel("Friendly Cost Code*").click();
  // await page.getByRole("cell", { name: "Badge" }).locator("i").click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.waitForTimeout(6000);
  //await page.getByRole("button", { name: "SAVE ANYWAYS" }).click();
  await page.locator(".buttons").click();

  //reopen invoice and validate saved values
  await page.getByText("williams.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  const inputValue = await page.getByLabel("Project ID").inputValue();
  expect(inputValue).toBe("");
});

test("Validating allocation rows", async ({ page }) => {
  await page.getByRole("button", { name: "Invoices", exact: true }).click();
  await page.getByRole("link", { name: "Invoices" }).click();
  await page.getByLabel("Search card").click();
  await page.fill('input[type="text"]', invoiceFolderName);
  await page
    .locator("div")
    .filter({ hasText: /^Automation Testing By playwright2\.0$/ })
    .nth(1)
    .click();
  await page.getByText("williams.pdf").first().click();
  //opening Allocation tab and updating values
  await page.getByRole("tab", { name: "Allocations" }).click();

  //Validating if Add row button is available
  const isButtonVisible = await page
    .getByRole("button", { name: "Add new row" })
    .isVisible();
  expect(isButtonVisible).toBe(true);
  console.log("Add new row button is visible");
  // Select the last row
  const lastRow = await page.locator("table tr").last();
  //Adding Row
  await page.getByRole("button", { name: "Add new row" }).click();
  await lastRow.getByLabel("Type", { exact: true }).click();
  await page.getByText("General Overhead").click();
  //await page.getByRole("button", { name: "Clear Values" }).click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "SAVE ANYWAYS" }).click();
  await page.locator(".buttons").click();

  //Validating if Delete row button is available
  await page.getByText("williams.pdf").first().click();
  //opening Allocation tab and updating values
  await page.getByRole("tab", { name: "Allocations" }).click();
  await lastRow.locator("#allocation_3").getByRole("button").isVisible();
  console.log("Delete button is visible");

  // //Canceling the delete row action
  // await lastRow
  //   .getByRole("row", { name: "Cost Type Purchase Order ID Div" })
  //   .getByRole("button")
  //   .click();
  // await page.getByRole("button", { name: "Cancel" }).click();

  // // Confirm the delete action
  // await lastRow
  //   .getByRole("row", { name: "Cost Type Purchase Order ID Div" })
  //   .getByRole("button")
  //   .click();
  // await page.getByRole("button", { name: "Confirm" }).click();
  // console.log("Last row deleted successfully.");
});