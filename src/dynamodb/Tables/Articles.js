import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Articles = {
    TableName: 'v1xArticles',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: {name: 'articleId', type: dynamodb.AttributeType.STRING},
    indices: [
        {
            indexName: 'SavedVsPublished',
            partitionKey: { name: 'tenantPublishStatus', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}