'use strict';

const fs = require('fs');
const path = require('path');
const readline = require('readline');
const pathToFile = path.join(__dirname, 'text.txt');
const { stdout } = require('process');
const rl = readline.createInterface(process.stdin, process.stdout);

stdout.write('Привет. Введи текст: ')

rl.on('line', input => {
  if (input.toLowerCase() === 'exit') {
    console.log('\n Ввод: exit');
    rl.close();
  } else {
    fs.appendFile(pathToFile, input + '\n', (err) => {
      if(err){
        console.log(err.message);
      } else {
        console.log('Текст записан. Для выхода введи "exit" или нажми Ctrl + C. Ну или напиши ещё: ')
      }
    })
  }
});

process.on('exit', () => stdout.write('Уважаю ваше решение. Всего хорошего'));

process.on('SIGINT', () => { 
  stdout.write('exit');
});


