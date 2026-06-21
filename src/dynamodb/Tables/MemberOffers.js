import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xMemberOffers — a member's consented offers (skills + resources) the agent matches
// against open role-slots. One doc per member. PK tenantId / SK memberId — query by
// tenantId to gather every member's offers for a matching pass.
export const MemberOffers = {
    TableName: 'v1xMemberOffers',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'memberId', type: dynamodb.AttributeType.STRING },
}
