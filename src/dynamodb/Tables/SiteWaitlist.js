import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const SiteWaitlist = {
    TableName: 'v1xSiteWaitlist',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'email', type: dynamodb.AttributeType.STRING },
}
