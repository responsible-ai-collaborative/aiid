import { IMiddlewareFunction } from 'graphql-middleware';
import { Context } from './interfaces';
import { API_ACCESS_USER_FIELDS } from './rules';

/**
 * Withholds the API-block fields of a `User` from anyone but an admin or the
 * account itself.
 *
 * The reason for a block may describe a customer, and which accounts are blocked
 * is not something one user should learn about another — the same line
 * `adminData` draws in `server/types/user.ts`. The values are resolved as `null`
 * rather than the request refused, because the fields ride along on `FindUsers`,
 * which the history pages read editor names from for every logged-in user.
 *
 * This is a `graphql-middleware` layer on the `User` type rather than a
 * `resolve` on the fields themselves, for two reasons:
 *
 *  - A `User` is reached through more than the `user`/`users` queries — for
 *    example `incident { editors { ... } }` — and a type-level middleware covers
 *    every path without each relation having to remember to redact.
 *  - `generateMutationFields` derives the `UserSetType` input from the same field
 *    list and drops any field that carries a `resolve`, so redacting there would
 *    also have removed the fields from `updateOneUser` and left admins unable to
 *    block anyone. The middleware wraps the built schema instead
 *    (`updateResolversInPlace: false`), leaving the type definition — and the
 *    projection graphql-to-mongodb derives from it — untouched.
 *
 * The `filter` and `sort` arguments of `user`/`users` would leak the same
 * information; `notFiltersByApiAccessFields` in `server/rules.ts` closes that.
 * SEE: site/docs/API_ACCESS.md
 */
const adminOrSelfOnly: IMiddlewareFunction<any, Context> = async (resolve, parent, args, context, info) => {

    const value = await resolve(parent, args, context, info);

    const { user } = context;

    if (user && (user.roles.includes('admin') || user.id === parent?.userId)) {

        return value;
    }

    return null;
}

export const userFieldVisibilityMiddleware = {
    User: Object.fromEntries(API_ACCESS_USER_FIELDS.map((field) => [field, adminOrSelfOnly])),
};
