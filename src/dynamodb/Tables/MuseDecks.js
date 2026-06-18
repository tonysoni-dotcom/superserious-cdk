import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

// v1xMuseDecks — one record per generated Daily Muse deck (cards + reactions + finalized
// top-2 on the single item). GSI "byUser" lists a curator's decks newest-first.
export const MuseDecks = {
    TableName: 'v1xMuseDecks',
    partitionKey: { name: 'tenantId', type: dynamodb.AttributeType.STRING },
    sortKey: { name: 'deckId', type: dynamodb.AttributeType.STRING },
    indices: [
        {
            indexName: 'byUser',
            partitionKey: { name: 'userKey', type: dynamodb.AttributeType.STRING },
            sortKey: { name: 'createdAt', type: dynamodb.AttributeType.NUMBER },
            projectionType: dynamodb.ProjectionType.ALL,
        },
    ],
}
