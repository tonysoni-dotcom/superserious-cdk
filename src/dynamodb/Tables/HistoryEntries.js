import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xHistoryEntries — the inalienable, member-owned archive of doings the community has
// done together (the run of shows, the firing logs, the canvassing record). Principle 5.
// One entry per completed occurrence. PK tenantCommunityId (tenantId#communityId) /
// SK tsId (zero-padded-timestamp#uuid) lists a community's history newest-first.
// GSI "byPlan" (planId, createdAt) shows a single standing Plan's full run.
// NOTE: deliberately NO ttl — this archive is permanent and belongs to the members.
export const HistoryEntries = {
    TableName: 'v1xHistoryEntries',
    partitionKey: { name: 'tenantCommunityId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'tsId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byPlan',
            partitionKey: { name: 'planId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
