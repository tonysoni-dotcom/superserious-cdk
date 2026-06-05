import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const MentorWisdom = {
    TableName: 'v1xMentorWisdom',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'wisdomId', type: dynamodb.AttributeType.STRING },
    indices: []
}
