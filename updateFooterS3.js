'use strict';

const aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});
const s3 = new aws.S3({});

exports.handler = updateFooterS3;

async function updateFooterS3() {
    let response;
    try {
        const bucket = 'curtcommander-personal-website';
        const key = 'html/footer.html';
        let html = await getS3Object(bucket, key);
        
        const tag = html.match('<p id="copyright">.*?</p>')[0];
        const newTagVal = `\u00A9 Curt Commander | ${new Date().getFullYear()}`; 
        const newTag = `<p id="copyright">${newTagVal}</p>`;
        html = html.replace(tag, newTag);

        await putS3Object(bucket, key, html);

        response = {
            statusCode: 200,
            body: 'successfully updated footer'
        };
    } catch (err) {
        response = {
            statusCode: 500,
            body: err.stack
        };
    }
    return response;
}

async function getS3Object(bucket, key) {
    const params = {
        Bucket: bucket,
        Key: key
    };
    return new Promise((resolve, reject) => {
        s3.getObject(params, (err, data) => {
            if (err) reject(err);
            resolve(data.Body.toString());
        });
    });
}

async function putS3Object(bucket, key, data) {
    const params = {
        Bucket: bucket,
        Key: key,
        Body: data
    };
    return new Promise((resolve, reject) => {
        s3.putObject(params, (err) => {
            if (err) reject(err);
            resolve();
        });
    });
}
