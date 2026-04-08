import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

export const Achievements = {
    TableName: 'v1xAchievements',
    partitionKey: { name: 'userId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'achievementId', type: dynamodb.AttributeType.STRING },
    indices: []
}
