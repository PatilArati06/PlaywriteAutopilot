import fs from 'fs';
const { test, expect,request } = require('@playwright/test');
// const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');
// const { request } = require('@playwright/test');

module.exports = {

    login: async function(page,env){
        const loginDetails = fs.readFileSync('logindetails.csv',{
            encoding: 'utf-8'
          })
          .split(',');
          let envURL;
          if(env == 'dev'){
            envURL = 'https://app-dev.briq.com/#/pages/login';
          }else if(env == 'stage'){
            envURL = 'https://app-stage.briq.com/#/pages/login';
          }
          // else if(env == 'live'){
          //   envURL = https://app.briq.com/#/home';
          // }
          try {
                  await page.goto(envURL);
                  await page.fill('input#login-page-email-input', loginDetails[0]);  // username
                  await page.fill('input#login-page-password-input', loginDetails[1]); //password
                  await page.click('button.login-button');  //login button selector
                  test.setTimeout(600_000);
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }

    },

    createArrayOfMap: async function(fileName){
        const addbillDetails = fs.readFileSync(fileName,{
            encoding: 'utf-8'
          }).split('\n')
          const addbillHeaders = addbillDetails[0].split(',')
          const addbillArr = [];
          let k=0;
          for(let i=1; i < addbillDetails.length; i++){
            let data = addbillDetails[i];
            data = data.replace(/"([^"]*)"/g, function(match, p1) {
              return p1.replace(/,/g, "<INDATA_QUMA>");
            });
          
            const addbillindArr = data.split(',')
            var myMap = new Map();
          
            for(let j=0; j < addbillindArr.length; j++){
              myMap.set(addbillHeaders[j].replaceAll("\r","").replaceAll("\n","").trim(),addbillindArr[j].replaceAll('<INDATA_QUMA>',',').trim());
            }
            addbillArr[k] = myMap;
            k++;
          }
    
          return addbillArr;
    },

    createMapOfMap: async function(fileName,primaryKey){
      const addbillDetails = fs.readFileSync(fileName,{
          encoding: 'utf-8'
        }).split('\n')
        const addbillHeaders = addbillDetails[0].split(',')
        var outerMap = new Map();
        let k=0;
        for(let i=1; i < addbillDetails.length; i++){
          let data = addbillDetails[i];
          data = data.replace(/"([^"]*)"/g, function(match, p1) {
            return p1.replace(/,/g, "<INDATA_QUMA>");
          });
        
          const addbillindArr = data.split(',')
          var myMap = new Map();
        
          for(let j=0; j < addbillindArr.length; j++){
            myMap.set(addbillHeaders[j].replaceAll("\r","").replaceAll("\n","").trim(),addbillindArr[j].replaceAll('<INDATA_QUMA>',',').trim());
          }
          
          outerMap.set(myMap.get(primaryKey),myMap);
        }
        // console.log("--->>> "+outerMap.get('7A').get('FilesToUpload'));
        return outerMap;
  },

    getTotalTableRows: async function(page,selector){
        const projrows = await page.$$(selector);
        const projtotalRows = projrows.length;
        return projtotalRows;
    },

    getTableCellValue: async function(page,rowNo,colNo,){
      const tableRow = await page.$('tbody tr:nth-child('+rowNo+')');
      const tableCol = await tableRow.$('td:nth-child('+colNo+')');
      const Value = await (await page.evaluate(element => element.innerHTML, tableCol)).trim();
      return Value;
    },

    getGridColumnTextsByindex: async function(page,expecteddColumnIndex,rows){
      // Count total visible rows
 const totalRows = await rows.count();
 console.log(`Total rows found after search: ${totalRows}`);
 
 const columnTexts = [];
 for (let i = 0; i < totalRows; i++) {
  let columnText;

  let isColVisible = await rows.nth(i).locator('//div[@aria-colindex="'+expecteddColumnIndex+'"]').isVisible();
  // console.log("1:"+isColVisible);
  while(!isColVisible){
    
    await page.evaluate(() => {
      const scrollableElement = document.querySelector('.ag-body-horizontal-scroll-viewport'); // Replace with your selector
      scrollableElement.scrollLeft += 200; // Scrolls right by 200px
    });
    isColVisible = await rows.nth(i).locator('//div[@aria-colindex="'+expecteddColumnIndex+'"]').isVisible();
 
  }

  columnText = await rows.nth(i).locator('//div[@aria-colindex="'+expecteddColumnIndex+'"]').textContent();
  
  //div[@ref="eCenterContainer"]//div[@role="row"]//div[@aria-colindex="11"]
  // console.log(`Row ${i + 2}, Column ${columnIndex + 1}: ${columnText}`);
    //  console.log("----> "+columnText);
     columnTexts.push(columnText.trim());
 }
 return columnTexts;
  },
  getformattedDate : async function(dateString){
    const date = new Date(dateString);
    const formattedDate = [
      String(date.getMonth() + 1).padStart(2, '0'), // Month (0-based index, so add 1)
      String(date.getDate()).padStart(2, '0'),     // Day
      date.getFullYear()                           // Year
    ].join('/');
    return formattedDate;
  },

  checkDateInRange: async function(dateStr, startStr, endStr){

    // Parse the given date
    const date = new Date(dateStr);
  
    // Parse the start and end dates of the range
    const startDate = new Date(startStr);
    const endDate = new Date(endStr);

    // if (isNaN(date) || isNaN(startDate) || isNaN(endDate)) {
    //   throw new Error("One or more dates are invalid.");
    // }

  
    // Check if the given date is within the range
    return date >= startDate && date <= endDate;
  },
  getMonthInMmmFormat: async function(month){
    let monthemap = {"1":"Jan","2":"Feb","3":"Mar","4":"Apr",
      "5":"May","6":"Jun","7":"Jul","8":"Aug","9":"Sep",
      "10":"Oct","11":"Nov","12":"Dec"
    };

    return monthemap[month];
  },
  getFullMonthName: async function(month){
    const monthMap = {
      Jan: "January",
      Feb: "February",
      Mar: "March",
      Apr: "April",
      May: "May",
      Jun: "June",
      Jul: "July",
      Aug: "August",
      Sep: "September",
      Oct: "October",
      Nov: "November",
      Dec: "December"
    };

    return monthMap[month];
  },
  waitForElementToVisible: async function(page,path){
    let isVisible = false;
    console.log("==================== "+path);
    isVisible = await page.locator(path).isVisible();
    while(!isVisible){
      isVisible = await page.locator(path).isVisible();;
    }
    return isVisible;
  },

  uploadInvoice: async function(page,filePath){
    const isVisible = await page.locator("//strong[normalize-space()='Import Files']").isVisible();
    console.log("Uploading File= " + filePath);
    
    if (isVisible) {
      await page.getByLabel('Browse Files').setInputFiles(filePath);
    }else{
      // await page.getByRole('button', { name: 'Import', exact: true }).click();
      await page.locator('button:nth-child(6)').first().click();
      await page.getByLabel('Browse Files').setInputFiles(filePath);
    }
    // await page.getByRole('button', { name: 'Next' }).click();
    await page.locator("//div[@class='d-flex'] //button[text()='Next']").click();
    await page.getByText('Done').click();
  },

  waitForAnalyzedSatatus: async function(page,fileToUpload){
    console.log("fileToUpload in waitForAnalyzedSatatus=="+fileToUpload.replace(".pdf",""));
    await page.waitForTimeout(10000);
    // await page.getByLabel('Search card').fill(fileToUpload.replace(".pdf",""));
    await page.getByPlaceholder('Search card').fill(fileToUpload.replace(".pdf",""));
    await page.getByPlaceholder('Search card').press('Enter');
      // await page.locator('(//input[@type="text"])[1]').press('Enter');
      
     await page.waitForTimeout(10000);
     await test.step('Invoice uploaded', async () => {
      const screenshotPath = 'screenshots/invoiceuploaded.png';
      await page.screenshot({ path: screenshotPath });
      test.info().attach('Invoice uploaded', {
        path: screenshotPath,
        contentType: 'image/png',
      });
    });
    let isAnalyzed = false;
    isAnalyzed = await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible();
    console.log("status=== "+await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible());
     while(isAnalyzed !== true){
      await page.waitForTimeout(1000);
      // await page.getByRole('button', { name: 'Refresh' }).click();
      await page.locator('button:nth-child(8)').first().click();
      // if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
        // console.log("in while status=== "+await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible());
        isAnalyzed = await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible();
      // }
    
     }
     await test.step('Invoice Analyzed', async () => {
      const screenshotPath = 'screenshots/invoiceanalyzed.png';
      await page.screenshot({ path: screenshotPath });
      test.info().attach('Invoice Analyzed', {
        path: screenshotPath,
        contentType: 'image/png',
      });
    });
  },
  readPDF :async function extractPDFText(filePath) {
    
    const dataBuffer = fs.readFileSync(filePath);
    let normalizedExtractedText;
    try {
      const pdfData = await pdfParse(dataBuffer);
      const extractedText = pdfData.text.trim();
      // console.log('PDF Text Content:');
      // console.log(pdfData.text); // Extracted text

      
      // Normalize and clean up text
      normalizedExtractedText = extractedText.replace(/\s+/g, ' ');
    //  const normalizedExpectedText = expectedText.replace(/\s+/g, ' ').toLowerCase();
      console.log('\\nPDF normalized Text Content:\\n', normalizedExtractedText); // Extracted normalized text
  
     
  } catch (error) {
      console.error('Error reading or comparing PDF:', error);
  }
  return normalizedExtractedText;
},
getInvoiceNo: async function(normalizedExtractedText,expectedText){
  let regex1 = new RegExp("Invoice Number("+expectedText+")", 'i');
  let regex2 = new RegExp("Invoice No("+expectedText+")", 'i');
  let regex3 = new RegExp("("+expectedText+")", 'i');
  let match;
  let invoiceNo;
  if (regex1.test(normalizedExtractedText)) {
    // console.log('Regex match found 1');
    match = normalizedExtractedText.match(regex1);
    invoiceNo = match[1];
        
  }else if (regex2.test(normalizedExtractedText)) {
    // console.log('Regex match found 2');
    match = normalizedExtractedText.match(regex2);
    invoiceNo = match[1];
  }else if (regex3.test(normalizedExtractedText)) {
    // console.log('Regex match found 3');
    match = normalizedExtractedText.match(regex3);
    invoiceNo = match[1];
  }else{
    console.error('invoiceNo not found');
    invoiceNo = "Not Found";
  }
     
  
  // console.log("invoiceNo= "+invoiceNo);

  return invoiceNo.trim();
},

