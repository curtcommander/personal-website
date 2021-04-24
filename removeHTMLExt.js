'use strict';

const aws = require('aws-sdk');
aws.config.update({region: 'us-east-1'});

const s3 = new aws.S3({});
const codepipeline = new aws.CodePipeline();
let jobId;

exports.handler = removeHTMLExt;

async function removeHTMLExt(event) {
    jobId = event["CodePipeline.job"].id;    
    const bucket = 'curtcommander-personal-website';
    const baseNames = ['career', 'projects', 'wilmington-shootings'];
    let errBool = false;
    for (const baseName of baseNames) {
        if (!errBool) break;
        const params = {
            Bucket: bucket,
            CopySource: `${bucket}/${baseName}.html`,
            Key: baseName,
            ContentType: 'text/html'
        }

        await s3.copyObject(params).promise()
        .then(() => {
            return s3.deleteObject({Bucket: bucket, Key: `${baseName}.html`}).promise();
        })
        .catch(async err => {
            errBool = true;
            await putJobFailure(err.stack);
        })
    }
    await putJobSuccess('html extensions removed from website pages');
}

// Notify AWS CodePipeline of a successful job
function putJobSuccess(message) {
    var params = {
        jobId: jobId
    };
    return codepipeline.putJobSuccessResult(params).promise()
    .then(() => context.succeed(message))
    .catch(err => context.fail(err))
}

// Notify AWS CodePipeline of a failed job
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