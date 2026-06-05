import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const ElephantAssistState = {
    TableName: 'v1xElephantAssistState',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'chatId', type: dynamodb.AttributeType.STRING },
    indices: []
}
