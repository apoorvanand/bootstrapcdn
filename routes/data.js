'use strict';

const express = require('express');
const semver = require('semver');
const helpers = require('../lib/helpers.js');

const router = express.Router();

const config = helpers.getConfig();

// eslint-disable-next-line init-declarations
let data; // only regenerated on restart

router.get('/', (req, res) => {
    if (typeof data === 'undefined') {
        data = {
            timestamp: new Date(),
            bootstrap: {},
            fontawesome: {}
        };

        config.bootstrap.forEach((bootstrap) => {
            const bootstrapVersion = bootstrap.version;

            if (semver.satisfies(semver.coerce(bootstrapVersion), '<4')) {
                data.bootstrap[bootstrapVersion] = {
                    css: bootstrap.stylesheet,
                    js: bootstrap.javascript
                };
            }
        });

        config.fontawesome.forEach((fontawesome) => {
            data.fontawesome[fontawesome.version] = fontawesome.stylesheet;
        });
    }

    res.send(data);
});

module.exports = router;

// vim: ft=javascript sw=4 sts=4 et:
