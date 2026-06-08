import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as logs from 'aws-cdk-lib/aws-logs';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sesActions from 'aws-cdk-lib/aws-ses-actions';
import * as sns from 'aws-cdk-lib/aws-sns';
import * as snsSubscriptions from 'aws-cdk-lib/aws-sns-subscriptions';
import { Duration, RemovalPolicy } from 'aws-cdk-lib';

const policies = {
    cognito : [
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminSetUserPassword",
        "cognito-idp:CreateGroup",
        "cognito-idp:AdminAddUserToGroup",
        'cognito-idp:AdminInitiateAuth',
        "cognito-idp:AdminListGroupsForUser",
        "cognito-idp:ListUsers"
    ],
    dynamodb: [
        'dynamodb:PutItem',
        "dynamodb:GetItem",
        'dynamodb:Scan',
        'dynamodb:UpdateItem',
        'dynamodb:Query',
        'dynamodb:DeleteItem',
        'dynamodb:BatchGetItem'
    ],
    ses: ['ses:SendEmail'],
    lambda: ["lambda:InvokeFunction"],
    api: ["execute-api:Invoke", "execute-api:ManageConnections"],
    s3: ["s3:GetObject", "s3:PutObject"],
    bedrock: [
        "bedrock:InvokeModel",
        "bedrock:Converse",
    ],
    secret: [
        "secretsmanager:GetSecretValue"
    ]
}

const permissions = [
    { actions: [...policies.cognito], resources: ['*'] },
    { actions: [...policies.dynamodb], resources: ['*'] },
    { actions: [...policies.ses], resources: ['*'] },
    { actions: [...policies.lambda], resources: ['*'] },
    { actions: [...policies.api], resources: ['*'] },
    { actions: [...policies.s3], resources: ['*'] },
    { actions: [...policies.bedrock], resources: ['*'] },
    { actions: [...policies.secret], resources: ['*'] },
    { actions: ['textract:StartDocumentTextDetection', 'textract:DetectDocumentText', 'textract:GetDocumentTextDetection'], resources: ['*'] },
];

export const createBackendLambda = (scope) => {
    const role = new iam.Role(scope, `BackendLambdaRole`, {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
        ]
    });

    permissions.forEach((perm) => {
        role.addToPolicy(new iam.PolicyStatement({
            actions: perm.actions,
            resources: perm.resources,
        }));
    });

    return new lambda.Function(scope, 'cdk-backend-lambda', {
        functionName: 'v1xBackend',
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler.handler',
        code: lambda.Code.fromAsset("../backend", { exclude: ["node_modules/geoip-lite/data", ".git", "node_modules/.cache", "node_modules/.bin", "**/node_modules/.bin"] }),
        role: role,
        timeout: Duration.seconds(300),
        environment: {
            TOOLS_API_KEY: process.env.TOOLS_API_KEY || '',
            PULSE_ADMIN_TOKEN: process.env.PULSE_ADMIN_TOKEN || '',
        },
    });
}

// Single Lambda hosting the 7 in-app agents (taco-nudge, good-vibes, mini-me,
// church-lady, welcome-wagon, matchmaker, elephant). Invoked by EventBridge
// schedules (see src/schedules) and on-demand. Same broad data-plane permissions
// as the backend, plus sns:Publish for SMS escalation (mini-me / church-lady).
export const createAgentsLambda = (scope) => {
    const role = new iam.Role(scope, `AgentsLambdaRole`, {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
        ]
    });

    permissions.forEach((perm) => {
        role.addToPolicy(new iam.PolicyStatement({
            actions: perm.actions,
            resources: perm.resources,
        }));
    });

    // SNS publish for SMS escalation — scoped to this role only so the other
    // Lambdas' IAM is unchanged.
    role.addToPolicy(new iam.PolicyStatement({
        actions: ['sns:Publish'],
        resources: ['*'],
    }));

    return new lambda.Function(scope, 'cdk-agents-lambda', {
        functionName: 'v1xAgents',
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'handler.handler',
        code: lambda.Code.fromAsset("../superserious-agents", { exclude: [".git", "node_modules/.cache"] }),
        role: role,
        timeout: Duration.seconds(300),
        // Import the conventional log group instead of letting the
        // useCdkManagedLogGroup feature flag create one — that flag's managed
        // LogGroup collides (AlreadyExists) with the group Lambda provisions for
        // the function. Passing an explicit logGroup skips the create entirely
        // and leaves logging unmanaged, matching the other Lambdas in this stack.
        logGroup: logs.LogGroup.fromLogGroupName(scope, 'AgentsLambdaLogGroup', '/aws/lambda/v1xAgents'),
    });
}

