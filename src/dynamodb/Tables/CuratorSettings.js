import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xCuratorSettings — per-curator app settings (PK tenantId / SK userId). Holds the
// daily-services on/off flags (default OFF) that gate recurring LLM cost. No GSI: always
// read by exact (tenantId, userId).
export const CuratorSettings = {
    TableName: 'v1xCuratorSettings',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
}
