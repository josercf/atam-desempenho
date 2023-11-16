const fs = require('fs');
const csv = require('csv-parser');

const results = [];

console.time("CSV Processing Time");

fs.createReadStream('./dados.csv')
    .pipe(csv())
    .on('data', (data) => results.push(data))
    .on('end', () => {
        for(let i = 0; i < results.length; i++) {
            console.log(results[i]);
        }

        console.timeEnd("CSV Processing Time");
    });