import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const PulseEvents = {
    TableName: 'v1xPulseEvents',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'dayTsId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'bySession',
            partitionKey: { name: 'sessionId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'tsMs', type: dynamodb.AttributeType.NUMBER },
        },
        {
            indexName: 'byVisitor',
            partitionKey: { name: 'visitorId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'tsMs', type: dynamodb.AttributeType.NUMBER },
        },
    ],
}
