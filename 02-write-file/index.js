'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const pathToFile = path.join(__dirname, 'text.txt');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

readline.emitKeypressEvents(process.stdin);

process.stdin.on('keypress', (ch, key) => {
  if(key && key.ctrl && key.name === 'c'){
    console.log('Удачи')
  }
});

const writeStream = fs.createWriteStream(pathToFile);

function write() {
  rl.question('Если ты видишь этот текст, то наиши - ', text => {
    console.log(text);
    if(text.toLocaleLowerCase() === 'exit'){
      console.log('\nУдачи!');
      rl.close();
      return;
    }
    writeStream.write(text + '\n', err => {
      if(err){
        console.log(err.message);
      } else {
        write();
      }
    });
  });
}

write();


