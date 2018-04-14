'use strict';

const express = require('express');
const appendLocals = require('./appendLocals.js');

const router = express.Router();

router.get('/', (req, res) => {
    res = appendLocals(req, res);

    const showcase = req.config.showcase;

    const col1 = [];
    const col2 = [];

    for (let i = 0; i < showcase.length; i++) {
        if (i % 2 === 0) {
            col1.push(showcase[i]);
        } else {
            col2.push(showcase[i]);
        }
    }

    res.render('showcase.pug', {
        title: 'Showcase',
        description: 'Websites and apps that use BootstrapCDN',
        col1,
        col2
    });
});

module.exports = router;

// vim: ft=javascript sw=4 sts=4 et:
