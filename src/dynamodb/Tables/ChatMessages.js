import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const ChatMessages = {
    TableName: 'v1xChatMessages',
    partitionKey: { name: 'chatId', type: dynamodb.AttributeType.STRING},
    sortKey: {name: 'messageId', type: dynamodb.AttributeType.STRING},
    indices: [
        {
            indexName: 'paginationIndex',
            partitionKey: { name: 'chatId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sentAt', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}