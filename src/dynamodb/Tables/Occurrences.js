import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xOccurrences — a single dated instance of a Plan. A one-off Plan has one occurrence;
// a standing Plan generates one per cycle. PK planId / SK occurrenceId.
// GSI "byStart" (tenantId, scheduledStart) lets the planning agent sweep upcoming
// occurrences across the tenant to send reminders and self-propose the next cycle.
export const Occurrences = {
    TableName: 'v1xOccurrences',
    partitionKey: { name: 'planId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'occurrenceId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byStart',
            partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'scheduledStart', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
