import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const ChatBots = {
    TableName: 'v1xChatBots',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING},
    sortKey: {name: 'botId', type: dynamodb.AttributeType.STRING},
}