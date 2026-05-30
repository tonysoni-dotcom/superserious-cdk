import * as secretsmanager from 'aws-cdk-lib/aws-secretsmanager';

export const importConfigSecret = (scope) => {
    return secretsmanager.Secret.fromSecretNameV2(
        scope,
        'SuperseriousConfigSecret',
        'superseriousConfig',
    );
};
