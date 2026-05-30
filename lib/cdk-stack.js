const { Stack, Duration } = require('aws-cdk-lib/core');
const { createScopedTables } = require('../src/dynamodb');
const { createBackendLambda, createSocketLambda } = require('../src/lambda');
const { createWebsite } = require('../src/website');
// const sqs = require('aws-cdk-lib/aws-sqs');

class CdkStack extends Stack {
  /**
   *
   * @param {Construct} scope
   * @param {string} id
   * @param {StackProps=} props
   */
  constructor(scope, id, props) {
    super(scope, id, props);

    // The code that defines your stack goes here

    // example resource
    // const queue = new sqs.Queue(this, 'CdkQueue', {
    //   visibilityTimeout: Duration.seconds(300)
    // });

    const tables = createScopedTables(this);
    const backendApp = createBackendLambda(this);
    const socketApp = createSocketLambda(this);
    const website = createWebsite(this);
  }
}

module.exports = { CdkStack }
