import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xRoleSlots — Gatherings, Principle 2 (Mutual aid). A named contribution an event needs
// (Host, driver, kiln owner, note-taker, supplies…) that a member can claim. Capacity +
// optional waitlist. Claims/waitlist are inline memberId arrays (small scale).
// PK planId / SK roleSlotId — list a plan's needs by querying the plan.
export const RoleSlots = {
    TableName: 'v1xRoleSlots',
    partitionKey: { name: 'planId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'roleSlotId', type: dynamodb.AttributeType.STRING },
}
