import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xCommitments — per member, per occurrence commitment state
// (interested | committed | declined | attended | noshowed). One row per (occurrence, member),
// so a re-commit is an idempotent overwrite. PK occurrenceId / SK memberId.
// GSI "byMember" (memberKey = tenantId#memberId, updatedAt) powers a member's own
// "what am I in for" view and the Principle-5 export.
export const Commitments = {
    TableName: 'v1xCommitments',
    partitionKey: { name: 'occurrenceId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'memberId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byMember',
            partitionKey: { name: 'memberKey', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'updatedAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
