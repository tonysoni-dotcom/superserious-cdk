const { Stack } = require('aws-cdk-lib/core');
const fs = require('fs');
const path = require('path');
const { createScopedTables } = require('../src/dynamodb');
const { createBackendLambda, createSocketLambda, createInboundEmail, createTextractOcr, createAgentsLambda } = require('../src/lambda');
const { createAgentSchedules } = require('../src/schedules');
const { createWebsite } = require('../src/website');

const agentsDir = path.resolve(__dirname, '../../superserious-agents');

class CdkStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const tables = createScopedTables(this);
    const backendLambda = createBackendLambda(this);
    const socketLambda = createSocketLambda(this);
    const website = createWebsite(this);
    const textract = createTextractOcr(this);
    const inboundEmail = createInboundEmail(this, textract);

    if (fs.existsSync(agentsDir)) {
      const agentsLambda = createAgentsLambda(this);
      createAgentSchedules(this, agentsLambda, { enabled: false });
    }
  }
}

module.exports = { CdkStack }
