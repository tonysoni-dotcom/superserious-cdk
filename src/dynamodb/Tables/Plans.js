import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xPlans — "Gatherings": the planning surface engine. A Plan is a scheduled doing the
// community organizes and shows up for (a Show, a Studio Night, a Shift, a Workout — the
// user-facing label comes from planningConfig). PK tenantId / SK planId.
// GSI "byCommunity" (tenantCommunityId = tenantId#communityId, createdAt) lists a
// community's plans newest-first.
export const Plans = {
    TableName: 'v1xPlans',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'planId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byCommunity',
            partitionKey: { name: 'tenantCommunityId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
