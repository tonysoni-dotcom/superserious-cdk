import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Cookbook = {
    TableName: 'v1xCookbook',
    partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'itemKey', type: dynamodb.AttributeType.STRING },
    indices: []
}
