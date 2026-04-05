// import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// export const Reports = {
//     TableName: 'v1xReports',
//     partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
//     sortKey: { name: 'reporterUserId', type: dynamodb.AttributeType.STRING },
// }
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const UserReports = {
    TableName: 'v1xUserReports',
    partitionKey: { name: 'tenantUserId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'reportId', type: dynamodb.AttributeType.STRING },
}