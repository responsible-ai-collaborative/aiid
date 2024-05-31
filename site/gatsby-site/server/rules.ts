import { rule } from "graphql-shield";

export const isAdmin = rule()(
    async (parent, args, context) => {

        const { user } = context;

        if (!user || !user.roles || !user.roles.includes('admin')) {

            return new Error('not authorized')
        }

        return true;
    },
)
