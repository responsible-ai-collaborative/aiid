# API Access: Authentication, Usage Accounting, and Blocking

## Why

The GraphQL endpoint at `/api/graphql` was readable by anyone. That was deliberate — the
database is a public good and the read schema exposes nothing private — but it left the
project with no way to answer three questions that matter operationally:

1. **Who is making these requests?** A large share of traffic is automated. The endpoint
   previously tried to infer this from `Origin`/`Referer` and `User-Agent` headers
   (`API_VALIDATE_ORIGIN` and `API_VALIDATE_USER_AGENT` in
   `site/gatsby-site/netlify/functions/graphql.ts`). Both are trivially spoofed and neither
   distinguishes one caller from another, so a heavy consumer could not be told apart from a
   thousand light ones.
2. **How much is any one consumer using?** Without an identity per request there is nothing
   to attribute usage to, and so no basis for charging an organisation that builds on the
   API — nor for doing so without publishing what they use.
3. **How do we stop a specific abuser?** Blocking by IP or user agent catches collateral and
   is evaded by changing either.

Requiring an account answers all three at once: every request carries an identity, so it can
be counted, and the account can be blocked.

## What changed

### Every root field requires a session

`site/gatsby-site/server/apiAccess.ts` installs a `graphql-middleware` layer over the whole
schema in `server/local.ts`:

```ts
const schemaWithAuth = applyMiddleware(schema, apiAccessMiddleware, permissions)
```

It is a single gate over `Query` and `Mutation` rather than a change to the per-module
`permissions` maps in `server/fields/*`. That choice matters:

- **Default-secure.** A new root field is gated the moment it is added; nobody has to
  remember to mark it.
- **One place to read.** The role rules (`isRole`, `isSelf`, …) keep saying *what* a
  logged-in user may do without also having to say *that* they must be logged in.
- **Covers every consumer of the schema**, including the standalone Apollo server that the
  Jest suite builds in `server/tests/utils.ts`, so tests exercise the real gate.

Schema introspection (`__schema`, `__type`) is deliberately still reachable without a
session. Those are meta-fields and are not part of the `Query` type's field map, so the gate
does not wrap them. They expose the schema's shape and no incident data, and leaving them
open means the Apollo Explorer at `/api/graphql` still loads for a logged-out visitor.

Two error codes are returned, in `extensions.code`, with matching HTTP statuses:

| Code | HTTP | Meaning |
| --- | --- | --- |
| `API_LOGIN_REQUIRED` | 401 | No session. |
| `API_ACCESS_BLOCKED` | 403 | Session is valid but the account is blocked. Carries `extensions.reason` when one was recorded. |

Codes and user-facing copy live in `server/apiAccessCodes.ts`, which has no imports so that
the browser can import it too. Both the server gate and `src/utils/apiAccess.js` read from
it, so the message a user sees cannot drift from the one the server sends.

#### Rollback

Enforcement is on by default. `API_REQUIRE_LOGIN=false` turns it off without a code change,
which exists so the requirement can be withdrawn quickly if it turns out to break a consumer
nobody anticipated. This follows the existing convention of `API_VALIDATE_ORIGIN` and
`API_VALIDATE_USER_AGENT`.

#### What this does *not* affect

The site's incident, report and entity pages are **statically built**. Gatsby sources them
straight from MongoDB via `gatsby-source-mongodb` (see `gatsby-config.js`), not through
`/api/graphql`. Requiring a login for the API therefore does not make the public site
require a login, and does not affect the build. What needs a session is the *dynamic*
behaviour layered on those pages: submitting a report or variant, flagging, subscribing,
checklists, live/editor views, and everything under `/admin`.

Login itself is unaffected: NextAuth is served from `/api/auth/*` by a separate function
(`netlify/functions/auth.ts`) and the login form calls it directly rather than going through
GraphQL. There is no chicken-and-egg problem.

### Components explain the requirement in place

A logged-out visitor is **not** redirected to `/login`. Someone who followed a link to an
incident should still see the incident, and should be told why one section of the page is
asking for a login rather than being bounced away from what they came for.

Three pieces support this:

- **`src/utils/apiAccess.js`** — extracts a denial from an Apollo error and publishes it.
  Both shapes Apollo can deliver are handled: `graphQLErrors`, and the `networkError.result`
  case, which is what a non-2xx response (our 401/403) actually arrives as.
- **`src/hooks/useApiAccess.js`** — returns `{ hasApiAccess, loginRequired, blocked, loading, denial }`.
  It combines the session (which lets a component decide *before* issuing a doomed request,
  and pass `skip` to `useQuery`) with denials reported by the Apollo link (which are
  authoritative — a **blocked** account has a perfectly valid session, so the session alone
  cannot reveal it).
- **`src/components/ui/ApiLoginRequired.js`** — the notice, plus an `ApiAccessGate` wrapper
  that renders the notice in place of its children. `compact` renders the bare sentence for
  tight layouts.

