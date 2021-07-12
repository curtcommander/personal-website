#!/usr/bin/env node
'use strict';

const axios = require('axios');
const qs = require('querystring');
const readline = require('readline');

const putTokenInstagram = require('./tokenInstagram');

// TODO: make these env variables
const redirectUri = 'https://curtcommander.com/'
const clientId = '3992302897563178';
const clientSecret = '5d18b2facf6866199a4f52f29f6a2472';

axios.defaults.baseURL = 'https://graph.instagram.com';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

async function getLongLivedToken() {
    const authCode = await _getAuthCode();
    const accessToken = await _getAccessToken(authCode);
    const longLivedToken = await _getLongLivedToken(accessToken);
    return await putTokenInstagram(longLivedToken);
}

getLongLivedToken();

//////////////////////////////
/// get authorization code ///
//////////////////////////////

async function _getAuthCode() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });      
    console.log(`Visit the following url and enter the url instragram redirects to:\n`)
    console.log(`https://api.instagram.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=user_profile,user_media&response_type=code\n`);
    return new Promise(resolve => {
        rl.question('Redirected url: ', url => {
            rl.close();
            const queryString = url.slice(redirectUri.length+1, url.length-2);
            const data = qs.parse(queryString);
            resolve(data.code);
        });
    })
}

////////////////////////
/// get access token ///
////////////////////////

let dataGetAccessToken = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    redirect_uri: redirectUri
};

async function _getAccessToken(authCode) {
    dataGetAccessToken.code = authCode;
    const queryString = qs.stringify(dataGetAccessToken);
    const res = await axios.post('https://api.instagram.com/oauth/access_token', queryString);
    return res.data.access_token;
}

////////////////////////////
/// get long-lived token ///
////////////////////////////

let dataGetLongLivedToken = {
    grant_type: 'ig_exchange_token',
    client_secret: clientSecret
}

async function _getLongLivedToken(accessToken) {
    dataGetLongLivedToken.access_token = accessToken;
    const url = `/access_token?${qs.stringify(dataGetLongLivedToken)}`;
    const res = await axios.get(url);
    return res.data.access_token;
}
