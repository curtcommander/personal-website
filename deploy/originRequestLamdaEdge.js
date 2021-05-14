'use strict';

// lambda@edge function
// edgelambda.amazonaws.com needs to be able
// to assume execution role

exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;

    // wilmington shootings
    if (request.uri === '/wilmington-shootings/') {
        request.uri = '/wilmington-shootings/index.html';
    } else {
        // serve language-specific content
        const pathEN = '/en';
        const pathSP = '/sp';
        const beginning = request.uri.slice(0,3);
        if (headers['cloudfront-viewer-country']
            && ![pathEN, pathSP].includes(beginning)
            && request.uri.indexOf('wilmington-shootings') !== 1
        ) {
            const countryCode = headers['cloudfront-viewer-country'][0].value;
            const countriesES = [
                'AR', 'BO', 'BZ', 'CL',
                'CO', 'CR', 'CU', 'DO',
                'EC', 'EH', 'ES', 'GQ',
                'GT', 'GU', 'HN', 'MX',
                'NI', 'PA', 'PE', 'PR',
                'PY', 'SV', 'UY', 'VE'
            ];

            // spanish-speaking countries
            if (countriesES.includes(countryCode)) {
                request.uri = pathSP + request.uri;    
                
            // default to english
            } else {
                request.uri = pathEN + request.uri;
            }
        }
    }

    callback(null, request);
};