export const createSocketLambda = (scope) => {
    const role = new iam.Role(scope, `SocketLambdaRole`, {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
        ]
    });

    permissions.forEach((perm) => {
        role.addToPolicy(new iam.PolicyStatement({
            actions: perm.actions,
            resources: perm.resources,
        }));
    });

    return new lambda.Function(scope, 'cdk-socket-lambda', {
        functionName: 'v1xSocket',
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'socket-handler.handler',
        code: lambda.Code.fromAsset("../backend", { exclude: ["node_modules/geoip-lite/data", ".git", "node_modules/.cache", "node_modules/.bin", "**/node_modules/.bin"] }),
        role: role,
        timeout: Duration.seconds(300),
    });
}

// Inbound email pipeline: S3 bucket (raw messages) + processing Lambda + SES receipt rule.
// NOTE: SES receipt rule sets are not auto-activated by CloudFormation — after deploy,
// set "v1x-inbound-rules" active once (SES console → Email receiving), and the
// save.superserious.com MX + DKIM DNS must be in place for mail to arrive.
export const createInboundEmail = (scope, textract) => {
    const bucket = new s3.Bucket(scope, 'cdk-email-inbound-bucket', {
        removalPolicy: RemovalPolicy.DESTROY,
        blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
        lifecycleRules: [{ expiration: Duration.days(30) }],
    });

    const role = new iam.Role(scope, 'InboundEmailLambdaRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [
            iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')
        ]
    });

    permissions.forEach((perm) => {
        role.addToPolicy(new iam.PolicyStatement({
            actions: perm.actions,
            resources: perm.resources,
        }));
    });

    // Allow the handler to hand the Textract service role to Textract when starting a job.
    if (textract?.roleArn) {
        role.addToPolicy(new iam.PolicyStatement({
            actions: ['iam:PassRole'],
            resources: [textract.roleArn],
        }));
    }

    const fn = new lambda.Function(scope, 'cdk-inbound-email-lambda', {
        functionName: 'v1xInboundEmail',
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'inbound-email-handler.handler',
        code: lambda.Code.fromAsset("../backend", { exclude: ["node_modules/geoip-lite/data", ".git", "node_modules/.cache", "node_modules/.bin", "**/node_modules/.bin"] }),
        role: role,
        timeout: Duration.seconds(120),
        memorySize: 1024, // headroom for the mupdf (WASM) PDF render used for cover thumbnails
        environment: {
            INBOUND_EMAIL_BUCKET: bucket.bucketName,
            INBOUND_EMAIL_PREFIX: 'inbound/',
            ...(textract ? { TEXTRACT_SNS_TOPIC_ARN: textract.topicArn, TEXTRACT_ROLE_ARN: textract.roleArn } : {}),
        },
    });
    bucket.grantRead(fn);

    // SES executes actions in order: store the raw message to S3, then invoke the Lambda.
    const ruleSet = new ses.ReceiptRuleSet(scope, 'cdk-email-receipt-ruleset', {
        receiptRuleSetName: 'v1x-inbound-rules',
        rules: [
            {
                recipients: ['save.superserious.com'],
                scanEnabled: true,
                actions: [
                    new sesActions.S3({ bucket, objectKeyPrefix: 'inbound/' }),
                    new sesActions.Lambda({ function: fn, invocationType: sesActions.LambdaInvocationType.EVENT }),
                ],
            },
        ],
    });

    return { bucket, fn, ruleSet };
}

// Textract OCR for scanned PDFs: an SNS topic Textract notifies on completion, a service role
// Textract assumes to publish, and a callback Lambda that writes the OCR'd text back onto the
// saved item. The inbound handler starts jobs with NotificationChannel → this topic/role.
export const createTextractOcr = (scope) => {
    const topic = new sns.Topic(scope, 'cdk-textract-topic');

    // Role Textract assumes to publish completion notifications to the topic.
    const serviceRole = new iam.Role(scope, 'TextractServiceRole', {
        assumedBy: new iam.ServicePrincipal('textract.amazonaws.com'),
    });
    topic.grantPublish(serviceRole);

    // Callback Lambda: fetches results + updates the item. Same backend asset + permission set.
    const role = new iam.Role(scope, 'TextractCallbackRole', {
        assumedBy: new iam.ServicePrincipal('lambda.amazonaws.com'),
        managedPolicies: [iam.ManagedPolicy.fromAwsManagedPolicyName('service-role/AWSLambdaBasicExecutionRole')],
    });
    permissions.forEach((perm) => {
        role.addToPolicy(new iam.PolicyStatement({ actions: perm.actions, resources: perm.resources }));
    });

    const fn = new lambda.Function(scope, 'cdk-textract-callback-lambda', {
        functionName: 'v1xTextractCallback',
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'textract-callback-handler.handler',
        code: lambda.Code.fromAsset("../backend", { exclude: ["node_modules/geoip-lite/data", ".git", "node_modules/.cache", "node_modules/.bin", "**/node_modules/.bin"] }),
        role: role,
        timeout: Duration.seconds(120),
    });
    topic.addSubscription(new snsSubscriptions.LambdaSubscription(fn));

    return { topic, topicArn: topic.topicArn, serviceRole, roleArn: serviceRole.roleArn, fn };
}