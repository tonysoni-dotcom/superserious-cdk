import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const TACOAnswers = {
    TableName: 'v1xTACOAnswers',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: {name: 'userId', type: dynamodb.AttributeType.STRING},
}