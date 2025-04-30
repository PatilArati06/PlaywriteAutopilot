const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse/sync');

/**
 * Reads a CSV and returns a map grouped by keyColumn (e.g., TCID)
 * Each key has folder, invoiceName, and expectedValues (grouped by type)
 */
async function UseAIDataParser(fileName, keyColumn) {
const filePath = path.resolve(__dirname,'..', fileName)
  const csvContent = fs.readFileSync(filePath);

  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true
  });

  const result = {};

  for (const row of records) {
    const key = row[keyColumn];
    const { folder, invoiceName, moveToFolder, type, fieldName, value } = row;

    if (!result[key]) {
      result[key] = {
        folder,
        invoiceName,
        moveToFolder,
        expectedValues: {}
      };
    }

    if (!result[key].expectedValues[type]) {
      result[key].expectedValues[type] = [];
    }

    result[key].expectedValues[type].push({ fieldName, value });
  }

  return result;
}

async function RuleEngineDataParser(fileName, tcid) {
  const filePath = path.resolve(__dirname,'..', fileName)
    const csvContent = fs.readFileSync(filePath);
  
    const records = parse(csvContent, {
      columns: true,
      skip_empty_lines: true,
    });
  
    const record = records.find(row => row.TCID === tcid);
  if (!record) throw new Error(`TCID ${tcid} not found`);

  // Parse JSON strings
  record.conditions = JSON.parse(record.conditions);
  record.assignments = JSON.parse(record.assignments);

  return record;
  }

  function readCsvSync(fileName) {
    const filePath = path.resolve(__dirname,'..', fileName)
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return parse(fileContent, {
      columns: true, // returns array of objects with headers as keys
      skip_empty_lines: true,
    });
  }

module.exports = {
    UseAIDataParser,
    RuleEngineDataParser,
    readCsvSync
};
