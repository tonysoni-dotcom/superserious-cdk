import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const CourseUserResponses = {
    TableName: 'v1xCourseUserResponses',
    partitionKey: { name: 'responseId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'messageId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'paginationIndex',
            partitionKey: { name: 'responseId', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sentAt', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        },
        {
            indexName: 'dayResponseIndex',
            partitionKey: { name: 'responseIdByDay', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'sentAt', type: dynamodb.AttributeType.STRING },
            projectionType: dynamodb.ProjectionType.ALL,
        }
    ]
}