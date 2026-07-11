import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// Source of truth for the tenant factory: one item per tenant holding its full
// build/branding profile (identifiers, runtime endpoints, features, appConfig).
// Managed via the admin dashboard (backend /admin/* API) and materialized into
// per-tenant builds by the app's hydrate step. No TTL — durable config.
export const TenantConfigs = {
    TableName: 'v1xTenantConfigs',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
}
