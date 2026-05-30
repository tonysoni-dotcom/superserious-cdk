import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const EmailSenders = {
    TableName: 'v1xEmailSenders',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userSender', type: dynamodb.AttributeType.STRING },
}
