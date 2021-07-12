#!/usr/bin/env node
'use strict';

const axios = require('axios');
const qs = require('querystring');

const { putTokenInstagram, getTokenInstagram } = require('./tokenInstagram');

axios.defaults.baseURL = 'https://graph.instagram.com';

let dataRefreshLongLivedToken = { grant_type: 'ig_refresh_token' };

async function refreshLongLivedToken() {
    const longLivedToken = await getTokenInstagram();
    dataRefreshLongLivedToken.access_token = longLivedToken;
    const url = `/refresh_access_token?${qs.stringify(dataRefreshLongLivedToken)}`;
    const res = await axios.get(url);
    return await putTokenInstagram(res.data.access_token);
}

exports.handler = refreshLongLivedToken;