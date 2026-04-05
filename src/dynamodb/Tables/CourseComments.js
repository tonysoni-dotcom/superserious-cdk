import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const CourseComments = {
    TableName: 'v1xCourseComments',
    partitionKey: { name: 'tenantDayId', type: dynamodb.AttributeType.STRING },
    sortKey: {name: 'commentId', type: dynamodb.AttributeType.STRING},
    indices: [
        {
            indexName: 'SortIndex',
            partitionKey: { name: 'tenantDayId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'timestamp', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ]
}