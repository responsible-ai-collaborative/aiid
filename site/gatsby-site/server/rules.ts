import { rule } from "graphql-shield";
import { Context } from "./interfaces";

export const isRole = (role: string) => rule()(
    async (parent, args, context: Context, info) => {

        const { user } = context;

        const meetsRole = user && user.roles && user.roles.includes(role);

        const meetsAdmin = user?.roles.includes('admin');

        const meetsSelf = role == 'self' && user?.id === (info.variableValues?.filter as any)?.userId?.EQ;


        if (meetsRole || meetsAdmin || meetsSelf) {

            return true;
        }

        return new Error('not authorized')
    },
)

export const isAdmin = isRole('admin');
