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

    mkdir(bootlintDir);
    pushd(bootlintDir);

    const targetFile = 'bootlint.js';
    const targetMinFile = 'bootlint.min.js';
    const targetSourceMapFile = 'bootlint.min.js.map';
    const file = fs.createWriteStream(targetFile);

    res.pipe(file);

    res.on('end', () => {
        file.close();

        exec(`${UGLIFYJS} ${targetFile} -o ${targetMinFile} --compress --source-map "filename=${targetSourceMapFile},includeSources,url=${targetSourceMapFile}" --comments "/(?:^!|@(?:license|preserve|cc_on))/"`);

        popd();

        echo(`\nDo not forget to update "${path.normalize('config/_config.yml')}"!`);
    });
});
