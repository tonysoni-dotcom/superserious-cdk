import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const CourseLikes = {
    TableName: 'v1xCourseLikes',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'dayId', type: dynamodb.AttributeType.STRING }
}