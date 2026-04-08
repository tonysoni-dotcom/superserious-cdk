import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const ModeratorAccounts = {
    TableName: 'v1xModeratorAccounts',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    indices: []
}
