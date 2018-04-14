'use strict';

const path = require('path');
const digest = require('../lib/helpers.js').sri.digest;

const SRI_CACHE = {};

function appendLocals(req, res) {
    const TITLE_SUFFIX = 'BootstrapCDN by StackPath';
    let proto = req.get('x-forwarded-proto');

    if (typeof proto === 'undefined') {
        proto = req.protocol;
    }

    res.locals.fullUrl = `${proto}://${req.hostname}${req.path}`;

    res.locals.siteUrl = `${proto}://${req.hostname}`;

    res.locals.theme = req.query.theme;

    res.locals.displayTitle = (title) => `${title} · ${TITLE_SUFFIX}`;

    res.locals.bodyClass = (title) => {
        // Remove any whitespace from the title
        let str = title.replace(/\s/g, '');

        // Make the first letter lowercase
        str = str.charAt(0).toLowerCase() + str.slice(1);

        return `page-${str}`;
    };

    res.locals.generateSRI = (file) => {
        if (typeof SRI_CACHE[file] === 'undefined') {
            SRI_CACHE[file] = digest(path.join(__dirname, '..', 'public', file));
        }

        return SRI_CACHE[file];
    };

    return res;
}

module.exports = appendLocals;

// vim: ft=javascript sw=4 sts=4 et:
