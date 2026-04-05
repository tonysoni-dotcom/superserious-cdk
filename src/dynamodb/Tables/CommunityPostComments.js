import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const CommunityPostComments = {
    TableName: 'v1xCommunityPostComments',
    partitionKey: { name: 'tenantCommunityPostId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'commentId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'SortIndex',
            partitionKey: { name: 'tenantCommunityPostId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}
