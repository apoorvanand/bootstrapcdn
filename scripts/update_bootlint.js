#!/usr/bin/env node

/* eslint-env shelljs */

'use strict';

const fs = require('fs');
const https = require('https');
const path = require('path');

require('shelljs/global');

let version = process.argv[2];

if (!version) {
    console.log('Valid Bootlint version required.');
    process.exit(1);
}

// strip leading 'v' if present
version = version.replace(/^v/, '');

const basedir = path.join(__dirname, '..');
const bootlintDir = path.join(basedir, 'public', 'bootlint', version);
const UGLIFYJS = path.join(basedir, 'node_modules/.bin/uglifyjs');

if (fs.existsSync(bootlintDir)) {
    console.log('Bootlint version already found.');
    process.exit(1);
}

https.get(`https://raw.githubusercontent.com/twbs/bootlint/v${version}/dist/browser/bootlint.js`, (res) => {
    const statusCode = res.statusCode;

    if (statusCode !== 200) {
        console.log(new Error(`Request Failed.\nStatus Code: ${statusCode}`).message);
        res.resume();
        return;
    }

    fs.mkdirSync(bootlintDir);

    const targetFile = 'bootlint.js';
    const targetMinFile = `${targetFile.substr(0, targetFile.length - 3)}.min${targetFile.substr(targetFile.lastIndexOf('.'))}`;
    const targetSourceMapFile = `${targetMinFile}.map`;

    const targetFilepath = path.join(bootlintDir, targetFile);
    const targetMinFilepath = path.join(bootlintDir, targetMinFile);
    const file = fs.createWriteStream(targetFilepath);

    res.pipe(file);

    res.on('end', () => {
        file.close();

        exec(`${UGLIFYJS} ${targetFilepath} -o ${targetMinFilepath} --compress --source-map "filename=${targetSourceMapFile},includeSources,url=${targetSourceMapFile}" --comments "/(?:^!|@(?:license|preserve|cc_on))/"`);

        console.log(`\nDo not forget to update "${path.normalize('config/_config.yml')}"!`);
    }).on('error', (err) => {
        console.error(`Got error: ${err.message}`);
    });
});
