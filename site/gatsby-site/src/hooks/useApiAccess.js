import { useEffect, useState } from 'react';
import { useUserContext } from 'contexts/UserContext';
import {
  API_ACCESS_BLOCKED,
  getApiAccessDenialState,
  subscribeToApiAccessDenial,
} from 'utils/apiAccess';

/**
 * Whether the current visitor can use the GraphQL API, and why not if they
 * cannot.
 *
 * Two sources are combined:
 *
 *  - the session, which lets a component decide *before* issuing a request that
 *    it should render the login notice instead. This is what keeps a logged-out
 *    visitor from seeing a spinner resolve into an error, and what lets callers
 *    pass `skip` to `useQuery` so no doomed request is made at all.
 *  - denials reported by the Apollo error link, which are authoritative. A
 *    blocked account has a valid session, so the session alone cannot reveal it;
 *    only a rejected request can.
 *
 * @returns {{
 *   loading: boolean,
 *   hasApiAccess: boolean,
 *   loginRequired: boolean,
 *   blocked: boolean,
 *   denial: {code: string, message: string, reason: string|null}|null,
 * }}
 */
export default function useApiAccess() {
  const { user, loading } = useUserContext();

  const [denial, setDenial] = useState(getApiAccessDenialState);

  useEffect(() => subscribeToApiAccessDenial(setDenial), []);

  const blocked = denial?.code === API_ACCESS_BLOCKED;

  // `loading` is held separate from `loginRequired` so a component does not flash
  // the login notice during the moment before the session resolves.
  const loginRequired = !loading && !user;

  return {
    loading,
    hasApiAccess: !loading && Boolean(user) && !blocked,
    loginRequired,
    blocked,
    denial,
  };
}
