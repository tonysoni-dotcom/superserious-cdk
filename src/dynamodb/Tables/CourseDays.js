import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const CourseDays = {
    TableName: 'v1xCourseDays',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'day', type: dynamodb.AttributeType.STRING },
}