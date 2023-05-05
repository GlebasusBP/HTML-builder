'use strict';

const fs = require('fs');
const PATH = require('path');

const pathToFile = PATH.join(__dirname, 'text.txt');

const STREAM = new fs.ReadStream( pathToFile );

STREAM.pipe(process.stdout);