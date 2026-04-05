import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const ArticlesComments = {
    TableName: 'v1xArticlesComments',
    partitionKey: { name: 'tenantArticleId', type: dynamodb.AttributeType.STRING },
    sortKey: {name: 'commentId', type: dynamodb.AttributeType.STRING},
    indices: [
        {
            indexName: 'SortIndex',
            partitionKey: { name: 'tenantArticleId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}