getInvoiceDate: async function(normalizedExtractedText,expectedText){
  let regex1 = new RegExp("("+expectedText+")", 'i');
  let match;
  let invoiceDate;
  if (regex1.test(normalizedExtractedText)) {
    // console.log('Regex match found 1');
    match = normalizedExtractedText.match(regex1);
    invoiceDate = match[1];
        
  }else{
    console.error('Invoice Date not found');
    invoiceDate = "Not Found";
  }
     
  
  // console.log("invoiceNo= "+invoiceNo);

  return invoiceDate.trim();
},
getPaymentDueDate: async function(normalizedExtractedText,expectedText){
  let regex1 = new RegExp("("+expectedText+")", 'i');
  let match;
  let paymentDueDate;
  if (regex1.test(normalizedExtractedText)) {
    // console.log('Regex match found 1');
    match = normalizedExtractedText.match(regex1);
    paymentDueDate = match[1];
        
  }else{
    console.error('Payment Due Date not found');
    paymentDueDate = "Not Found";
  }
     
  
  // console.log("invoiceNo= "+invoiceNo);

  return paymentDueDate.trim();
},
getSubtotal: async function(normalizedExtractedText,expectedText){
  let regex1 = new RegExp("(\\"+expectedText+") Subtotal", 'i');
  let regex2 = new RegExp("(\\"+expectedText+")", 'i');
  let match;
  let subtotal;
  if (regex1.test(normalizedExtractedText)) {
    match = normalizedExtractedText.match(regex1);
    subtotal = match[1];
        
  }else if (regex2.test(normalizedExtractedText)) {
    match = normalizedExtractedText.match(regex2);
    subtotal = match[1];
        
  }
  else{
    console.error('Subtotal not found');
    subtotal = "Not Found";
  }
     
  
  // console.log("invoiceNo= "+invoiceNo);

  return subtotal.trim();
},
getTax: async function(normalizedExtractedText,expectedText){
  let regex1 = new RegExp("Sales Tax.*?($"+expectedText+")", 'i');
  let regex2 = new RegExp("("+expectedText+")", 'i');
  let match;
  let tax;
  if (regex1.test(normalizedExtractedText)) {
    match = normalizedExtractedText.match(regex1);
    tax = match[1];
        
  }else if (regex2.test(normalizedExtractedText)) {
    match = normalizedExtractedText.match(regex2);
    tax = match[1];
        
  }
  else{
    console.error('Tax not found');
    tax = "Not Found";
  }
     
  
  // console.log("invoiceNo= "+invoiceNo);

  return tax.trim();
},

getTotalAmount: async function(normalizedExtractedText,expectedText){
  let regex1 = new RegExp("Invoice Total.*?(\\"+expectedText+")", 'i');
  let regex2 = new RegExp("(\\"+expectedText+")", 'i');
  let match;
  let totalAmt;
  if (regex1.test(normalizedExtractedText)) {
    match = normalizedExtractedText.match(regex1);
    totalAmt = match[1];
        
  }else if (regex2.test(normalizedExtractedText)) {
    match = normalizedExtractedText.match(regex2);
    totalAmt = match[1];
        
  }
  else{
    console.error('Total Amount not found');
    totalAmt = "Not Found";
  }
     
  
  // console.log("invoiceNo= "+invoiceNo);

  return totalAmt.trim();
},

//Line Items from PDF
getDescription: async function(normalizedExtractedText,expectedText){
  // expectedText = expectedText.replace(/\s+/g, ' ').trim();
  // normalizedExtractedText = normalizedExtractedText.replace(/\s+/g, ' ').trim();
  let regex1 = new RegExp("("+expectedText+")", 'i');
  console.log("---------------------------------------------------")
  console.log("("+expectedText+")")
  let match;
  let description;
  if (regex1.test(normalizedExtractedText)) {
    // console.log('Regex match found 1');
    match = normalizedExtractedText.match(regex1);
    description = match[1];
        
  }else{
    console.error('Description not found');
    description = "Not Found";
  }
   return description.trim();
},


getPDFValWith1Regx: async function(normalizedExtractedText,expectedText){
 
  let regex1 = new RegExp("("+expectedText+")", 'i');
  let match;
  let value;
  if (regex1.test(normalizedExtractedText)) {
    // console.log('Regex match found 1');
    match = normalizedExtractedText.match(regex1);
    value = match[1];
        
  }else{
    console.error('Description not found');
    value = "Not Found";
  }
   return value.trim();
},

getNoOfItems: async function(page,locator){
  const text = await page.locator(locator).textContent();
  let regex1 = new RegExp("([0-9]+)", 'i');
  let match;
  let value;
  if (regex1.test(text)) {
    // console.log('Regex match found 1');
    match = text.match(regex1);
    value = match[1];
        
  }else{
    console.error('not found');
    value = "Not Found";
  }
   return value.trim();
},
takeScreenShot: async function(page,stepName,fileName){
  await test.step(stepName, async () => {
    // await page.screenshot({ path: 'screenshots/allcheckboxs.png' });
    const screenshotPath = 'screenshots/'+fileName+'.png';
    await page.screenshot({ path: screenshotPath });
    test.info().attach(stepName, {
      path: screenshotPath,
      contentType: 'image/png',
    });
  });
},

deleteAttachments: async function(page,noOfItems){
  let num = Number(noOfItems);
  // console.log("num---- "+num);
  for (let i = 0; i < num; i++) {
    // await page.getByRole('button', { name: '罹' }).nth(i).click();
    await page.getByRole('button', { name: '罹' }).first().click();
    await page.getByRole('button', { name: 'DELETE', exact: true }).click();
    await page.waitForTimeout(1800);
  }
},

