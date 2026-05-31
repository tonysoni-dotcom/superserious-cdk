import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as ses from 'aws-cdk-lib/aws-ses';
import * as sesActions from 'aws-cdk-lib/aws-ses-actions';
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
        code: lambda.Code.fromAsset("../backend", { exclude: ["node_modules/geoip-lite/data", ".git", "node_modules/.cache"] }),
        role: role,
        timeout: Duration.seconds(300),
        environment: {
            TOOLS_API_KEY: process.env.TOOLS_API_KEY || '',
            PULSE_ADMIN_TOKEN: process.env.PULSE_ADMIN_TOKEN || '',
        },
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
        code: lambda.Code.fromAsset("../backend", { exclude: ["node_modules/geoip-lite/data", ".git", "node_modules/.cache"] }),
        role: role,
        timeout: Duration.seconds(300),
    });
}

// Inbound email pipeline: S3 bucket (raw messages) + processing Lambda + SES receipt rule.
// NOTE: SES receipt rule sets are not auto-activated by CloudFormation — after deploy,
// set "v1x-inbound-rules" active once (SES console → Email receiving), and the
// save.superserious.com MX + DKIM DNS must be in place for mail to arrive.
export const createInboundEmail = (scope) => {
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

    const fn = new lambda.Function(scope, 'cdk-inbound-email-lambda', {
        functionName: 'v1xInboundEmail',
        runtime: lambda.Runtime.NODEJS_20_X,
        handler: 'inbound-email-handler.handler',
        code: lambda.Code.fromAsset("../backend", { exclude: ["node_modules/geoip-lite/data", ".git", "node_modules/.cache"] }),
        role: role,
        timeout: Duration.seconds(120),
        environment: {
            INBOUND_EMAIL_BUCKET: bucket.bucketName,
            INBOUND_EMAIL_PREFIX: 'inbound/',
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