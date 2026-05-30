import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as iam from 'aws-cdk-lib/aws-iam';
import { Duration } from 'aws-cdk-lib';

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
        code: lambda.Code.fromAsset("../backend"),
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
        code: lambda.Code.fromAsset("../backend"),
        role: role,
        timeout: Duration.seconds(300),
    });
}