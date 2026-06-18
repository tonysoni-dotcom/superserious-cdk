import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xMuseDrafts — publish-ready pieces Muse generates from a deck's top-2 cards.
// GSI "byUser" lists a curator's drafts newest-first.
export const MuseDrafts = {
    TableName: 'v1xMuseDrafts',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'draftId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byUser',
            partitionKey: { name: 'userKey', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