The wiring in `src/contexts/UserContext.tsx` uses an `onError` link so the denial is noticed
once, centrally, for every query and mutation in the app — no individual caller has to
inspect its own error for the code. That is also why the denial lives in module state rather
than React state: the Apollo client is constructed outside the component tree, so the link
has no provider to reach.

Typical use:

```jsx
const { hasApiAccess } = useApiAccess();

const { data } = useQuery(FIND_THING, { skip: !hasApiAccess });

if (!hasApiAccess) return <ApiLoginRequired />;
```

Passing `skip` matters as much as rendering the notice: without it the component fires a
request that is certain to be refused, and any `!data` branch below spins forever waiting for
it.

### Gate the control, not the page

Where a page mixes build-time content with an API-backed feature, gate the feature. Blocking
the page withdraws something that never needed a login.

`/apps/incidents/` is the worked example. Its three tables render from the Gatsby page query;
only the **Show Live data** toggle reads the API. So the page stays fully readable while logged
out, and the toggle is rendered *disabled with the notice beside it* — visible rather than
hidden, so a reader can see the option exists and why it is unavailable. The live queries
carry `skip: !hasApiAccess || !isLiveData || ...`.

Before gating a page wholesale, check for `export const query = graphql` and what the `data`
prop actually supplies. Of the pages gated here, only `/apps/incidents/` had build-time content
worth keeping; `checklists`, `incidents/history` and `csettool` use their page queries purely
for vocabulary (taxa/field lists) and have nothing to show without the API.

### Beware components mounted per row

`flowbite-react`'s `Modal` renders its children even while closed. `Actions` on the discover
page put a report query inside one, so it ran **once per search hit** — around 28 requests per
page of results that no visitor asked for. Harmless while reads were anonymous; now every one
is attributed to an account and would inflate the very usage figures the counters exist to
report. The body is now mounted only while the modal is open (`{showFlag && <FlagModalContent/>}`).

When gating something that renders per row or per card, check how many times it actually
mounts.

### Watch for `client.query` without a rejection handler

`useQuery` reports failure through its `error` result, so an ungated one is wasteful but
harmless. An imperative `client.query(...)` is different: if nothing handles the rejection it
becomes an **uncaught error on the page**. Before the API required a login these calls always
succeeded, so several had no `.catch` — and the login requirement turned each into a visible
Apollo error.

Two were found this way and fixed, both worth knowing about because the pattern recurs:

- `src/components/taxa/TaxonomyForm.js` — mounted by `Taxonomy` for **every** taxonomy card on
  **every** incident page, and it fetched entities on mount whenever the taxonomy had
  `complete_entities`, regardless of whether the form was being edited. Now deferred to
  `active` (what its own comment always intended) and to `hasApiAccess`, with a `.catch`.
- `src/pages/apps/classifications.js` — an async `useEffect` whose promise was never caught.

When gating a component, grep it for `client.query`, `client.mutate` and bare `.then(` as well
as for `useQuery`.

### Per-account usage accounting

`server/apiUsage.ts` installs an Apollo Server plugin — on both the Netlify lambda and the
Jest test server — that records each request against the account that made it.

Storage is **one document per (account, UTC day)** in `customData.api_usage`:

```js
{
  userId: '6737a6e881955aa4905ccb04',
  date: '2026-07-26',        // UTC day bucket
  count: 412,                // requests served
  errorCount: 3,             // served requests whose response carried an error
  deniedCount: 0,            // requests refused because the account is blocked
  operations: { FindIncidents: 380, FindReports: 32 },
  firstRequestAt: ISODate('…'),
  lastRequestAt: ISODate('…'),
}
```

A row per request was rejected on purpose: the traffic this feature exists to measure is
exactly the traffic that would make such a log expensive. A day bucket is one indexed upsert
per request and stays proportional to (accounts × days). Day granularity is enough for
spotting automated volume and for billing; per-request forensics remain in Sentry, which the
lambda already annotates with the user id.

Notes on the numbers:

- `deniedCount` is kept out of `count`. A blocked account's retries are evidence of
  behaviour, but they were never served and must not appear as usage on an invoice.
- Requests with **no session** are not recorded. The gate has already refused them and there
  is no account to attribute them to.
- Operation names are sanitised before use as Mongo field keys. GraphQL names cannot contain
  `.` or a leading `$`, but the name arrives from the request body, so anything unexpected
  collapses to `other` rather than being written.
- A failure to record is swallowed and logged. Usage accounting is observability; losing a
  count is a better outcome than failing a request the API already answered.

`migrations/2026.07.26T12.00.00.add-api-usage-indexes.ts` adds the indexes. The
`{ userId, date }` index is **unique** so that concurrent requests from one account on one day
cannot race into two buckets.

#### Reading usage

Admin-only, via `server/fields/apiUsage.ts`:

- `apiUsage` / `apiUsages` — the raw day buckets, with the usual generated filter, sort and
  pagination arguments.
- `apiUsageSummaries(userId, from, to)` — totals per account over an inclusive `YYYY-MM-DD`
  range, sorted by volume descending, which is the order someone hunting for abuse wants.

```graphql
query {
  apiUsageSummaries(from: "2026-07-01", to: "2026-07-31") {
    userId
    count
    activeDays
    deniedCount
    lastRequestAt
  }
}
```

Usage is not readable by the account it describes: neither of the uses above should be
visible to the party being measured, and one customer must not be able to read another's
volume.

The per-operation breakdown is intentionally absent from the GraphQL schema — its keys are
operation names, so it has no fixed shape to describe, and the generated filter machinery
cannot work with an open map. It stays in Mongo for ad-hoc analysis.

### Blocking an account

Three fields on `customData.users`:

| Field | Meaning |
| --- | --- |
| `api_access_blocked` | When true, the gate refuses this account with `API_ACCESS_BLOCKED`. |
| `api_access_blocked_at` | When the block was applied. Cleared on unblock, so a stale timestamp cannot be read as a current one. |
| `api_access_blocked_reason` | Shown to the blocked account and in the admin UI. |

**Only an admin may write these fields.** `updateOneUser` is guarded by `isSelf()`, which
deliberately lets a user edit their own profile — so without a further rule an account could
clear its own block, and the block would hold only for as long as the blocked party did not
think to try. `canEditProtectedUserFields` in `server/rules.ts` closes that: it inspects the
mutation's update payload and requires the `admin` role when any protected field is touched,
while leaving ordinary profile edits alone. Every operator key in the payload is inspected,
not just `set`, so a new one cannot quietly open a path.

### `roles` is protected by the same rule

The same rule also covers **`roles`**, which was previously self-writable — `isSelf()` alone
let any logged-in account run
`updateOneUser(filter: {userId: {EQ: me}}, update: {set: {roles: ["admin"]}})` and grant
itself `admin`. That predates this change, but it defeats two of the guarantees above, since
`admin` is exactly the role that governs blocking accounts and reading other accounts' usage:
an account could promote itself and then read every customer's volume or unblock a peer.

The admin UI already disabled the roles control for non-admins
(`src/components/users/UserForm.js`), so this only makes the server enforce what the
interface already expressed. `server/tests/apiAccess.spec.ts` asserts both that a non-admin is
refused *and* that the database is unchanged.

The gate caches each account's blocked flag for 15 seconds per process. The gate runs on
every root field of every request, and Netlify reuses warm lambda containers, so an
uncached check would add a Mongo round trip to each one. The consequence is that **a block
can take up to 15 seconds to take effect**; `clearApiAccessCache()` exists for tests, which
change the flag far faster than the TTL.

#### Admin UI

At `/admin`:

- `UsersTable` shows an **API Access** column, so blocked accounts are visible at a glance
  without opening each one.
- `UserEditModal` → `UserForm` has an admin-only **API access** fieldset with the block
  checkbox and reason. It is admin-only in the UI to match the server rule; showing it to a
  non-admin would offer a control whose submission would be rejected.
- The same modal shows that account's recorded usage, so the decision to block is made with
  the volume in view.

## Operational notes

### Sentry

Access denials are **not** reported to Sentry. They are the expected response to a logged-out
or blocked caller, not a fault, and reporting them would bury real errors under the very bot
traffic the gate exists to turn away. Volume remains observable: per account in
`customData.api_usage`, and for callers with no account in Netlify's own logs.

### Existing API consumers

This is a breaking change for anyone querying `/api/graphql` anonymously. A consumer now
needs an account and must send its session cookie. The public GraphQL endpoint section of the
root `README.md` documents the requirement.

## Tests

| File | Covers |
| --- | --- |
| `server/tests/apiAccess.spec.ts` | Session required for queries and mutations; roleless user allowed; blocked account refused with reason; unblocking restores access; introspection still open; blocking is admin-only and profile edits still work. |
| `server/tests/apiUsage.spec.ts` | Counting and day bucketing; per-operation accumulation; anonymous not recorded; denied counted separately; error flagging; `apiUsageSummaries` totals, ranges, ranking and admin-only access; operation-name sanitisation. |
| `playwright/e2e/apiAccess.spec.ts` | Logged-out visitor sees the notice and logged-in one sees the feature, on the real pages; endpoint returns 401 anonymously and data with a session; blocked account is refused. |

The Jest suite's `mockSession(userId)` resolves the user from `customData.users`, so a
`userId` that is **not** seeded yields no session and is genuinely anonymous —
`mockAnonymousSession()` makes that explicit. Note that the fixtures' `anonymous` user *is*
seeded, and so is a logged-in user with no roles; those fixtures continue to pass because the
gate checks identity, not permission.
