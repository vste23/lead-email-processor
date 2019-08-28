'use strict';

var AWS = require('aws-sdk');
var s3 = new AWS.S3();
var simpleParser = require('mailparser').simpleParser;

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Context doc: https://docs.aws.amazon.com/lambda/latest/dg/nodejs-prog-model-context.html 
 * @param {Object} context
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 * 
 */
exports.lambdaHandler = async (event, context, callback) => {
    try {
        console.log("process.env.ENV", process.env.ENV);
        if (process.env.ENV === "development") {
            console.log(JSON.stringify(event));
            console.log(JSON.stringify(event.Records));
        }

        const s3Object = event.Records[0].s3.object;
        const s3Bucket = event.Records[0].s3.bucket;
    
        // Retrieve the email from your bucket
        const req = {
            Bucket: s3Bucket.name,
            Key: s3Object.key
        };

        const rawEmailObject = await s3.getObject(req).promise();

        // Custom email processing goes here
        const parsed = await simpleParser(rawEmailObject.Body);

        if (process.env.ENV === "development") {
            console.log("date:", parsed.date);
            console.log("subject:", parsed.subject);
            console.log("body:", parsed.text);
            console.log("from:", parsed.from.text);
            console.log("attachments:", parsed.attachments);
        }
        return null;
    } catch(err) {
        console.log(err);
        console.log(err, err.stack);
        return e;
    }
};