import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';
import { RemovalPolicy, CfnOutput } from 'aws-cdk-lib';

export const createWebsite = (scope) => {
    const bucket = new s3.Bucket(scope, 'SuperseriousWebsiteBucket', {
        bucketName: 'superserious-website',
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        removalPolicy: RemovalPolicy.RETAIN,
    });

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

    const oac = new cloudfront.S3OriginAccessControl(scope, 'SuperseriousOAC', {
        originAccessControlName: 'superserious-oac',
    });

    const distribution = new cloudfront.Distribution(scope, 'SuperseriousDistribution', {
        defaultRootObject: 'index.html',
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
    });

    new CfnOutput(scope, 'WebsiteBucketName', {
        value: bucket.bucketName,
        description: 'S3 bucket — target for aws s3 sync in deploy.sh',
    });

    new CfnOutput(scope, 'WebsiteDistributionId', {
        value: distribution.distributionId,
        description: 'CloudFront distribution ID — used by deploy.sh for cache invalidation',
    });

    new CfnOutput(scope, 'WebsiteURL', {
        value: `https://${distribution.distributionDomainName}`,
        description: 'CloudFront domain — point DNS CNAME/ALIAS here',
    });

    return { bucket, distribution };
};
