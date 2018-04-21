'use strict';

const express = require('express');
const sitemap = require('express-sitemap');
const router = express.Router();

// custom routes
const routes = {
    '/': {
        disallow: !process.env.ENABLE_CRAWLING
    },
    '/data/bootstrapcdn.json': {
        hide: true  // exclude this route from xml and txt
    },
    '/404/': {
        hide: true
    },
    '/alpha/': {
        hide: true
    },
    '/beta/': {
        hide: true
    },
    '/bootswatch4/': {
        hide: true
    },
    '/legacy/': {
        hide: true
    }
};

const options = {
    url: 'www.bootstrapcdn.com',
    http: 'https',
    generate: router,
    cache: 60000,   // enable 1m cache
    route: routes
};

const map = sitemap(options);

router.get('/', (req, res) => map.XMLToWeb(res));

module.exports = router;

// vim: ft=javascript sw=4 sts=4 et:
