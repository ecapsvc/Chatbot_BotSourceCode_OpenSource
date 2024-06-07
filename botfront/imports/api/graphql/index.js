import { mergeTypeDefs } from '@graphql-tools/merge';
import conversationsResolver from './conversations/resolvers/conversationsResolver';
import conversationTypes from './conversations/schemas';
import activityResolver from './activity/resolvers/activityResolver';
import activityTypes from './activity/schemas';
import commonResolver from './common/commonResolver';
import commonTypes from './common/common.types.graphql';
import botResponsesResolvers from './botResponses/resolvers';
import botResponsesTypes from './botResponses/schemas';
import configResolver from './config/configResolver';
import configTypes from './config/config.types.graphql';
import storiesTypes from './story/schemas/stories.types.graphql';
import storiesResolver from './story/resolvers/storiesResolver';
import trackerStoreResolver from './trackerStore/resolvers/trackerStoreResolver';
import trackerStoreTypes from './trackerStore/schemas';
import examplesResolver from './examples/resolvers/examplesResolver';
import examplesTypes from './examples/schemas';


export const resolvers = [
    conversationsResolver,
    ...botResponsesResolvers,
    activityResolver,
    commonResolver,
    configResolver,
    storiesResolver,
    trackerStoreResolver,
    examplesResolver,
];

export const typeDefs = mergeTypeDefs([
    ...conversationTypes,
    ...botResponsesTypes,
    ...activityTypes,
    ...trackerStoreTypes,
    ...examplesTypes,
    commonTypes,
    configTypes,
    storiesTypes,
], { all: true });

export const schemaDirectives = {
};
