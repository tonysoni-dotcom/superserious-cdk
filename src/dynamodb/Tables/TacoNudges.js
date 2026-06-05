import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const TacoNudges = {
    TableName: 'v1xTacoNudges',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    indices: []
}
