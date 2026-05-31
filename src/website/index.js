const s3 = require('aws-cdk-lib/aws-s3');
const cloudfront = require('aws-cdk-lib/aws-cloudfront');
const origins = require('aws-cdk-lib/aws-cloudfront-origins');
const acm = require('aws-cdk-lib/aws-certificatemanager');
const { CfnOutput, Stack } = require('aws-cdk-lib');

const API_GATEWAY_DOMAIN = '71lvzho52a.execute-api.us-east-1.amazonaws.com';
const CERT_ARN = 'arn:aws:acm:us-east-1:260319374997:certificate/081272d9-7bd7-4362-8e6b-cab37654ace6';
const DOMAIN_NAMES = ['superserious.com', 'www.superserious.com'];

const createWebsite = (scope) => {
    const bucket = s3.Bucket.fromBucketName(scope, 'SuperseriousWebsiteBucket', 'superserious-website');

    const certificate = acm.Certificate.fromCertificateArn(scope, 'SuperseriousCert', CERT_ARN);

    const directoryIndexFn = new cloudfront.Function(scope, 'SuperseriousDirectoryIndex', {
        functionName: 'superserious-directory-index',
        code: cloudfront.FunctionCode.fromInline(
            `function handler(event) {
    var req = event.request;
    var uri = req.uri;
    if (uri.endsWith('/')) req.uri = uri + 'index.html';
    else if (!uri.includes('.')) req.uri = uri + '/index.html';
    return req;
}`
        ),
        runtime: cloudfront.FunctionRuntime.JS_2_0,
    });

    // Strips /api prefix before forwarding to API Gateway (/dev).
    // Without this, /api/X hits /dev/api/X → 404; with it, /api/X → /dev/X.
    const stripApiPrefixFn = new cloudfront.Function(scope, 'SuperseriousStripApi', {
        functionName: 'superserious-strip-api',
        code: cloudfront.FunctionCode.fromInline(
            `function handler(event) {
    var req = event.request;
    var uri = req.uri;
    if (uri.indexOf('/api/') === 0) req.uri = uri.substring(4);
    else if (uri === '/api') req.uri = '/';
    return req;
}`
        ),
        runtime: cloudfront.FunctionRuntime.JS_2_0,
    });

    const oac = new cloudfront.S3OriginAccessControl(scope, 'SuperseriousOAC', {
        originAccessControlName: 'superserious-oac',
    });

    const apiOrigin = new origins.HttpOrigin(API_GATEWAY_DOMAIN, {
        originPath: '/dev',
    });

    const distribution = new cloudfront.Distribution(scope, 'SuperseriousDistribution', {
        defaultRootObject: 'index.html',
        domainNames: DOMAIN_NAMES,
        certificate,
        defaultBehavior: {
            origin: origins.S3BucketOrigin.withOriginAccessControl(bucket, {
                originAccessControl: oac,
            }),
            viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
            functionAssociations: [{
                function: directoryIndexFn,
                eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
            }],
            cachePolicy: cloudfront.CachePolicy.CACHING_OPTIMIZED,
        },
        additionalBehaviors: {
            '/api/*': {
                origin: apiOrigin,
                viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
                cachePolicy: cloudfront.CachePolicy.CACHING_DISABLED,
                originRequestPolicy: cloudfront.OriginRequestPolicy.ALL_VIEWER_EXCEPT_HOST_HEADER,
                allowedMethods: cloudfront.AllowedMethods.ALLOW_ALL,
                functionAssociations: [{
                    function: stripApiPrefixFn,
                    eventType: cloudfront.FunctionEventType.VIEWER_REQUEST,
                }],
            },
        },
    });

    // Explicitly create the bucket policy so CloudFront OAC can read S3
    // (CDK can't auto-update the policy on an imported bucket)
    new s3.CfnBucketPolicy(scope, 'WebsiteBucketPolicy', {
        bucket: 'superserious-website',
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Effect: 'Allow',
                Principal: { Service: 'cloudfront.amazonaws.com' },
                Action: 's3:GetObject',
                Resource: 'arn:aws:s3:::superserious-website/*',
                Condition: {
                    StringEquals: {
                        'AWS:SourceArn': `arn:aws:cloudfront::${Stack.of(scope).account}:distribution/${distribution.distributionId}`,
                    },
                },
            }],
        },
    });

    new CfnOutput(scope, 'WebsiteDistributionDomain', {
        value: distribution.distributionDomainName,
        description: 'Point www CNAME and apex ALIAS here',
    });

    new CfnOutput(scope, 'WebsiteDistributionId', {
        value: distribution.distributionId,
        description: 'Use for cache invalidation',
    });

    return { bucket, distribution };
};

module.exports = { createWebsite };
