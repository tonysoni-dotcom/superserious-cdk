import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const JourneySummaries = {
    TableName: 'v1xJourneySummaries',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'menteeUserId', type: dynamodb.AttributeType.STRING },
    indices: []
}
