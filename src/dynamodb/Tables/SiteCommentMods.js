import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const SiteCommentMods = {
    TableName: 'v1xSiteCommentMods',
    partitionKey: { name: 'flip', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'commentId', type: dynamodb.AttributeType.STRING },
}
