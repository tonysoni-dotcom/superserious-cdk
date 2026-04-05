import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const CommunityPosts = {
    TableName: 'v1xCommunityPosts',
    partitionKey: { name: 'tenantCommunityId', type: dynamodb.AttributeType.STRING},
    sortKey: {name: 'postId', type: dynamodb.AttributeType.STRING},
    indices: [
        {
            indexName: 'paginationIndex',
            partitionKey: { name: 'tenantCommunityId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}
