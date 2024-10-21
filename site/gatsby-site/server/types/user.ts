import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { getQueryResolver } from "../utils";
import { Context } from "../interfaces";
import { getUserAdminData, UserAdminData } from "../fields/common";

const UserAdminDatumType = new GraphQLObjectType({
    name: 'UserAdminDatum',
    fields: {
        creationDate: { type: new GraphQLNonNull(GraphQLDateTime) },
        disabled: { type: new GraphQLNonNull(GraphQLBoolean) },
        email: { type: new GraphQLNonNull(GraphQLString) },
        lastAuthenticationDate: { type: GraphQLDateTime },
    },
});

export const UserType = new GraphQLObjectType({
    name: 'User',
    fields: {
        _id: { type: ObjectIdScalar },
        adminData: {
            type: UserAdminDatumType,
            resolve: getQueryResolver(UserAdminDatumType, async (filter, projection, options, source: any, args, context: Context) => {

                const { user } = context;

                let response: UserAdminData = {}

                if (user!.id === source.userId || user!.roles.includes('admin')) {

                    response = await getUserAdminData(source.userId)
                }

                return response;
            }),
        },
        first_name: { type: GraphQLString },
        last_name: { type: GraphQLString },
        roles: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
    },
});

//@ts-ignore 
UserType.getFields().adminData.dependencies = [];