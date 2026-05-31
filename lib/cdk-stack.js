const { Stack } = require('aws-cdk-lib/core');
const { createScopedTables } = require('../src/dynamodb');
const { createBackendLambda, createSocketLambda, createInboundEmail } = require('../src/lambda');
const { createWebsite } = require('../src/website');

class CdkStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const tables = createScopedTables(this);
    const backendLambda = createBackendLambda(this);
    const socketLambda = createSocketLambda(this);
    const website = createWebsite(this);
    const inboundEmail = createInboundEmail(this);
  }
}

module.exports = { CdkStack }
