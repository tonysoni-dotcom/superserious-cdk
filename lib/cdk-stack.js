const { Stack } = require('aws-cdk-lib/core');
const { createScopedTables } = require('../src/dynamodb');
const { createBackendLambda, createSocketLambda } = require('../src/lambda');
const { createWebsite } = require('../src/website');
const { importMediaBucket } = require('../src/media');
const { importCognito } = require('../src/cognito');
const { importConfigSecret } = require('../src/secrets');
const { importHttpApi } = require('../src/apigateway/http-api');
const { importWebSocketApi } = require('../src/apigateway/websocket-api');

class CdkStack extends Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // Data
    const tables = createScopedTables(this);

    // Compute
    const backendLambda = createBackendLambda(this);
    const socketLambda = createSocketLambda(this);

    // Frontend
    const website = createWebsite(this);

    // Existing resources — imported as references (no CloudFormation resources created)
    const mediaBucket = importMediaBucket(this);
    const cognito = importCognito(this);
    const configSecret = importConfigSecret(this);
    const httpApi = importHttpApi(this);
    const wsApi = importWebSocketApi(this);
  }
}

module.exports = { CdkStack }
