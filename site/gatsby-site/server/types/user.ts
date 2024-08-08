import { GraphQLBoolean, GraphQLList, GraphQLNonNull, GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLDateTime } from "graphql-scalars";
import { ObjectIdScalar } from "../scalars";
import { apiRequest, getQueryResolver } from "../utils";
import { Context } from "../interfaces";

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

                const response: any = {};

                if (user!.id === source.userId || user!.roles.includes('admin')) {

                    const userApiResponse = await apiRequest({ path: `/users/${source.userId}` });

                    if (userApiResponse.data) {

                        response.email = userApiResponse.data.email;
                        response.creationDate = new Date(userApiResponse.creation_date * 1000);
                        response.lastAuthenticationDate = new Date(userApiResponse.last_authentication_date * 1000);
                        response.disabled = userApiResponse.disabled;
                    }
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