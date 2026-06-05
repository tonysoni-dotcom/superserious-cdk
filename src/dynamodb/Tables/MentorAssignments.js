import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const MentorAssignments = {
    TableName: 'v1xMentorAssignments',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    indices: []
}
