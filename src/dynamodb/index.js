import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from "aws-cdk-lib";
import { Tenants } from './Tables/Tenants.js';
import { Users } from './Tables/Users.js';
import { Otps } from './Tables/Otps.js';
import { Connections } from './Tables/Connections.js';
import { ChatPreview } from './Tables/ChatPreview.js';
import { ChatMessages } from './Tables/ChatMessages.js';
import { ChatBots } from './Tables/ChatBots.js';
import { UserCourseProgress } from './Tables/UserCourseProgress.js';
import { CourseUserResponses } from './Tables/CourseUserResponses.js';
import { Articles } from './Tables/Articles.js';
import { ArticlesComments } from './Tables/ArticleComments.js';
import { Community } from './Tables/Community.js';
import { CommunityPosts } from './Tables/CommunityPost.js';
import { TACOAnswers } from './Tables/TACOAnswers.js';
import { CourseInfo } from './Tables/CourseInfo.js';
import { CourseDays } from './Tables/CourseDays.js';
import { DeviceInfo } from './Tables/DeviceInfo.js';
import { UserReports } from './Tables/UserReports.js';
import { CourseComments } from './Tables/CourseComments.js';
import { CourseLikes } from './Tables/CourseLikes.js';
import { CommunityPostComments } from './Tables/CommunityPostComments.js';
import { Cookbook } from './Tables/Cookbook.js';
import { Achievements } from './Tables/Achievements.js';
import { ModeratorAccounts } from './Tables/ModeratorAccounts.js';
import { Blocks } from './Tables/Blocks.js';
import { SavedItems } from './Tables/SavedItems.js';
import { EmailInbox } from './Tables/EmailInbox.js';
import { EmailSenders } from './Tables/EmailSenders.js';
import { InviteRequests } from './Tables/InviteRequests.js';

export const createScopedTables = (scope) => {
    const tables = {
        Tenants: createTable(scope,Tenants),
        Users: createTable(scope, Users),
        Otps: createTable(scope, Otps),
        Connections: createTable(scope, Connections),
        ChatPreview: createTable(scope, ChatPreview),
        ChatMessages: createTable(scope, ChatMessages),
        ChatBots: createTable(scope, ChatBots),
        UserCourseProgress: createTable(scope, UserCourseProgress),
        CourseUserResponses: createTable(scope, CourseUserResponses),
        Articles: createTable(scope, Articles),
        ArticlesComments: createTable(scope, ArticlesComments),
        Community: createTable(scope, Community),
        CommunityPosts: createTable(scope, CommunityPosts),
        TACOAnswers: createTable(scope, TACOAnswers),
        CourseInfo: createTable(scope, CourseInfo),
        CourseDays: createTable(scope, CourseDays),
        DeviceInfo: createTable(scope, DeviceInfo),
        UserReports: createTable(scope, UserReports),
        CourseComments: createTable(scope, CourseComments),
        CourseLikes: createTable(scope, CourseLikes),
        CommunityPostComments: createTable(scope, CommunityPostComments),
        Cookbook: createTable(scope, Cookbook),
        Achievements: createTable(scope, Achievements),
        ModeratorAccounts: createTable(scope, ModeratorAccounts),
        Blocks: createTable(scope, Blocks),
        SavedItems: createTable(scope, SavedItems),
        EmailInbox: createTable(scope, EmailInbox),
        EmailSenders: createTable(scope, EmailSenders),
        InviteRequests: createTable(scope, InviteRequests),
    }
    return tables;
}


const createTable = (
    scope, 
    {
        partitionKey,
        sortKey,
        TableName,
        ttl,
        indices
    }
) => {
    const table = new dynamodb.Table(scope, `dynamo_${TableName}`, {
        partitionKey: partitionKey,
        sortKey: sortKey,
        billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        removalPolicy: RemovalPolicy.DESTROY,
        tableName: `${TableName}`,
    })

    if(ttl) {
        // Enable TTL manually
        const cfnTable = table.node.defaultChild;
        cfnTable.timeToLiveSpecification = {
            attributeName: ttl,
            enabled: true,
        };
    }

    if(indices) {
        indices.forEach(index => {
            table.addGlobalSecondaryIndex({
                indexName: index.indexName,
                partitionKey: index.partitionKey,
                sortKey: index.sortKey,
                projectionType: dynamodb.ProjectionType.ALL,
            })
        });
    }

    return table;
}