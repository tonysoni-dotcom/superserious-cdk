import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// Distinct geographic locations each member has used the app from (IP-derived,
// city-level). One item per (user, location) — a member seen repeatedly from the
// same city stays a single item; a new city is a new item (a new data point).
// No TTL: this is durable analytics history (unlike the 7-day v1xAppEvents).
export const UserLocations = {
    TableName: 'v1xUserLocations',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userLocation', type: dynamodb.AttributeType.STRING }, // `${userId}#${country}#${region}#${city}`
}
