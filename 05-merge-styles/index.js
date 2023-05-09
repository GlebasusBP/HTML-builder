'use strict';

const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const folderPath = path.join(__dirname, 'styles');
const targetFolder = path.join(__dirname, 'project-dist');

const createBundle = async (sourcePath, targetPath, bundleName, bundleExtension) => {
  try {
    const files = await fsPromises.readdir(sourcePath);
    const output = fs.createWriteStream(path.join(targetPath, `${bundleName}.${bundleExtension}`));
    for(let file of files) {
      let target = file;
      if(path.extname(target) === `.${bundleExtension}`) {
        const stream = fs.createReadStream(path.join(sourcePath, target.toString()), 'utf-8');
        let data = '';
        stream.on('data', chunk => data += chunk);
        stream.on('end', () => {
          output.write(data);
        });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

createBundle(folderPath, targetFolder, 'bundle', 'css');