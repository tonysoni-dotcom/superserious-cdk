import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Connections = {
    TableName: 'v1xConnections',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'ConnectionUsers',
            partitionKey: { name: 'connectionId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}