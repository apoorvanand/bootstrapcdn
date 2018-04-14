'use strict';

const express = require('express');
const appendLocals = require('./appendLocals.js');

const router = express.Router();

router.get('/', (req, res) => {
    res = appendLocals(req, res);

    const integrations = req.config.integrations;

    const col1 = [];
    const col2 = [];

    for (let i = 0; i < integrations.length; i++) {
        if (i % 2 === 0) {
            col1.push(integrations[i]);
        } else {
            col2.push(integrations[i]);
        }
    }

    res.render('integrations.pug', {
        title: 'Integrations',
        description: 'Apps that integrate BootstrapCDN',
        col1,
        col2
    });
});

module.exports = router;

// vim: ft=javascript sw=4 sts=4 et:
