// @ts-check
import fs from "fs";
import { test, expect } from "@playwright/test";
// const { login } = require("../../Us/eful-folder/loginhelper"); //t

// const { login } = require('./Methods/common');

// Increase the timeout for the entire test
test.setTimeout(450_000); // Set timeout to 120 seconds

// Increase the timeout for the beforeEach hook
// test.beforeEach(async ({ page }) => {
//     console.log('Starting login process...');
//     await login(page, 'BriqDevCsv', 2); // Login before each test
//     console.log('Login process completed.');
// });

test("Add values in fields present in allocation tap", async ({ page }) => {
  // Add your test steps here
  /*await page.goto('https://app-dev.briq.com/#/home');
    const title = await page.title();
    expect(title).toBe('Home'); // Replace 'Expected Title' with the actual title*/

  //   await page.goto('https://app-dev.briq.com/#/home');
  //login
  console.log("Starting Scenario 1: Login and navigate to allocation tab...");

  await page.goto("https://app-dev.briq.com/#/pages/login");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill("qaautomation.briq@gmail.com");
  await page.getByPlaceholder("Password").click();
  await page.getByLabel("Password").fill("qaautomation");
  await page.getByRole("button", { name: "SIGN IN", exact: true }).click();
  await page.goto("https://app-dev.briq.com/#/hom/home");
  await page.goto("https://app-dev.briq.com/#/home");
  await page.goto(
    "https://app-dev.briq.com/#/spend-management/invoices-inbox-v2"
  );
  await page.locator("div:nth-child(3) > div:nth-child(10)").click();
  await page.locator(".v-input--selection-controls__ripple").click();
  await page.getByRole("button", { name: "Admin" }).click();

  //invoice allocation setting
  console.log("Navigating to invoice allocation setting...");
  await page.getByRole("link", { name: "Invoice Settings" }).click();
  await page
    .locator(
      ".v-radio > .v-input--selection-controls__input > .v-input--selection-controls__ripple"
    )
    .first()
    .click();
  await page
    .locator(".mr-8 > .v-image > .v-responsive__content")
    .first()
    .click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "Save Changes" }).click();

  //invoice folder
  console.log("Navigating to invoice folder...");
  await page.getByRole("button", { name: "Invoices", exact: true }).click();
  await page.getByRole("link", { name: "Invoices" }).click();
  await page.getByRole("button", { name: "Save" }).nth(1).click();
  //await page.getByLabel('Search card').click();
  await page.locator("#input-425").click();
  //await page.locator('#input-631').fill('Automation Testing By playwright2.0');
  await page.locator("#input-425").fill("Automation Testing By playwright2.0");
  await page
    .locator("div")
    .filter({ hasText: /^Automation Testing By playwright2\.0$/ })
    .nth(1)
    .click();
  await page.goto(
    "https://app-dev.briq.com/#/spend-management/folders-v2/65806f42-4115-44ae-9c01-066cd82d8dbe_v2"
  );
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  await page.goto(
    "https://app-dev.briq.com/#/spend-management/folders-v2/65806f42-4115-44ae-9c01-066cd82d8dbe_v2/invoices/8dc23d6e-517f-4fbe-98b5-23845006d9d4"
  );

  //opening Allocation tab and updating values
  console.log("Opening Allocation tab and updating values...");
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.getByLabel("Company ID").click();
  await page.getByRole("button", { name: "Load More" }).click();
  await page.getByText("Acord - Acord").click();
  await page.waitForTimeout(12000);
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "SAVE ANYWAYS" }).click();
  await page.waitForTimeout(10000);
  await page.locator(".buttons").click();

  //reopen invoice and validate saved values
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.waitForTimeout(10000);
  const inputValue1 = await page.getByLabel("Company ID").inputValue();
  expect(inputValue1).toBe("Acord - Acord");

  //});
  //test('2.Update values in allocation tab and close without saving',async({ page})=>{
  console.log(
    "Scenario 2: Update values in allocation tab and close without saving..."
  );
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.getByLabel("Project ID").click();
  await page
    .getByText("tfbas323ffdggkasdas950500 - newr43hhhhhruuusdasre")
    .click();
  await page.getByLabel("Friendly Cost Code*").click();
  await page.getByRole("cell", { name: "Badge" }).locator("i").click();
  await page.locator(".buttons").click();

  //reopen invoice and validate saved values
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  const inputValue2 = await page.getByLabel("Project ID").inputValue();
  expect(inputValue2).not.toBe(
    "tfbas323ffdggkasdas950500 - newr43hhhhhruuusdasre"
  );

  //});

  //test('3.Update values in allocation tab and save',async({ page})=>{
  console.log("Scenario 3: Update values in allocation tab and save...");
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.getByLabel("Project ID").click();
  await page
    .getByText("tfbas323ffdggkasdas950500 - newr43hhhhhruuusdasre")
    .click();
  await page.getByLabel("Friendly Cost Code*").click();
  await page.getByRole("cell", { name: "Badge" }).locator("i").click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "SAVE ANYWAYS" }).click();
  await page.locator(".buttons").click();

  //reopen invoice and validate saved values
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  const inputValue3 = await page.getByLabel("Project ID").inputValue();
  expect(inputValue3).toBe("tfbas323ffdggkasdas950500 - newr43hhhhhruuusdasre");

  //test('4.Remving value in allocation tab and save',async({ page})=>{
  console.log("Scenario 4: Removing value in allocation tab and save...");
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  await page.getByLabel("Project ID").click();
  await page.getByLabel("Project ID").fill("");
  //await page.getByLabel('Project ID').press('Control+A');
  //await page.getByLabel('Project ID').press('Backspace');
  await page.getByLabel("Friendly Cost Code*").click();
  await page.getByRole("cell", { name: "Badge" }).locator("i").click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "SAVE ANYWAYS" }).click();
  await page.locator(".buttons").click();

  //reopen invoice and validate saved values
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  await page.getByRole("tab", { name: "Allocations" }).click();
  const inputValue = await page.getByLabel("Project ID").inputValue();
  expect(inputValue).toBe("");
});

