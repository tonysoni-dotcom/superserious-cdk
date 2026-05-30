import * as apigwv2 from 'aws-cdk-lib/aws-apigatewayv2';

export const importWebSocketApi = (scope) => {
    return apigwv2.WebSocketApi.fromWebSocketApiAttributes(scope, 'SuperseriousWebSocketApi', {
        webSocketId: 'j3lt26i3b1',
        apiEndpoint: 'wss://j3lt26i3b1.execute-api.us-east-1.amazonaws.com',
    });
};
