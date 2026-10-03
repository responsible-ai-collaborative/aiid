import { Badge, Button, Spinner } from 'flowbite-react';
import { Link } from 'gatsby';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_USER, REGENERATE_API_TOKEN } from '../../graphql/users';
import { useMutation, useQuery } from '@apollo/client';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import UserEditModal from './UserEditModal';
import { BooleanParam, useQueryParams, withDefault } from 'use-query-params';

export default function UserDetails({ userId }) {
  const { t } = useTranslation(['account', 'translation']);

  const [showEditModal, setShowEditModal] = React.useState(false);

  const [{ askToCompleteProfile }] = useQueryParams({
    askToCompleteProfile: withDefault(BooleanParam, false),
  });

  useEffect(() => {
    if (askToCompleteProfile) {
      setShowEditModal(true);
    }
  }, []);

  const { data, loading } = useQuery(FIND_USER, {
    variables: { filter: { userId: { EQ: userId } } },
  });

  const addToast = useToastContext();

  const [regenerateApiToken, { loading: regenerating }] = useMutation(REGENERATE_API_TOKEN);

  // Replacing the token invalidates the current one at once, so it is confirmed.
  const onRegenerateApiToken = async () => {
    if (!confirm(t('regenerateApiTokenConfirm'))) return;

    try {
      // The mutation returns the User by its cache key, so the row updates in place.
      await regenerateApiToken();
      addToast({ message: t('apiTokenRegenerated'), severity: SEVERITY.success });
    } catch (e) {
      addToast({ message: t('apiTokenRegenerateError'), severity: SEVERITY.danger, error: e });
    }
  };

  const copyApiToken = async () => {
    try {
      await navigator.clipboard.writeText(data.user.api_token);
      addToast({ message: t('Copied', { ns: 'translation' }), severity: SEVERITY.success });
    } catch (e) {
      addToast({
        message: t('Could not copy to the clipboard', { ns: 'translation' }),
        severity: SEVERITY.danger,
      });
    }
  };

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        <Spinner />
        <Trans>Loading...</Trans>
      </div>
    );
  }

  return (
    <>
      <table
        className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        data-cy="details-table"
      >
        <tbody>
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            data-cy="user-email"
          >
            <th
              scope="row"
              className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {t('Email')}
            </th>
            <td className="py-4">{data.user.adminData.email}</td>
          </tr>
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            data-cy="user-first-name"
          >
            <th
              scope="row"
              className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {t('First Name')}
            </th>
            <td className="py-4">{data.user.first_name}</td>
          </tr>
          <tr className="bg-white dark:bg-gray-800" data-cy="user-last-name">
            <th
              scope="row"
              className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {t('Last Name')}
            </th>
            <td className="py-4">{data.user.last_name}</td>
          </tr>
          <tr className="bg-white dark:bg-gray-800" data-cy="user-role">
            <th
              scope="row"
              className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {t('Roles')}
            </th>
            <td className="py-4">
              <div className="flex flex-wrap gap-2">
                {data.user.roles.map((role) => (
                  <Badge key={role} data-cy="role-badge">
                    {role}
                  </Badge>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="mt-6 border-t pt-4" data-cy="api-token">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">{t('API token')}</h3>
        <p className="text-sm mt-1">{t('apiTokenIntro')}</p>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <code
            className="select-all break-all rounded bg-gray-100 dark:bg-gray-700 px-2 py-1 text-sm"
            data-cy="api-token-value"
          >
            {data.user.api_token || t('apiTokenMissing')}
          </code>
          {data.user.api_token && (
            <Button size="xs" color="light" data-cy="copy-api-token" onClick={copyApiToken}>
              {t('Copy', { ns: 'translation' })}
            </Button>
          )}
          <Button
            size="xs"
            color="light"
            data-cy="regenerate-api-token"
            disabled={regenerating}
            onClick={onRegenerateApiToken}
          >
            {data.user.api_token ? t('Regenerate token') : t('Generate token')}
          </Button>
        </div>
        <p className="text-sm mt-3 text-gray-500" data-cy="api-token-usage">
          {t('apiTokenUsage', {
            count: data.user.api_token_request_count || 0,
            last: data.user.api_token_last_used_at
              ? new Date(data.user.api_token_last_used_at).toLocaleString()
              : t('never'),
          })}
        </p>
        <pre className="text-xs mt-3 overflow-x-auto rounded bg-gray-100 dark:bg-gray-700 p-2">
          {`curl -X POST https://incidentdatabase.ai/api/graphql \\
  -H "Authorization: Bearer ${data.user.api_token || '<token>'}" \\
  -H "Content-Type: application/json" \\
  -d '{"query":"{ incidents(pagination: {limit: 3}) { incident_id title } }"}'`}
        </pre>
      </div>

      <div className="flex gap-2 items-center justify-between mt-4">
        <Link to="/logout">
          <Trans ns="login">Log out</Trans>
        </Link>
        <Button onClick={() => setShowEditModal(true)}>
          <Trans>Edit</Trans>
        </Button>
      </div>

      <UserEditModal
        show={showEditModal && userId}
        userId={userId}
        onClose={() => setShowEditModal(false)}
        alertTitle={t('completeInfoAlertTitle')}
        alertText={t('completeInfoAlertMessage')}
      />
    </>
  );
}
