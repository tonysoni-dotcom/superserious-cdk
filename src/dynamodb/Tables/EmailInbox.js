import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const EmailInbox = {
    TableName: 'v1xEmailInbox',
    partitionKey: { name: 'alias', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            // userKey = `${tenantId}#${userId}` — the app fetches a curator's address.
            indexName: 'byUser',
            partitionKey: { name: 'userKey', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
