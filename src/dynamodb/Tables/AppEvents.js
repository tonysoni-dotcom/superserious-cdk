import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const AppEvents = {
    TableName: 'v1xAppEvents',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'tsId', type: dynamodb.AttributeType.STRING },
    ttl: 'ttl',
}
