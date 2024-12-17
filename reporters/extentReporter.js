// const { Reporter } = require('@playwright/test');
// // import Reporter from '@playwright/test';
// const fs = require('fs');
// const path = require('path');
// const { ExtentReports, ExtentTest, LogStatus } = require('extent');

// class ExtentReporter extends Reporter {
//   constructor(options) {
//     super(options);
//     this.extent = null;
//   }

//   onBegin(config, suite) {
//     // Initialize ExtentReports
//     const reportPath = path.join(process.cwd(), 'reports');
//     if (!fs.existsSync(reportPath)) {
//       fs.mkdirSync(reportPath);
//     }

//     const filePath = path.join(reportPath, 'extent-report.html');
//     this.extent = new ExtentReports();
//     this.extent.init(filePath, true);
//   }

//   async onTestBegin(test) {
//     // Create a new test in the report
//     const testName = test.title;
//     this.testReport = this.extent.startTest(testName);
//   }

//   async onTestEnd(test) {
//     // If the test failed, attach a screenshot
//     const testResult = test.status;
//     if (testResult === 'failed') {
//       const screenshotPath = path.join(process.cwd(), 'screenshots', `${test.title}.png`);
//       await test.screenshot({ path: screenshotPath });
//       this.testReport.log(LogStatus.FAIL, `Test failed. Screenshot: ${screenshotPath}`);
//     } else {
//       this.testReport.log(LogStatus.PASS, 'Test passed');
//     }

//     this.extent.endTest(this.testReport);
//   }

//   onEnd() {
//     // Finalize and save the extent report
//     this.extent.flush();
//   }
// }

// module.exports = { ExtentReporter };