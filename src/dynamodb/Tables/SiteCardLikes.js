import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const SiteCardLikes = {
    TableName: 'v1xSiteCardLikes',
    partitionKey: { name: 'flip', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'visitorId', type: dynamodb.AttributeType.STRING },
}
