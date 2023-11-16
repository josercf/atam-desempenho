const os = require('os');
const cluster = require('cluster');
const fs = require('fs');
const csv = require('csv-parser');
const splitFile = require('split-file');

if(cluster.isMaster) {
    console.time('CSV Processing Time');
    
    // split file into smaller parts
    let numberOfFiles = os.cpus().length;
    splitFile.splitFile('./dados.csv', numberOfFiles)
        .then((names) => {
            console.log('Arquivos:', names);
            for (let i = 0; i < numberOfFiles; i++) {
                let worker = cluster.fork();
                worker.send(names[i]); // send csv filename to worker
                worker.on('message', (message) => {
                    // handle worker finish event here
                    console.log('Worker finished processing file: ', message.file);
                });
            }
            cluster.on('exit', (worker) => {
                console.log(`Worker ${worker.process.pid} died.`);
            });
            console.timeEnd('CSV Processing Time');
        })
        .catch((err) => {
            console.log(`Failed to split file: ${err}`);
        });
}
else {
    // Worker Process
    process.on('message', (file) => {
        let results = [];
        fs.createReadStream(file)
            .pipe(csv())
            .on('data', (data) => results.push(data)) 
            .on('end', () => {
                // Processing finished, notify master process
                process.send({ file: file, records: results.length });
            });
    });
}