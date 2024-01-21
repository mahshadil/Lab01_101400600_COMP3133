const fs = require('fs');
const csv = require('csv-parser');

// Function to filter and write data to a file
function filterAndWriteData(inputFilePath, outputFilePath, filterCountry) {
  const rows = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(inputFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Check for 'country' instead of 'Country'
        if (row.country === filterCountry) {
          rows.push(row);
        }
      })
      .on('end', () => {
        if (rows.length === 0) {
          console.log(`No data found for ${filterCountry}`);
          resolve();
          return;
        }

        fs.writeFile(outputFilePath, JSON.stringify(rows, null, 2), (err) => {
          if (err) {
            reject(err);
          } else {
            console.log(`Filtered data for ${filterCountry} has been written to ${outputFilePath}`);
            resolve();
          }
        });
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        reject(error);
      });
  });
}

// Delete existing files if they exist
['canada.txt', 'usa.txt'].forEach((file) => {
  if (fs.existsSync(file)) {
    console.log(`${file} exists. Deleting...`);
    fs.unlinkSync(file);
    console.log(`${file} deleted.`);
  } else {
    console.log(`${file} does not exist.`);
  }
});

// Filter and write data for Canada
filterAndWriteData('input_countries.csv', 'canada.txt', 'Canada')
  .then(() => {
    // Filter and write data for United States
    return filterAndWriteData('input_countries.csv', 'usa.txt', 'United States');
  })
  .catch((err) => {
    console.error(err);
  });
