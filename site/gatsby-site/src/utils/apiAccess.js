import {
  API_ACCESS_BLOCKED,
  API_ACCESS_BLOCKED_MESSAGE,
  API_LOGIN_REQUIRED,
  API_LOGIN_REQUIRED_MESSAGE,
} from '../../server/apiAccessCodes';

/**
 * Browser-side counterpart to the API access gate.
 *
 * The gate in `server/apiAccess.ts` refuses any GraphQL request without a
 * session. The job of this module is to make that refusal legible: a component
 * should be able to explain, in place, that the feature needs a login — rather
 * than surfacing a failed request as a spinner that never resolves or a generic
 * error toast.
 *
 * Codes and copy are re-exported from `server/apiAccessCodes`, which both sides
 * import, so the message shown here cannot drift from the one the server sends.
 */
export {
  API_ACCESS_BLOCKED,
  API_ACCESS_BLOCKED_MESSAGE,
  API_LOGIN_REQUIRED,
  API_LOGIN_REQUIRED_MESSAGE,
};

const DENIAL_CODES = [API_LOGIN_REQUIRED, API_ACCESS_BLOCKED];

export const isApiAccessDenialCode = (code) => DENIAL_CODES.includes(code);

/**
 * Extracts an API-access denial from an Apollo error, or `null` if the error is
 * something else.
 *
 * Both shapes Apollo can deliver are handled. `graphQLErrors` is the normal
 * case: a 200 or 401 response whose body is a well-formed GraphQL error. But
 * Apollo classifies a non-2xx response as a `ServerError` and hangs the parsed
 * body off `networkError.result`, so a 401 carrying our error would otherwise be
 * indistinguishable from the network being down.
 */
export const getApiAccessDenial = (error) => {
  if (!error) return null;

  const fromGraphQLErrors = (error.graphQLErrors || []).find((graphQLError) =>
    isApiAccessDenialCode(graphQLError?.extensions?.code)
  );

  if (fromGraphQLErrors) {
    return {
      code: fromGraphQLErrors.extensions.code,
      message: fromGraphQLErrors.message,
      reason: fromGraphQLErrors.extensions.reason || null,
    };
  }

  const networkErrors = error.networkError?.result?.errors || [];

  const fromNetworkError = networkErrors.find((networkGraphQLError) =>
    isApiAccessDenialCode(networkGraphQLError?.extensions?.code)
  );

  if (fromNetworkError) {
    return {
      code: fromNetworkError.extensions.code,
      message: fromNetworkError.message,
      reason: fromNetworkError.extensions.reason || null,
    };
  }

  return null;
};

export const denialMessage = (denial) => {
  if (!denial) return null;

  if (denial.code === API_ACCESS_BLOCKED) {
    return denial.reason
      ? `${API_ACCESS_BLOCKED_MESSAGE} (${denial.reason})`
      : API_ACCESS_BLOCKED_MESSAGE;
  }

  return API_LOGIN_REQUIRED_MESSAGE;
};

/**
 * Last denial observed by the Apollo error link, published to subscribers.
 *
 * This is module state rather than React state because the Apollo client is
 * constructed outside the component tree (`src/contexts/UserContext.tsx`), so the
 * link has no way to reach a provider. Components read it through
 * `useApiAccess`.
 *
 * A blocked account is the case that makes this necessary: the browser cannot
 * predict it from the session alone — the session is perfectly valid — so the
 * only way a component learns about it is from a rejected request.
 */
let currentDenial = null;

const listeners = new Set();

export const getApiAccessDenialState = () => currentDenial;

export const setApiAccessDenial = (denial) => {
  // Compared by code so a stream of identical denials from separate queries does
  // not re-render every subscriber for each one.
  if (currentDenial?.code === denial?.code) return;

  currentDenial = denial;

  for (const listener of listeners) {
    listener(currentDenial);
  }
};

export const clearApiAccessDenial = () => setApiAccessDenial(null);

export const subscribeToApiAccessDenial = (listener) => {
  listeners.add(listener);

  return () => listeners.delete(listener);
};
