import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xPlanMessages — the per-plan thread. Discussion exists ONLY as a property of a Plan
// (not a standalone board/feed — see the anti-patterns). PK planId / SK messageId.
// GSI "byTime" (planId, sentAt) paginates a plan's thread newest-first.
export const PlanMessages = {
    TableName: 'v1xPlanMessages',
    partitionKey: { name: 'planId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'messageId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byTime',
            partitionKey: { name: 'planId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sentAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
