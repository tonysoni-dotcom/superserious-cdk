import * as cognito from 'aws-cdk-lib/aws-cognito';

export const importCognito = (scope) => {
    const userPool = cognito.UserPool.fromUserPoolId(
        scope,
        'SuperseriousCognito',
        process.env.USER_POOL_ID,
    );
    const client = cognito.UserPoolClient.fromUserPoolClientId(
        scope,
        'SuperseriousCognitoClient',
        process.env.CLIENT_ID,
    );
    return { userPool, client };
};
