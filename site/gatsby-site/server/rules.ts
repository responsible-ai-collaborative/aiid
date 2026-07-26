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

/**
 * Fields of `customData.users` that only an admin may write.
 *
 * `updateOneUser` is guarded by `isSelf()`, which deliberately lets a user edit
 * their own profile — so without a further rule, every field of a user's own
 * record is self-writable. That is fine for a display name and not for these:
 *
 * - `roles` — self-writability here is a privilege-escalation path: any
 *   logged-in account could grant itself `admin`, and `admin` is the role that
 *   governs blocking accounts and reading other accounts' API usage. The admin UI
 *   already disables this control for non-admins
 *   (`src/components/users/UserForm.js`), so enforcing it server-side matches the
 *   intent the interface already expresses.
 * - `api_access_blocked*` — otherwise an account could clear its own block, and
 *   the block would hold only for as long as the blocked party did not think to
 *   try. The gate in `server/apiAccess.ts` already refuses a blocked account's
 *   requests before they reach this mutation, which makes this a second line of
 *   defence there — but it is also what stops a *non*-blocked user from writing
 *   an audit field they do not own.
 *
 * SEE: server/apiAccess.ts, site/docs/API_ACCESS.md
 */
export const ADMIN_ONLY_USER_FIELDS = [
    'roles',
    'api_access_blocked',
    'api_access_blocked_at',
    'api_access_blocked_reason',
];

/**
 * Requires the `admin` role when an update touches any of
 * `ADMIN_ONLY_USER_FIELDS`, and is transparent otherwise so that ordinary profile
 * edits are unaffected.
 */
export const canEditProtectedUserFields = () => rule()(
    async (parent, args, context: Context, info) => {

        const update = (args.update ?? {}) as Record<string, Record<string, unknown> | undefined>;

        // graphql-to-mongodb nests the payload under operator keys (`set`,
        // `unset`, ...). Every operator is inspected rather than just `set`, so a
        // new one cannot quietly open a path to these fields.
        const touchesProtectedField = Object.values(update).some(
            (operatorPayload) =>
                operatorPayload != null
                && typeof operatorPayload === 'object'
                && ADMIN_ONLY_USER_FIELDS.some((field) => field in operatorPayload)
        );

        if (!touchesProtectedField) {

            return true;
        }

        if (context.user?.roles.includes('admin')) {

            return true;
        }

        return new Error('not authorized')
    },
)

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