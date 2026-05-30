import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const SavedItems = {
    TableName: 'v1xSavedItems',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'savedItemId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byUser',
            partitionKey: { name: 'userKey', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