deleteInvoice: async function(page,fileName){
  await page.getByPlaceholder('Search card').fill(fileName.replace(".pdf",""));
  await page.getByPlaceholder('Search card').press('Enter');
  await page.waitForTimeout(1000);
  let rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  let rowcnt = await rows.count();
  console.log("rowcnt==="+rowcnt);
  if(rowcnt > 0){
  await page.locator("//input[@role='checkbox']").click();
  await page.getByRole('button', { name: 'Delete' }).click();
  await page.getByRole('button', { name: 'Yes, delete file' }).click();
  }
},

getRandomValue:  function(){
  const isFloat = Math.random() > 0.5;
  if (isFloat) {
    const decimals = Math.random() > 0.5 ? 2 : 1;
    return Number((Math.random() * 500).toFixed(decimals)); // Random float up to 500
  } else {
    return Math.floor(Math.random() * 500); // Random integer up to 500
  }
},

getRandomValuesAsPerDataType:  function(datatype){
  if(datatype === 'string' || datatype === 'STRING'){
    // let length = 6;
    // const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    // return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');

    const baseItems = [
      "Hosting",
      "Maintenance",
      "Design",
      "Support",
      "Subscription",
      "Consulting",
      "Email Service",
      "Analytics",
      "001",
      "002",
      "003",
      "004"
    ];
  
    const plans = ["Basic", "Standard", "Premium", "Enterprise"];
    const actions = ["Setup", "Upgrade", "Monthly Fee", "Annual Renewal"];
  
    const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];
  
    return `${rand(plans)} ${rand(baseItems)} - ${rand(actions)}`;
  }
  if(datatype === 'float' || datatype === 'DECIMAL'){
    const decimals = Math.random() > 0.5 ? 2 : 1;
    return Number((Math.random() * 500).toFixed(decimals)); // Random float up to 500
  }
  if(datatype === 'number' || datatype === 'NUMERIC'){
    return Math.floor(Math.random() * 500); // Random integer up to 500
  }
  if(datatype === 'date' || datatype === 'Date' || datatype === 'DATE'){
    const start = new Date('2024-01-01');
  const end = new Date('2024-12-31');

  const randomTime = start.getTime() + Math.random() * (end.getTime() - start.getTime());
  const randomDate = new Date(randomTime);

  // Format to MM/DD/YYYY
  const mm = String(randomDate.getMonth() + 1).padStart(2, '0');
  const dd = String(randomDate.getDate()).padStart(2, '0');
  const yyyy = randomDate.getFullYear();

  return `${mm}/${dd}/${yyyy}`;
  }

  throw new Error('Invalid type provided');
},

fetchInvoices: async function(){
  const context = await request.newContext({
    baseURL: 'https://microservice-dev.briq.com',
    extraHTTPHeaders: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTE1MjM1YTZjNjE0NTRlZmRlZGM0NWE3N2U0MzUxMzY3ZWViZTAiLCJ0eXAiOiJKV1QifQ.eyJyZXF1aXJlX3Blcm1pc3Npb24iOnRydWUsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9icmlxLWNocm9uaWNsZS1wcm9kdWN0aW9uIiwiYXVkIjoiYnJpcS1jaHJvbmljbGUtcHJvZHVjdGlvbiIsImF1dGhfdGltZSI6MTc0MzUyNjEyMCwidXNlcl9pZCI6IndUQzZHS2VRaXRXbVc0aGVJS0RvREtsSk9HUDIiLCJzdWIiOiJ3VEM2R0tlUWl0V21XNGhlSUtEb0RLbEpPR1AyIiwiaWF0IjoxNzQ0MDM3ODYyLCJleHAiOjE3NDQwNDE0NjIsImVtYWlsIjoicWFhdXRvbWF0aW9uLmJyaXFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInFhYXV0b21hdGlvbi5icmlxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.FzUDAR7115iPEpi2MOVEXmPTUtyG7pyl5UzvCjp3jT_iSIk5FOwHM36AWF01Xww67DnYrldqyJBMwd64YXjjhxBw9f84XxF09wNDooLlRV2TcJcitZK-Jq0S8_SHfZIeAbPiykvXJVSdxjN3BLPYl5Yl8DNnZXTUwu5BpwV2ThG0SOCCPM7xxzyxKNoDIv8zyqMZCL7HItpwXoGq9SCDMIo5qldRkHdkI2mNQKvzuFko_d24LCFulho3Yd8Y4RiG5GLjnT59WRR2KDPa44bO5apRgGzlr8Bg4BXyt3hxehOuDYksd2GZXeO5831Ym1fg3IxicE5gPFsjRnQNAMVhBw',
      'AUTH': 'e6534e88-8134-4a60-9013-11bd92ac83fb',
      'Connection': 'keep-alive',
      'Origin': 'https://app-dev.briq.com',
      'Referer': 'https://app-dev.briq.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'bearer-company-id': 'handshake_construction',
      'bearer-email': 'qaautomation.briq@gmail.com',
      'bearer-id': 'wTC6GKeQitWmW4heIKDoDKlJOGP2',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      // Add other headers if needed
    }
  });

  // const endpoint = `/invoices/companies/handshake_construction/folders/65806f42-4115-44ae-9c01-066cd82d8dbe_v2?invoices=false`;
  const endpoint = `/invoices/companies/handshake_construction/folders/8bd0f357-df5f-485c-9a1d-0d8444b73ea3_v2?invoices=false`; //Chasse_Automation2.0
  const response = await context.get(endpoint);

  console.log('Status:', response.status());
  const data = await response.json();
  console.log('Response Body:', data);

  await context.dispose();
  return data;
},



