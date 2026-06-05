import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const EvaluatedContent = {
    TableName: 'v1xEvaluatedContent',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'contentKey', type: dynamodb.AttributeType.STRING },
    indices: []
}
