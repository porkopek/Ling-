const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const outputFile = path.join(__dirname, 'lingplus.zip');
const output = fs.createWriteStream(outputFile);
const archive = archiver('zip', { zlib: { level: 9 } });

output.on('close', () => {
  console.log(`Zip created! Total bytes: ${archive.pointer()}`);
});

archive.on('error', err => {
  throw err;
});

archive.pipe(output);
// Zip the entire contents of the current directory excluding the zip file itself
archive.glob('**', { ignore: ['lingplus.zip'] });
archive.finalize();