fetchInvoiceLineItemFields: async function(){
  const context = await request.newContext({
    baseURL: 'https://microservice-dev.briq.com',
    extraHTTPHeaders: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
      'Authorization': 'Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjcxMTE1MjM1YTZjNjE0NTRlZmRlZGM0NWE3N2U0MzUxMzY3ZWViZTAiLCJ0eXAiOiJKV1QifQ.eyJyZXF1aXJlX3Blcm1pc3Npb24iOnRydWUsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9icmlxLWNocm9uaWNsZS1wcm9kdWN0aW9uIiwiYXVkIjoiYnJpcS1jaHJvbmljbGUtcHJvZHVjdGlvbiIsImF1dGhfdGltZSI6MTc0MzUyNjEyMCwidXNlcl9pZCI6IndUQzZHS2VRaXRXbVc0aGVJS0RvREtsSk9HUDIiLCJzdWIiOiJ3VEM2R0tlUWl0V21XNGhlSUtEb0RLbEpPR1AyIiwiaWF0IjoxNzQ0MDM3ODYyLCJleHAiOjE3NDQwNDE0NjIsImVtYWlsIjoicWFhdXRvbWF0aW9uLmJyaXFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOmZhbHNlLCJmaXJlYmFzZSI6eyJpZGVudGl0aWVzIjp7ImVtYWlsIjpbInFhYXV0b21hdGlvbi5icmlxQGdtYWlsLmNvbSJdfSwic2lnbl9pbl9wcm92aWRlciI6ImN1c3RvbSJ9fQ.FzUDAR7115iPEpi2MOVEXmPTUtyG7pyl5UzvCjp3jT_iSIk5FOwHM36AWF01Xww67DnYrldqyJBMwd64YXjjhxBw9f84XxF09wNDooLlRV2TcJcitZK-Jq0S8_SHfZIeAbPiykvXJVSdxjN3BLPYl5Yl8DNnZXTUwu5BpwV2ThG0SOCCPM7xxzyxKNoDIv8zyqMZCL7HItpwXoGq9SCDMIo5qldRkHdkI2mNQKvzuFko_d24LCFulho3Yd8Y4RiG5GLjnT59WRR2KDPa44bO5apRgGzlr8Bg4BXyt3hxehOuDYksd2GZXeO5831Ym1fg3IxicE5gPFsjRnQNAMVhBw',
      'AUTH': '257cda4d-49ad-4225-988c-3442eb80b951',
      'Connection': 'keep-alive',
      'Origin': 'https://app-dev.briq.com',
      'Referer': 'https://app-dev.briq.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'bearer-company-id': 'handshake_construction',
      'bearer-email': 'qaautomation.briq@gmail.com',
      'bearer-id': 'wTC6GKeQitWmW4heIKDoDKlJOGP2',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      // Add other headers if needed
    }
  });
  const endpoint = `/object-manager/object/3d48bda9-a6af-4424-a07a-5c21b87fa129/handshake_construction`;
  const response = await context.get(endpoint);
  console.log('Status:', response.status());
  const data = await response.json();
  // console.log('Response Body:', data);
  await context.dispose();
  return data;
},
fetchWorkflowByInvoiceId: async function(invoiceId){
  const context = await request.newContext({
    baseURL: 'https://microservice-dev.briq.com',
    extraHTTPHeaders: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
     'AUTH': '257cda4d-49ad-4225-988c-3442eb80b951',
      'Connection': 'keep-alive',
      'Origin': 'https://app-dev.briq.com',
      'Referer': 'https://app-dev.briq.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'bearer-company-id': 'handshake_construction',
      'bearer-email': 'qaautomation.briq@gmail.com',
      'bearer-id': 'wTC6GKeQitWmW4heIKDoDKlJOGP2',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      // Add other headers if needed
    }
  });

  const endpoint = `/forecast-workflow/companies/handshake_construction/workflows/tasks?resource_id=${invoiceId}&workflow_status=active%2Ccompleted`;
  const response = await context.get(endpoint);
  console.log('Status:', response.status());
  const data = await response.json();
  //console.log('Task Response Body:', data);

  await context.dispose();
  return data;
},
getWorkflowDefination: async function(workflowId){
  const context = await request.newContext({
    baseURL: 'https://microservice-dev.briq.com',
    extraHTTPHeaders: {
      'Accept': 'application/json, text/plain, */*',
      'Accept-Language': 'en-IN,en-GB;q=0.9,en-US;q=0.8,en;q=0.7',
     'AUTH': '257cda4d-49ad-4225-988c-3442eb80b951',
      'Connection': 'keep-alive',
      'Origin': 'https://app-dev.briq.com',
      'Referer': 'https://app-dev.briq.com/',
      'Sec-Fetch-Dest': 'empty',
      'Sec-Fetch-Mode': 'cors',
      'Sec-Fetch-Site': 'same-site',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Safari/537.36',
      'bearer-company-id': 'handshake_construction',
      'bearer-email': 'qaautomation.briq@gmail.com',
      'bearer-id': 'wTC6GKeQitWmW4heIKDoDKlJOGP2',
      'sec-ch-ua': '"Google Chrome";v="135", "Not-A.Brand";v="8", "Chromium";v="135"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      // Add other headers if needed
    }
  });

  const endpoint = `/forecast-workflow/v2/companies/handshake_construction/workflows/${workflowId}`;
  const response = await context.get(endpoint);
  console.log('Status:', response.status());
  const data = await response.json();
  console.log('Task Response Body:', data);

  await context.dispose();
  return data;
},
  // verifyAnalyzedSatatus: async function(page){
    
  //   const rows = await page.locator('//div[@ref="eCenterContainer"] //div[@role="row"]');
  //   let statues = await common.getGridColumnTextsByindex(page, "3",rows);
  //   let fileNames = await common.getGridColumnTextsByindex(page, "2",rows);
  //   let statusReport = [];
  //   let isactualStatusValVisible = false;
  //   for (let i = 0; i < statues.length; i++) {
     
  //     const actualStatusVal = statues[i].trim();
  //     // console.log(`Processing: ${actualStatusVal}`);
  //     if(actualStatusVal === 'Analyzed'){
  //       isactualStatusValVisible = true;
  //       statusReport.push(isactualStatusValVisible);
  //       console.log(`file ${fileNames[i]} status found in the table as Analyzed`);
  //     }else{
  //       isactualStatusValVisible = false;
  //       statusReport.push(isactualStatusValVisible);
  //       console.log(`file ${fileNames[i]} status not found in the table as Analyzed`);
  //     }
      
  //   }
  //   console.log(statusReport);
  //     if(statusReport.includes(false)){
  //       throw new Error("Some files not in Analyzed status");
  //     }
  // }
};




// module.exports = {
//   waitForElementToVisible,
// };