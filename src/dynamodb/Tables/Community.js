import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Community = {
    TableName: 'v1xCommunity',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING},
    sortKey: {name: 'communityId', type: dynamodb.AttributeType.STRING},
    indices: [
        {
            indexName: 'listingIndex',
            partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'listIndex', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}