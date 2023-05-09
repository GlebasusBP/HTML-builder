'use strict';

const fs = require('fs');
const path = require('path');
const fsPromises = require('fs/promises');

const createFolder = async (folderName) => {
  try {
    await fsPromises.mkdir(folderName, { recursive: true });
  } catch (error) {
    console.log(error);
  }
};

const deleteFiles = async (folderName) => {
  try {
    const files = await fsPromises.readdir(folderName, { withFileTypes: true });
    for (let file of files) {
      if(file.isFile()) {
        let target = file.name;
        fsPromises.unlink(path.join(folderName, target));
      } else {
        let target = file.name;
        const newTarget = path.join(folderName, target.toString());
        deleteFiles(newTarget);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const copyFiles = async (sourceFolder, targetFolder) => {
  try {
    const files = await fsPromises.readdir(sourceFolder, { withFileTypes: true });
    for (let file of files) {
      if(file.isFile()) {
        let target = file.name;
        try {
          await fsPromises.copyFile(path.join(sourceFolder, target.toString()), path.join(targetFolder, target.toString()));
        } catch (error) {
          console.log(error);
        }
      } else {
        let target = file.name;
        const newSource = path.join(sourceFolder, target.toString());
        const newTarget = path.join(targetFolder, target.toString());
        await createFolder(newTarget);
        await copyFiles(newSource, newTarget);
      }

    }
  } catch (error) {
    console.log(error);
  }
};

const copyAssets = async (targetFolder) => {
  const assetsFolder = path.join(targetFolder, 'assets');
  const sourceFolder = path.join(__dirname, 'assets');
  await createFolder(assetsFolder);
  await deleteFiles(assetsFolder);
  await copyFiles(sourceFolder, assetsFolder);
};

const createCSSBundle = async (sourcePath, targetPath, bundleName, bundleExtension) => {
  try {
    const files = await fsPromises.readdir(sourcePath);
    const output = fs.createWriteStream(path.join(targetPath, `${bundleName}.${bundleExtension}`));
    for (let file of files) {
      let target = file;
      if (path.extname(target) === `.${bundleExtension}`) {
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

const getData = async (filePath) => {
  const stream = fs.createReadStream(filePath, 'utf-8');
  let data = '';

  for await (const chunk of stream) {
    data = `${data}${chunk}`;
  }
  return data;
};

const getHTMLComponents = async (folder) => {
  const files = await fsPromises.readdir(folder, { withFileTypes: true });
  const components = {};
  for (let file of files) {
    let target = path.join(folder, file.name);
    const component = await getData(target);
    components[file.name.split('.').splice(-0, 1).join('.')] = component;
  }
  return components;
};

const createHTMLBundle = async (folder, components) => {
  const output = fs.createWriteStream(path.join(folder, 'index.html'));

  const stream = fs.createReadStream(path.join(__dirname, 'template.html'), 'utf-8');
  let data = '';

  const componentsKeys = Object.keys(components);

  for await (const chunk of stream) {
    data = `${data}${chunk}`;
    for (let key of componentsKeys) {
      if (chunk.includes(`{{${key}}}`)) {

        data = data.replace(`{{${key}}}`, `${components[key]}`);
      }
    }
  }

  output.write(data);
};

const buildProject = async () => {
  const buildFolder = path.join(__dirname, 'project-dist');
  await createFolder(buildFolder);
  await deleteFiles(buildFolder);
  await copyAssets(buildFolder);

  const sourceCSSFolder = path.join(__dirname, 'styles');
  await createCSSBundle(sourceCSSFolder, buildFolder, 'style', 'css');

  const sourceHTMLFolder = path.join(__dirname, 'components');
  const HTMLComponents = await getHTMLComponents(sourceHTMLFolder);
  await createHTMLBundle(buildFolder, HTMLComponents);
};

buildProject();