import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const OwnerChatAssist = {
    TableName: 'v1xOwnerChatAssist',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'chatId', type: dynamodb.AttributeType.STRING },
    indices: []
}
