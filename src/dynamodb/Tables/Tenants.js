import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Tenants = {
    TableName: 'v1xTenants',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
}