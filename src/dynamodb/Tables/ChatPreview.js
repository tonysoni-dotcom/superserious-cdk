import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const ChatPreview = {
    TableName: 'v1xChatPreview',
    partitionKey: { name: 'chatPreviewId', type: dynamodb.AttributeType.STRING},
    sortKey: {name: 'chatId', type: dynamodb.AttributeType.STRING},
    indices: [
        {
            indexName: 'sortIndex',
            partitionKey: { name: 'chatPreviewId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'updatedAt', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}