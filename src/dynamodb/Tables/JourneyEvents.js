import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xJourneyEvents — the generalized member-journey timeline (Phase 2.5): how a member
// evolves and what they contribute over time, per community. Distinct from the elephant
// agent's coaching-journey (v1xJourneySummaries, chat-derived). Fed by Gatherings
// contributions (mark-happened), LinkedIn-detected profile changes, and milestones.
// PK memberKey (tenantId#memberId) / SK tsId (zero-padded-ts#uuid) → a member's timeline
// newest-first. GSI "byCommunity" (tenantCommunityId, createdAt) for a community-wide view.
export const JourneyEvents = {
    TableName: 'v1xJourneyEvents',
    partitionKey: { name: 'memberKey', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'tsId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byCommunity',
            partitionKey: { name: 'tenantCommunityId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
