import React, { useMemo, useState } from 'react';
import { FIND_USERS_ADMIN } from '../../graphql/users';
import { FIND_API_USAGE_SUMMARIES } from '../../graphql/apiUsage';
import { useQuery } from '@apollo/client/react';
import UsersTable from 'components/users/UsersTable';
import ListSkeleton from 'elements/Skeletons/List';
import { useUserContext } from 'contexts/UserContext';
import { Button, Label, Select } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import useLocalizePath from 'components/i18n/useLocalizePath';
import HeadContent from 'components/HeadContent';
import ApiLoginRequired from 'components/ui/ApiLoginRequired';
import useApiAccess from 'hooks/useApiAccess';

/**
 * Inclusive `YYYY-MM-DD` range (UTC, the day key `api_usage` is bucketed by) ending
 * today and covering `days` days, for `apiUsageSummaries(from, to)`.
 */
export const usageWindow = (days, now = new Date()) => {
  const dayKey = (date) => date.toISOString().slice(0, 10);

  const from = new Date(now);

  from.setUTCDate(from.getUTCDate() - (days - 1));

  return { from: dayKey(from), to: dayKey(now) };
};

const AdminPage = (props) => {
  const { hasApiAccess, loading: apiAccessLoading } = useApiAccess();

  const { isRole, loading: loadingAuth } = useUserContext();

  // One request for the whole table, admin data included; only an admin may ask
  // for it, so nobody else issues a request that would be refused.
  // SEE: server/apiAccess.ts
  const { data, loading } = useQuery(FIND_USERS_ADMIN, {
    skip: !hasApiAccess || loadingAuth || !isRole('admin'),
    // One account's admin data failing to resolve must not blank the whole table.
    errorPolicy: 'all',
  });

  // API usage for every account over a window, in one aggregation on the server
  // (SEE: server/fields/apiUsage.ts). It is a second request per page load, never
  // one per account, and it is not needed for the table to render, so the rows
  // appear as soon as the list arrives and the usage columns fill in after.
  const [usageDays, setUsageDays] = useState(30);

  const usageRange = useMemo(() => usageWindow(usageDays), [usageDays]);

  const { data: usageData, loading: usageLoading } = useQuery(FIND_API_USAGE_SUMMARIES, {
    variables: usageRange,
    skip: !hasApiAccess || loadingAuth || !isRole('admin'),
  });

  const rows = useMemo(() => {
    if (!data?.users) return null;

    const usageByUser = Object.fromEntries(
      (usageData?.apiUsageSummaries || []).map((summary) => [summary.userId, summary])
    );

    return data.users.map((user) => ({ ...user, usage: usageByUser[user.userId] || null }));
  }, [data, usageData]);

  const { locale } = useLocalization();

  const { t } = useTranslation();

  const localizePath = useLocalizePath();

  return (
    <div className="w-full" {...props}>
      <div>
        {/*
          Placed above the permissions message so a logged-out visitor is told to
          log in rather than that they lack a role they could not have.
        */}
        {!apiAccessLoading && !hasApiAccess && <ApiLoginRequired />}
        {hasApiAccess && loading && <ListSkeleton />}
        {hasApiAccess && !loading && !loadingAuth && !isRole('admin') && (
          <div>Not enough permissions</div>
        )}
        {rows && isRole('admin') && (
          <>
            <div className="flex flex-wrap items-end justify-between gap-4 mb-5">
              <Button href={localizePath({ path: '/incidents/new', language: locale })}>
                <Trans>New Incident</Trans>
              </Button>
              <div className="flex items-center gap-2">
                <Label htmlFor="usage-window" className="whitespace-nowrap">
                  <Trans>API usage window</Trans>
                </Label>
                <Select
                  id="usage-window"
                  data-cy="usage-window"
                  sizing="sm"
                  value={usageDays}
                  onChange={(e) => setUsageDays(Number(e.target.value))}
                >
                  {[7, 30, 90].map((days) => (
                    <option key={days} value={days}>
                      {t('Last {{days}} days', { days })}
                    </option>
                  ))}
                </Select>
              </div>
            </div>
            <UsersTable data={rows} usageLoading={usageLoading} />
          </>
        )}
      </div>
    </div>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  return (
    <HeadContent path={pathname} metaTitle={'Admin'} metaDescription={'Administration page'} />
  );
};

export default AdminPage;
