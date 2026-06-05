import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// good-vibes schedules each moderator like/comment with a future ISO timestamp
// (scheduledAt). The execute step queries scheduledTimeIndex for actions whose
// scheduledAt has passed. scheduledAt is an ISO string, compared lexicographically.
export const ScheduledLikes = {
    TableName: 'v1xScheduledLikes',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'likeId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'scheduledTimeIndex',
            partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'scheduledAt', type: dynamodb.AttributeType.STRING },
        },
    ],
}
