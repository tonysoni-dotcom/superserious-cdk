import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const SiteReferrals = {
    TableName: 'v1xSiteReferrals',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'referralId', type: dynamodb.AttributeType.STRING },
}
