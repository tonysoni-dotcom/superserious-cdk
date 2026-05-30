import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const SiteComments = {
    TableName: 'v1xSiteComments',
    partitionKey: { name: 'flip', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'commentId', type: dynamodb.AttributeType.STRING },
}
