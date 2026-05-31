import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const PulseEvents = {
    TableName: 'v1xActivity',
    partitionKey: { name: 'tenantDay', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'eventKey', type: dynamodb.AttributeType.STRING },
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
