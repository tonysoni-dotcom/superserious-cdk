import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const ScreenedContent = {
    TableName: 'v1xScreenedContent',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'contentKey', type: dynamodb.AttributeType.STRING },
    indices: []
}
