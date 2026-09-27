import React from 'react';
import { Alert } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import Link from 'components/ui/Link';
import useLocalizePath from 'components/i18n/useLocalizePath';
import useApiAccess from 'hooks/useApiAccess';
import { API_ACCESS_BLOCKED_MESSAGE, API_LOGIN_REQUIRED_MESSAGE } from 'utils/apiAccess';

/**
 * In-place explanation that a feature needs the visitor to be logged in.
 *
 * Rendered instead of the feature, deliberately rather than redirecting to
 * `/login`: an anonymous visitor who followed a link to an incident should still
 * see the incident, and should learn why one section of the page is asking for a
 * login instead of being bounced away from what they came for. It also keeps the
 * reason visible, which a redirect discards.
 *
 * @param {object} props
 * @param {string} [props.className]
 * @param {React.ReactNode} [props.children] Optional replacement for the default
 *   copy, for callers that need to name the specific feature.
 * @param {boolean} [props.compact] Renders the message alone, without the
 *   surrounding alert box, for use inside tight layouts such as table cells.
 */
export default function ApiLoginRequired({ className = '', children = null, compact = false }) {
  const { blocked, denial } = useApiAccess();

  // The two messages are constants shared with the server (SEE:
  // server/apiAccessCodes.ts), so they are translated through `t()` with the
  // English text as the key rather than as `<Trans>` children — `Trans` treats a
  // dynamic child as an interpolation target and would not render a plain string
  // reliably. A missing key returns the key, which is the English sentence.
  const { t } = useTranslation();

  const { locale } = useLocalization();

  const localizePath = useLocalizePath();

  // `window` is absent while Gatsby renders the page at build time, in which case
  // there is no meaningful page to come back to and /login's own default applies.
  const redirectTo =
    typeof window === 'undefined' ? null : window.location.pathname + window.location.search;

  const loginPath = localizePath({ path: '/login', language: locale });

  const loginHref = redirectTo
    ? `${loginPath}?redirectTo=${encodeURIComponent(redirectTo)}`
    : loginPath;

  const message = (
    <>
      {children || (
        <>
          {blocked ? t(API_ACCESS_BLOCKED_MESSAGE) : t(API_LOGIN_REQUIRED_MESSAGE)}
          {blocked && denial?.reason ? <span className="ml-1">({denial.reason})</span> : null}
        </>
      )}
      {!blocked && (
        <>
          {' '}
          <Link to={loginHref} className="underline">
            <Trans>Log in</Trans>
          </Link>
        </>
      )}
    </>
  );

  if (compact) {
    return (
      <span
        className={`text-sm text-gray-600 dark:text-gray-400 ${className}`}
        data-cy="api-login-required"
      >
        {message}
      </span>
    );
  }

  return (
    <Alert
      color={blocked ? 'failure' : 'info'}
      className={className}
      data-cy="api-login-required"
      icon={() => <FontAwesomeIcon icon={faLock} className="mr-2" />}
    >
      {message}
    </Alert>
  );
}

/**
 * Renders `children` when the API is usable and the notice when it is not.
 *
 * The wrapper exists so that gating a feature is a single change at its mount
 * point rather than an early return threaded through the component's own
 * loading and error states.
 *
 * @param {object} props
 * @param {React.ReactNode} props.children
 * @param {React.ReactNode} [props.fallback] Rendered instead of the notice while
 *   the session is still resolving, so the feature does not flash a login prompt.
 */
export function ApiAccessGate({ children, fallback = null, className = '', compact = false }) {
  const { hasApiAccess, loading } = useApiAccess();

  if (loading) {
    return fallback;
  }

  if (!hasApiAccess) {
    return <ApiLoginRequired className={className} compact={compact} />;
  }

  return children;
}
