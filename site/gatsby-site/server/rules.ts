import { rule } from "graphql-shield";
import { SelectionSetNode } from "graphql";
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

        // Walks fragment spreads and inline fragments as well as direct selections;
        // checking only direct selections let `{ user { ...f } } fragment f on User
        // { adminData { email } }` slip past this rule.
        const selectsAdminData = (selectionSet: SelectionSetNode | undefined): boolean => {

            if (!selectionSet) {

                return false;
            }

            for (const selection of selectionSet.selections) {

                if (selection.kind === 'Field' && selection.name.value === 'adminData') {

                    return true;
                }

                if (selection.kind === 'InlineFragment' && selectsAdminData(selection.selectionSet)) {

                    return true;
                }

                if (selection.kind === 'FragmentSpread') {

                    const fragment = info.fragments[selection.name.value];

                    if (fragment && selectsAdminData(fragment.selectionSet)) {

                        return true;
                    }
                }
            }

            return false;
        }

        for (const fieldNode of info.fieldNodes) {

            if (selectsAdminData(fieldNode.selectionSet)) {

                return new Error('not authorized')
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
export const API_ACCESS_USER_FIELDS = [
    'api_access_blocked',
    'api_access_blocked_at',
    'api_access_blocked_reason',
];

export const ADMIN_ONLY_USER_FIELDS = [
    'roles',
    ...API_ACCESS_USER_FIELDS,
];

/**
 * The API-token fields (SEE: server/apiTokens.ts). Never written through
 * `updateOneUser` by anyone — a token is only ever issued by `regenerateApiToken`,
 * so it is always random, and the counters are the server's — and, like the
 * block fields, never usable as a `filter` or `sort` by a non-admin, which would
 * otherwise let a caller probe for a token one guess at a time.
 */
export const API_TOKEN_USER_FIELDS = [
    'api_token',
    'api_token_request_count',
    'api_token_last_used_at',
    'api_token_regenerated_at',
];

const LOGICAL_FILTER_OPERATORS = ['AND', 'OR', 'NOR'];

const mentionsApiAccessField = (node: unknown): boolean => {

    if (Array.isArray(node)) {

        return node.some(mentionsApiAccessField);
    }

    if (node && typeof node === 'object') {

        return Object.entries(node as Record<string, unknown>).some(([key, value]) =>
            API_ACCESS_USER_FIELDS.includes(key)
            || API_TOKEN_USER_FIELDS.includes(key)
            || (LOGICAL_FILTER_OPERATORS.includes(key) && mentionsApiAccessField(value))
        );
    }

    return false;
}

/**
 * Refuses a `user`/`users` query whose `filter` or `sort` mentions one of
 * `API_ACCESS_USER_FIELDS`.
 *
 * Those fields resolve as `null` for anyone but an admin or the account itself
 * (SEE: server/types/user.ts), but the generated `filter` and `sort` arguments
 * are derived from the same field list, so without this rule a non-admin could
 * still learn which accounts are blocked — `users(filter: {api_access_blocked:
 * {EQ: true}}) { userId }` — or order the list by it. Composed with `or(isRole
 * ('admin'), ...)` in `server/fields/users.ts`, so admins are unaffected.
 */
export const notFiltersByApiAccessFields = () => rule()(
    async (parent, args, context: Context, info) => {

        if (mentionsApiAccessField(args.filter) || mentionsApiAccessField(args.sort)) {

            return new Error('not authorized')
        }

        return true;
    },
)

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
        const touchesTokenField = Object.values(update).some(
            (operatorPayload) =>
                operatorPayload != null
                && typeof operatorPayload === 'object'
                && API_TOKEN_USER_FIELDS.some((field) => field in operatorPayload)
        );

        if (touchesTokenField) {

            return new Error('API token fields cannot be edited; use regenerateApiToken');
        }

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