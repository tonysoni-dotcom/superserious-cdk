import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xChatRooms — source of truth for GROUP chat membership + metadata. 1-on-1 DMs keep
// their sorted pair-key chatId and have NO room record (fully backward-compatible). A group's
// chatId is a UUID (no '#'), which is how the chat code tells a group from a DM.
// Fetched by exact (tenantId, chatId); the per-user inbox is the existing v1xChatPreview.
export const ChatRooms = {
    TableName: 'v1xChatRooms',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'chatId', type: dynamodb.AttributeType.STRING },
}
