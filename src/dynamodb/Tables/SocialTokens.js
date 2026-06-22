import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const SocialTokens = {
    TableName: 'v1xSocialTokens',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userPlatform', type: dynamodb.AttributeType.STRING },
}
