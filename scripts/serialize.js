#!/usr/bin/env node
'use strict';

function serialize(dom) {
    return dom.serialize().slice(
        '<html><head></head><body>'.length,
        '</body></html>'.length * -1
    ).trim();
}

module.exports = { serialize };