import * as s3 from 'aws-cdk-lib/aws-s3';

// Bucket already exists in AWS — import as reference only, no CloudFormation resource created
export const importMediaBucket = (scope) => {
    const bucket = s3.Bucket.fromBucketName(scope, 'SuperseriousMediaBucket', 'superserious-media');
    return { bucket };
};
