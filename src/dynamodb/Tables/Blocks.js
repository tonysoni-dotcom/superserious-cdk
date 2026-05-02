import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Blocks = {
    TableName: 'v1xBlocks',
    partitionKey: { name: 'tenantBlockerId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'blockedId', type: dynamodb.AttributeType.STRING },
}
