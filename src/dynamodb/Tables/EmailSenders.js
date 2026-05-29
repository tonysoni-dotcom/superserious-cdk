import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const EmailSenders = {
    TableName: 'v1xEmailSenders',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    // userSender = `${userId}#${senderEmailLower}` — per-curator allowlist + pending tray.
    sortKey: { name: 'userSender', type: dynamodb.AttributeType.STRING },
}
