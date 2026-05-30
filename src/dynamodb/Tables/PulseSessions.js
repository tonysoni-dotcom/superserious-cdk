import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const PulseSessions = {
    TableName: 'v1xPulseSessions',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byStartTs',
            partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'startTsMs', type: dynamodb.AttributeType.NUMBER },
        },
    ],
}
