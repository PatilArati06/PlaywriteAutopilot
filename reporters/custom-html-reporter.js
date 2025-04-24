// const { HtmlReporter } = require('@playwright/test/lib/reporters/html');

// class CustomHtmlReporter extends HtmlReporter {
//   async onEnd(result) {
//     await super.onEnd(result);

//     const fs = require('fs');
//     const path = require('path');

//     const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
//     const reportDir = this.options.outputFolder || 'playwright-report';
//     const oldFilePath = path.join(reportDir, 'index.html');
//     const newFilePath = path.join(reportDir, `report-${timestamp}.html`);

//     if (fs.existsSync(oldFilePath)) {
//       fs.renameSync(oldFilePath, newFilePath);
//       console.log(`Custom report saved as: ${newFilePath}`);
//     }
//   }
// }

// module.exports = CustomHtmlReporter;