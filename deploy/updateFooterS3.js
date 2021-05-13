'use strict';

const aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});
const s3 = new aws.S3({});
const codepipeline = new aws.CodePipeline();

let jobId;

exports.handler = updateFooterS3;

async function updateFooterS3(event, context) {
    let jobId;
    try {
        jobId = event["CodePipeline.job"].id;
    } catch {}

    let response;
    const bucket = 'curtcommander-personal-website';
    const langs = ['en', 'sp'];
    for (const lang of langs) {
        try {
            const key = `${lang}/html/footer.html`;
            let html = await getS3Object(bucket, key);
            
            const tag = html.match('<p id="copyright">.*?</p>')[0];
            const newTagVal = `\u00A9 Curt Commander | ${new Date().getFullYear()}`; 
            const newTag = `<p id="copyright">${newTagVal}</p>`;
            html = html.replace(tag, newTag);
    
            await putS3Object(bucket, key, html);

        } catch (err) {
            response = {
                statusCode: 500,
                body: err.stack
            };
            break;
        }
    }

    if (!response) {
        response = {
            statusCode: 200,
            body: 'successfully updated footers'
        };
    }

    if (!jobId) return response;
    if (response.statusCode === 200) {
        await putJobSuccess(response.body);
    } else {
        await putJobFailure(response.body);
    }

    // notify AWS CodePipeline of a successful job
    function putJobSuccess(message) {
        var params = {
            jobId: jobId
        };
        return codepipeline.putJobSuccessResult(params).promise()
        .then(() => context.succeed(message))
        .catch(err => context.fail(err))
    }

    // notify AWS CodePipeline of a failed job
    function putJobFailure(message) {
        var params = {
            jobId: jobId,
            failureDetails: {
                message: JSON.stringify(message),
                type: 'JobFailed',
                externalExecutionId: context.awsRequestId
            }
        };
        return codepipeline.putJobFailureResult(params).promise()
        .then(() => context.fail(message))
    }
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