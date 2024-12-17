import fs from 'fs';
const { test, expect } = require('@playwright/test');


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
            envURL = 'https://timecards-stage-web.briq.com/login';
          }
          try {
                  await page.goto(envURL);
                  await page.fill('input#login-page-email-input', loginDetails[0]);  // username
                  await page.fill('input#login-page-password-input', loginDetails[1]); //password
                  await page.click('button.login-button');  //login button selector
                  test.setTimeout(120_000);
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
    }
};