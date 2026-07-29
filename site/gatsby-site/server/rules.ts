import { rule } from "graphql-shield";
import { Context, DBChecklist, DBSubscription, DBUser } from "./interfaces";
import { getMongoDbFilter } from "graphql-to-mongodb";
import { SubscriptionType } from "./types/subscription";
import { getSimplifiedType } from "./utils";
import { GraphQLFilter } from "graphql-to-mongodb/lib/src/mongoDbFilter";
import { UserType } from "./types/user";
import config, { Config } from "./config";
import { ChecklistType } from "./types/checklist";

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
        const filter = getMongoDbFilter(simpleType, args.filter as GraphQLFilter);
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

/**
 * Fields a non-admin user may change on their own `customData.users` record.
 *
 * `roles` is deliberately excluded. The NextAuth `session` callback re-reads roles from
 * this collection on every request, so letting a user write their own `roles` array lets
 * any authenticated account grant itself `admin` and have it take effect immediately.
 * `userId` is excluded because it is the identity the ownership check itself is based on.
 */
const SELF_UPDATABLE_USER_FIELDS = ['first_name', 'last_name'];

/**
 * Authorizes `updateOneUser`.
 *
 * Admins may update any user. Everyone else may only update their own record, and only
 * the fields in `SELF_UPDATABLE_USER_FIELDS` — checking the filter alone is not enough,
 * because the filter says *which* document is written, not *what* is written to it.
 */
export const isSelfUserProfileUpdate = () => rule()(
    async (parent, args, context: Context, info) => {

        const { user } = context;

        if (!user) {

            return new Error('not authorized')
        }

        if (user.roles?.includes('admin')) {

            return true;
        }

        const collection = context.client.db('customData').collection('users');
        const simpleType = getSimplifiedType(UserType);
        const filter = getMongoDbFilter(simpleType, args.filter as GraphQLFilter);
        const users = await collection.find<DBUser>(filter).toArray();

        // `Array.every` is vacuously true for an empty array, so a filter that matches
        // nothing must not be read as "the caller owns everything it matched".
        if (users.length === 0 || !users.every(u => u.userId === user.id)) {

            return new Error('not authorized')
        }

        const set = (args.update?.set ?? {}) as Record<string, unknown>;

        const forbiddenFields = Object.keys(set).filter(
            field => !SELF_UPDATABLE_USER_FIELDS.includes(field)
        );

        if (forbiddenFields.length > 0) {

            return new Error('not authorized')
        }

        return true;
    },
)

export const isSubscriptionOwner = () => rule()(
    async (parent, args, context: Context, info) => {

        const collection = context.client.db('customData').collection('subscriptions');
        const simpleType = getSimplifiedType(SubscriptionType);
        const filter = getMongoDbFilter(simpleType, args.filter as GraphQLFilter);
        const subscriptions = await collection.find<DBSubscription>(filter).toArray();

        const { user } = context;

        const meetsOwnership = subscriptions.every(s => s.userId === user?.id);

        const meetsAdmin = user?.roles.includes('admin');

        if (meetsAdmin || meetsOwnership) {

            return true;
        }

        return new Error('not authorized')
    },
)

export const hasHeaderSecret = (headerName: keyof Config) => rule()(

    async (parent, args, context: Context, info) => {

        const { req } = context;

        const headerValue = req.headers[headerName.toLowerCase()];
        const configValue = config[headerName];

        if (!headerValue || !configValue || (configValue && headerValue && configValue != headerValue)) {

            return new Error('not authorized')
        }

        return true;
    }
)

export const notQueriesAdminData = () => rule()(

    async (parent, args, context: Context, info) => {

        const fieldNodes = info.fieldNodes;

        for (const fieldNode of fieldNodes) {
            if (fieldNode.selectionSet) {
                const selections = fieldNode.selectionSet.selections;

                for (const selection of selections) {

                    if (selection.kind === 'Field' && selection.name.value === 'adminData') {

                        return new Error('not authorized')
                    }
                }
            }
        }

        return true;
    }
)

export const isAdmin = isRole('admin');

export const isSubscriber = isRole('subscriber');

export const isChecklistsOwner = () => rule()(
    async (parent, args, context: Context, info) => {

        const collection = context.client.db('aiidprod').collection('checklists');
        const simpleType = getSimplifiedType(ChecklistType);
        const filter = getMongoDbFilter(simpleType, args.filter as GraphQLFilter);
        const checklists = await collection.find<DBChecklist>(filter).toArray();

        const { user } = context;

        const meetsOwnership = checklists.every(c => c.owner_id === user?.id);

        if (!meetsOwnership) {

            return new Error('not authorized');
        }

        return true;
    },
)