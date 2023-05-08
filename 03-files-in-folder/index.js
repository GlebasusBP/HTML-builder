'use strict';

const { error } = require('console');
const fs = require('fs');
const path = require('path');
const folderToPath = path.join(__dirname, 'secret-folder');

fs.readdir( folderToPath, {encoding: 'utf-8', withFileTypes: true}, (error, files) => {
  if(error){
    throw error;
  } else {
    for(let file of files){
      if(file.isFile()){
        let infoOfFile = path.parse(file.name);

        fs.stat(path.join(folderToPath, file.name), (err, stats) => {
          console.log(`${infoOfFile.name} - ${infoOfFile.ext.slice(1, infoOfFile.ext.length)} - ${stats.size / 1024} kb`);
        })
      }
    }
  }
})