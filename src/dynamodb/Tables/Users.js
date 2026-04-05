import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Users = {
    TableName: 'v1xUsers',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: {name: 'userId', type: dynamodb.AttributeType.STRING},
}