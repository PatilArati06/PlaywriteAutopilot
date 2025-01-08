import fs from 'fs';
const { test, expect } = require('@playwright/test');
// const { PDFDocument } = require('pdf-lib');
const pdfParse = require('pdf-parse');

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
                  test.setTimeout(450_000);
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
      await page.getByRole('button', { name: 'Import', exact: true }).click();
      await page.getByLabel('Browse Files').setInputFiles(filePath);
    }
    await page.getByRole('button', { name: 'Next' }).click();
    await page.getByText('Done').click();
  },

  waitForAnalyzedSatatus: async function(page,fileToUpload){
    await page.getByLabel('Search card').fill(fileToUpload.replace(".pdf",""));
      await page.locator('(//input[@type="text"])[1]').press('Enter');
      
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
      await page.getByRole('button', { name: 'Refresh' }).click();
      if(await waitForElementToVisible(page,"//input[@id='headerChk']")){
        console.log("in while status=== "+await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible());
        isAnalyzed = await page.getByRole('gridcell', { name: 'Analyzed' }).first().isVisible();
      }
    
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
  readPDF :async function extractPDFText(filePath, expectedText) {
    
    const dataBuffer = fs.readFileSync(filePath);

    try {
      const pdfData = await pdfParse(dataBuffer);
      const extractedText = pdfData.text.trim();
      console.log('PDF Text Content:');
      console.log(pdfData.text); // Extracted text

      // Normalize and clean up text
      const normalizedExtractedText = extractedText.replace(/\s+/g, ' ').toLowerCase();
      const normalizedExpectedText = expectedText.replace(/\s+/g, ' ').toLowerCase();
      console.log('PDF normalized Text Content:',normalizedExpectedText.text); // Extracted normalized text
      // Compare the texts
      if (normalizedExtractedText.includes(expectedText)) {
          console.log('Expected text is found in the PDF.');
      } else {
          console.log('Expected text is NOT found in the PDF.');
      }
  } catch (error) {
      console.error('Error reading or comparing PDF:', error);
  }
}
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