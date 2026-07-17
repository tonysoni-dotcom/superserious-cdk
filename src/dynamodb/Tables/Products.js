import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// Marketplace products, one item per (tenant, product). Each tenant's storefront is
// scoped by tenantId; products are managed via the admin API and read by the app.
export const Products = {
    TableName: 'v1xProducts',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'productId', type: dynamodb.AttributeType.STRING },
}
