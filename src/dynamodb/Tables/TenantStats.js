import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const TenantStats = {
    TableName: 'v1xTenantStats',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'date', type: dynamodb.AttributeType.STRING },
}
