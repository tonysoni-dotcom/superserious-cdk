import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const InviteRequests = {
    TableName: 'v1xInviteRequests',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'requestId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            // Per-IP abuse guard on the public endpoint: count recent requests
            // from one IP within a rolling window. Items without an `ip` attribute
            // are simply absent from this index.
            indexName: 'byIp',
            partitionKey: { name: 'ip', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
