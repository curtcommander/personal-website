#!/usr/bin/env node
'use strict';

const countriesList = require('countries-list');

function getCountryCodesSpanish() {
    let countryCodesSpanish = [];
    const countries = countriesList.countries;
    for (const country in countries) {
        if (countries[country].languages.indexOf('es') > -1) {
            countryCodesSpanish.push(country);   
        }
    }
    console.log(countryCodesSpanish);
}

getCountryCodesSpanish();

/*
async function addGeoDNSRecord(countryCode) {
    let changes = [];
    for (const countryCode of countryCodesSpanish) {
        const change = {
            Action: 'UPSERT',
            ResourceRecordSet: {
                Name: `${domainName}.`,
                Type: "A",
                TTL: 300,
                ResourceRecords: NSValues
            }
        }
    }

    const hostedZoneIdInternal = await getHostedZoneId(route53Internal, 'tcpglobal.systems.');

    const params = {
        HostedZoneId: hostedZoneIdInternal,
        ChangeBatch: { Changes: [change] }
    }

    return route53Internal.changeResourceRecordSets(params).promise()
}
*/