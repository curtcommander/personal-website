#!/usr/bin/env node
'use strict';

const aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});
const ssm = new aws.SSM();

///////////////////////////
/// put instagram token ///
///////////////////////////

let paramsPutToken = {
    Name: 'tokenInstagram',
    Description: 'token for accessing Instagram Basic Display API',
    Type: 'SecureString',
    DataType: 'text',
    Overwrite: true
}

async function putTokenInstagram(val) {
    paramsPutToken.Value = val;
    return await ssm.putParameter(paramsPutToken).promise();
}

///////////////////////////
/// get instagram token ///
///////////////////////////

let paramsGetToken = {
    Name: 'tokenInstagram',
    WithDecryption: true
}

async function getTokenInstagram() {
    const res = await ssm.getParameter(paramsGetToken).promise();
    return res.Parameter.Value;
}

module.exports = { 
    putTokenInstagram,
    getTokenInstagram
 };
