import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const MatchHistory = {
    TableName: 'v1xMatchHistory',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'pairKey', type: dynamodb.AttributeType.STRING },
    indices: []
}
