'use strict';

const countriesES = [
    'AR', 'BO', 'BZ', 'CL',
    'CO', 'CR', 'CU', 'DO',
    'EC', 'EH', 'ES', 'GQ',
    'GT', 'GU', 'HN', 'MX',
    'NI', 'PA', 'PE', 'PR',
    'PY', 'SV', 'UY', 'VE'
];

// lambda@edge function
// edgelambda.amazonaws.com needs to be able
// to assume execution role
exports.handler = (event, context, callback) => {
    const request = event.Records[0].cf.request;
    const headers = request.headers;
    const partsUri = request.uri.split('/').slice(1);
    
    // wilmington shootings
    if (request.uri === '/wilmington-shootings/') {
        request.uri = '/wilmington-shootings/index.html';
    
    // serve language-specific content for html files (not index.html)
    } else if (headers['cloudfront-viewer-country']
        && partsUri[0] === 'html'
        && !['en', 'sp'].includes(partsUri[1])
    ) {
        const countryCode = headers['cloudfront-viewer-country'][0].value;

        // spanish-speaking countries
        if (countriesES.includes(countryCode)) {
            request.uri = `/html/sp/${request.uri.slice(6)}`;
            
        // default to english
        } else {
            request.uri = `/html/en/${request.uri.slice(6)}`;
        }
    }

    callback(null, request);
};
