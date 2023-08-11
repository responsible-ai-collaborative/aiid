import React, { useEffect, useState } from 'react';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { FIND_INCIDENT_HISTORY } from '../../graphql/incidents';
import { FIND_USERS_FIELDS_ONLY } from '../../graphql/users';
import { FIND_ENTITIES } from '../../graphql/entities';
import { useQuery } from '@apollo/client/react/hooks';
import { useTranslation, Trans } from 'react-i18next';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { format, fromUnixTime } from 'date-fns';
import { getIncidentChanges } from 'utils/cite';
import { StringDiff, DiffMethod } from 'react-string-diff';
import Link from 'components/ui/Link';
import { Button } from 'flowbite-react';
import { globalHistory } from '@reach/router';

function IncidentHistoryPage() {
  const { t } = useTranslation();

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, Number.NaN));

  const [incidentTitle, setIncidentTitle] = useState(null);

  const [incidentHistory, setIncidentHistory] = useState(null);

  const { data: usersData, loading: loadingUsers } = useQuery(FIND_USERS_FIELDS_ONLY);

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const {
    data: incidentHistoryData,
    loading: loadingIncidentHistory,
    refetch: refetchHistory,
  } = useQuery(FIND_INCIDENT_HISTORY, {
    variables: {
      query: {
        incident_id: incidentId,
      },
    },
  });

  useEffect(() => {
    globalHistory.listen(() => {
      refetchHistory();
    });
  }, []);

  useEffect(() => {
    if (incidentHistoryData?.history_incidents?.length > 0) {
      const lastVersion = incidentHistoryData.history_incidents[0];

      setIncidentTitle(`Incident ${lastVersion.incident_id}: ${lastVersion.title}`);

      const incidentHistory = [];

      for (let index = 0; index < incidentHistoryData.history_incidents.length - 1; index++) {
        const versionData = incidentHistoryData.history_incidents[index];

        const previousVersionData = incidentHistoryData.history_incidents[index + 1];

        const version = {
          ...versionData,
          modifiedByUser: usersData?.users.find((user) => user.userId === versionData.modifiedBy),
        };

        version.changes = getIncidentChanges(
          previousVersionData,
          versionData,
          usersData?.users,
          entitiesData?.entities
        );

        incidentHistory.push(version);
      }

      // The initial version
      const initialVersionData =
        incidentHistoryData.history_incidents[incidentHistoryData.history_incidents.length - 1];

      incidentHistory.push({
        ...initialVersionData,
        modifiedByUser: usersData?.users.find(
          (user) => user.userId === initialVersionData.modifiedBy
        ),
      });

      setIncidentHistory(incidentHistory);
    } else {
      setIncidentHistory([]);
    }
  }, [incidentHistoryData, usersData, entitiesData]);

  const loading =
    loadingIncidentHistory || loadingUsers || loadingEntities || incidentHistory === null;

  return (
    <div className={'w-full p-1'}>
      {loading && (
        <div className="flex">
          <DefaultSkeleton />
        </div>
      )}

      {!loading && Number.isNaN(incidentId) && (
        <div>
          <Trans>Invalid Incident ID</Trans>
        </div>
      )}

      {!loading && !Number.isNaN(incidentId) && (
        <>
          <div className="flex flex-row justify-between flex-wrap">
            <h1 className="text-2xl mb-5">{incidentTitle}</h1>
            <Link to={`/cite/${incidentId}`} className="hover:no-underline mb-5">
              <Button outline={true} color={'light'}>
                <Trans>Back to Incident {{ incidentId }}</Trans>
              </Button>
            </Link>
          </div>
          {!(incidentHistory?.length > 0) ? (
            <div>
              <Trans>There are no version history records for this Incident</Trans>
            </div>
          ) : (
            <div data-cy="history-table">
              <div className="mb-3">
                <h2 className="text-lg">
                  <Trans>Version History</Trans>
                </h2>
                <hr />
              </div>
              {incidentHistory.map((version, index) => {
                return (
                  <div key={`version_${index}`} className="py-2" data-cy="history-row">
                    <div className="flex font-semibold mb-2" data-cy="history-row-ribbon">
                      {version.epoch_date_modified && (
                        <div className="mr-5">
                          {format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}
                        </div>
                      )}
                      <div>
                        <Trans>Modified by</Trans>: {version.modifiedByUser?.first_name}{' '}
                        {version.modifiedByUser?.last_name}
                      </div>
                    </div>
                    <div className="flex flex-col flex-nowrap mb-3" data-cy="history-row-changes">
                      {!version.changes && (
                        <div>
                          <Trans>Initial version</Trans>
                        </div>
                      )}
                      {version.changes?.map((change, index) => {
                        return (
                          <div key={`change_${index}`} className="flex flex-row flex-nowrap">
                            <div className="flex w-64">{t(change.field)}</div>
                            {change.type == 'text' && (change.oldValue || change.newValue) && (
                              <div className="flex flex-1 m-1">
                                <StringDiff
                                  oldValue={change.oldValue ? change.oldValue : ''}
                                  newValue={change.newValue ? change.newValue : ''}
                                  method={DiffMethod.Words}
                                  styles={{
                                    added: { backgroundColor: '#def7ec', color: '#03543e' },
                                    removed: { backgroundColor: '#fde8e8', color: '#9b1c1c' },
                                    default: {},
                                  }}
                                />
                              </div>
                            )}
                            {change.type == 'list' &&
                              (change.removed?.length > 0 || change.added?.length > 0) && (
                                <>
                                  {change.removed?.map((item, index) => (
                                    <div
                                      key={`removed_${index}`}
                                      className="inline-block h-6 center bg-red-100 text-red-800 text-xs font-semibold m-1 px-2.5 py-1 rounded"
                                    >
                                      {item}
                                    </div>
                                  ))}
                                  {change.added?.map((item, index) => (
                                    <div
                                      key={`added_${index}`}
                                      className="inline-block h-6 center bg-green-100 text-green-800 text-xs font-semibold m-1 px-2.5 py-1 rounded"
                                    >
                                      {item}
                                    </div>
                                  ))}
                                </>
                              )}
                          </div>
                        );
                      })}
                    </div>
                    <hr />
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default IncidentHistoryPage;