test("Validating allocation rows", async ({ page }) => {
  //login
  await page.goto("https://app-dev.briq.com/#/pages/login");
  await page.getByLabel("Email").click();
  await page.getByLabel("Email").fill("qaautomation.briq@gmail.com");
  await page.getByPlaceholder("Password").click();
  await page.getByLabel("Password").fill("qaautomation");
  await page.getByRole("button", { name: "SIGN IN", exact: true }).click();
  await page.goto("https://app-dev.briq.com/#/hom/home");
  await page.goto("https://app-dev.briq.com/#/home");
  await page.goto(
    "https://app-dev.briq.com/#/spend-management/invoices-inbox-v2"
  );
//   await page.locator("div:nth-child(3) > div:nth-child(10)").click();
  //await page.locator(".v-input--selection-controls__ripple").click();
//   await page.getByRole("button", { name: "Admin" }).click();

  //invoice folder
  await page.getByRole("button", { name: "Invoices", exact: true }).click();
  await page.getByRole("link", { name: "Invoices" }).click();
  //await page.getByLabel('Search card').click();
  await page.getByLabel("Search card").click();
  //await page.locator('#input-631').fill('Automation Testing By playwright2.0');
  await page.locator('#input-242').fill("Automation Testing By playwright2.0");
  await page
    .locator("div")
    .filter({ hasText: /^Automation Testing By playwright2\.0$/ })
    .nth(1)
    .click();
  await page.goto(
    "https://app-dev.briq.com/#/spend-management/folders-v2/65806f42-4115-44ae-9c01-066cd82d8dbe_v2"
  );
  await page.getByText("Red wing test DV_split_4.pdf").first().click();
  
  await page.goto(
    "https://app-dev.briq.com/#/spend-management/folders-v2/65806f42-4115-44ae-9c01-066cd82d8dbe_v2/invoices/8dc23d6e-517f-4fbe-98b5-23845006d9d4"
  );

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
  //await page.locator("#input-1272").click();
  //await page.getByText("General Overhead").click();
  await lastRow.locator("1_Type__standard").click(); 
  await page.getByText("General Overhead").click();
  await page.getByRole("button", { name: "Clear Values" }).click();
  await page.getByRole("button", { name: "Save" }).click();
  await page.getByRole("button", { name: "SAVE ANYWAYS" }).click();
  await page.locator(".buttons").click();

  //Validating if Delete row button is available
  const isDeleteButtonVisible = await page
    .getByRole("row", { name: "Badge Amount $" })
    .getByRole("button")
    .isVisible();
  expect(isDeleteButtonVisible).toBe(true);
  console.log("Delete button is visible");

  //Canceling the delete row action
  await page
    .getByRole("row", { name: "Badge Amount $" })
    .getByRole("button")
    .nth(1)
    .click();
  await page.getByRole("button", { name: "Cancel" }).click();

  // Click the delete button in the last row
  await lastRow.getByRole("button", { name: "Delete" }).click();

  // Confirm the delete action
  await page.getByRole("button", { name: "Confirm" }).click();
  console.log("Last row deleted successfully.");
});
