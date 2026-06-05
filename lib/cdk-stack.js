const { Stack } = require('aws-cdk-lib/core');
const { createScopedTables } = require('../src/dynamodb');
const { createBackendLambda, createSocketLambda, createInboundEmail, createTextractOcr, createAgentsLambda } = require('../src/lambda');
const { createAgentSchedules } = require('../src/schedules');
const { createWebsite } = require('../src/website');

class CdkStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const tables = createScopedTables(this);
    const backendLambda = createBackendLambda(this);
    const socketLambda = createSocketLambda(this);
    const website = createWebsite(this);
    const textract = createTextractOcr(this);
    const inboundEmail = createInboundEmail(this, textract);

    // In-app agents: single Lambda + EventBridge schedules. Schedules are created
    // DISABLED — flip createAgentSchedules to { enabled: true } once moderators are
    // seeded and each agent has been validated by manual invocation.
    const agentsLambda = createAgentsLambda(this);
    createAgentSchedules(this, agentsLambda, { enabled: false });
  }
}

module.exports = { CdkStack }
