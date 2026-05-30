import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';

export const importHttpApi = (scope) => {
    return apigwv2.HttpApi.fromHttpApiAttributes(scope, 'SuperseriousHttpApi', {
        httpApiId: '71lvzho52a',
        apiEndpoint: 'https://71lvzho52a.execute-api.us-east-1.amazonaws.com',
    });
};
