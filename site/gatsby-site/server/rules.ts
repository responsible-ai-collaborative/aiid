import { rule } from "graphql-shield";
import { Context } from "./interfaces";
import { UserType } from "./types/user";
import { getSimplifiedType } from "./utils";
import { getMongoDbFilter } from "graphql-to-mongodb";
import { GraphQLFilter } from "graphql-to-mongodb/lib/src/mongoDbFilter";
import { DBUser } from '../playwright/seeds/customData/users'

export const isRole = (role: string) => rule()(
    async (parent, args, context: Context, info) => {

        const { user } = context;

        const meetsRole = user && user.roles && user.roles.includes(role);

        const meetsAdmin = user?.roles.includes('admin');


        if (meetsRole || meetsAdmin) {

            return true;
        }

        return new Error('not authorized')
    },
)

export const isSelf = () => rule()(
    async (parent, args, context: Context, info) => {

        const collection = context.client.db('customData').collection('users');
        const simpleType = getSimplifiedType(UserType);
        const filter = getMongoDbFilter(simpleType, info.variableValues.filter as GraphQLFilter);
        const users = await collection.find<DBUser>(filter).toArray();

        const { user } = context;

        const meetsOwnership = users.every(s => s.userId === user?.id);

        const meetsAdmin = user?.roles.includes('admin');


        if (meetsAdmin || meetsOwnership) {

            return true;
        }

        return new Error('not authorized')
    },
)

export const isAdmin = isRole('admin');
