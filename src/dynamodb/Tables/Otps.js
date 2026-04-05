import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Otps = {
    TableName: 'v1xOtps',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    ttl: 'expires_at'
}