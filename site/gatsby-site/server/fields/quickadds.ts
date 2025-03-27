import { GraphQLFieldConfigMap, GraphQLInt, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { allow } from "graphql-shield";
import { isAdmin } from "../rules";
import { ObjectIdScalar } from "../scalars";
import { generateMutationFields, generateQueryFields } from "../utils";

const QuickAddType = new GraphQLObjectType({
    name: 'Quickadd',
    fields: {
        _id: {
            type: ObjectIdScalar,
        },
        date_submitted: {
            type: new GraphQLNonNull(GraphQLString),
        },
        incident_id: {
            type: GraphQLInt,
        },
        source_domain: {
            type: GraphQLString,
        },
        url: {
            type: new GraphQLNonNull(GraphQLString),
        },
    },
});

export const queryFields: GraphQLFieldConfigMap<any, any> = {

    ...generateQueryFields({ collectionName: 'quickadd', Type: QuickAddType })
}

export const mutationFields: GraphQLFieldConfigMap<any, any> = {

    ...generateMutationFields({ collectionName: 'quickadd', Type: QuickAddType }),
}

export const permissions = {
    Query: {
        quickadd: allow,
        quickadds: allow,
    },
    Mutation: {
        deleteOneQuickadd: isAdmin,
        deleteManyQuickadds: isAdmin,
        insertOneQuickadd: allow,
        insertManyQuickadds: isAdmin,
        updateOneQuickadd: isAdmin,
        updateManyQuickadds: isAdmin,
        upsertOneQuickadd: isAdmin,
    }
}