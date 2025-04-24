const fs = require('fs');
const path = require('path');

// Define the folder and file paths
const reportFolder = 'custom-report-folder';
const oldFileName = path.join(reportFolder, 'index.html');
const newFileName = path.join(reportFolder, `report-${new Date().toISOString().replace(/[:.]/g, '-')}.html`);

// Function to rename the file with a retry mechanism
const renameReportFile = () => {
  if (fs.existsSync(oldFileName)) {
    try {
      fs.renameSync(oldFileName, newFileName);
      console.log(`Renamed HTML report to: ${newFileName}`);
    } catch (err) {
      console.error('Error renaming the report file:', err);
    }
  } else {
    console.error('HTML report not found. Make sure the tests have completed.');
  }
};

// Delay execution to ensure Playwright has completed the report
setTimeout(renameReportFile, 3000); // Adjust delay if necessary
