import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const UserCourseProgress = {
    TableName: 'v1xUserCourseProgress',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
}