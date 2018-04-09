#!/usr/bin/env node

/* eslint-env shelljs */

'use strict';

const fs = require('fs');
const path = require('path');
const sh = require('shelljs');

let version = process.argv[2];

if (!version) {
    console.log('Valid Bootlint version required.');
    process.exit(1);
}

// strip leading 'v' if present
version = version.replace(/^v/, '');

const basedir = path.join(__dirname, '..');
const bootlintSrcDir = path.join(basedir, 'node_modules/bootlint/dist/browser/');
const bootlintDistDir = path.join(basedir, 'public', 'bootlint', version);

if (fs.existsSync(bootlintDistDir)) {
    console.log('Bootlint version already found.');
    process.exit(1);
}

fs.mkdirSync(bootlintDistDir);
fs.copyFileSync(`${bootlintSrcDir}/bootlint.js`, `${bootlintDistDir}/bootlint.js`);

const UGLIFYJS = path.join(basedir, 'node_modules/.bin/uglifyjs');
const targetFile = 'bootlint.js';
const targetMinFile = `${targetFile.substr(0, targetFile.length - 3)}.min${targetFile.substr(targetFile.lastIndexOf('.'))}`;
const targetSourceMapFile = `${targetMinFile}.map`;

const targetFilepath = path.join(bootlintDistDir, targetFile);
const targetMinFilepath = path.join(bootlintDistDir, targetMinFile);

sh.exec(`${UGLIFYJS} ${targetFilepath} -o ${targetMinFilepath} --compress --source-map "filename=${targetSourceMapFile},includeSources,url=${targetSourceMapFile}" --comments "/(?:^!|@(?:license|preserve|cc_on))/"`);

console.log(`\nDo not forget to update "${path.normalize('config/_config.yml')}"!`);
