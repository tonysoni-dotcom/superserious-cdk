import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const CourseInfo = {
    TableName: 'v1xCourseInfo',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
}