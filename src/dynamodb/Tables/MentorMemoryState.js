import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const MentorMemoryState = {
    TableName: 'v1xMentorMemoryState',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'chatId', type: dynamodb.AttributeType.STRING },
    indices: []
}
