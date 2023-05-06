'use strict';

const fs = require('fs');
const path = require('path');
const pathToFile = path.join(__dirname, 'text.txt');
const { stdin, stdout } = require('process');

const writeStream = new fs.createWriteStream(pathToFile);

stdout.write('Напиши своё самое сильное желание\n');

stdin.on('data', (chank) => {
  if (chank.toString().trim().toLowerCase() === 'exit') {
    process.exit();
  } else {
    writeStream.write(chank);
  }
});

process.on('exit', () => {
  stdout.write('Всё сбудится. Пока\n');
});
process.on('SIGINT', () => {
  process.exit();
});