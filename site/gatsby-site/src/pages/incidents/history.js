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

function IncidentHistoryPage() {
  const { t } = useTranslation();

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, 1));

  const [incidentTitle, setIncidentTitle] = useState(null);

  const [incidentHistory, setIncidentHistory] = useState(null);

  const { data: usersData, loading: loadingUsers } = useQuery(FIND_USERS_FIELDS_ONLY);

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const { data: incidentHistoryData, loading: loadingIncidentHistory } = useQuery(
    FIND_INCIDENT_HISTORY,
    {
      variables: {
        query: {
          incident_id: incidentId,
        },
      },
    }
  );

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
          modifiedByUser: usersData?.users.find((user) => user.user_id === versionData.modified_by),
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
          (user) => user.user_id === initialVersionData.modified_by
        ),
      });

      setIncidentHistory(incidentHistory);
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

      {!loading && (
        <div>
          <h1 className="text-2xl mb-5">{incidentTitle}</h1>
        </div>
      )}

      {!loading && (
        <>
          {!(incidentHistory.length > 0) ? (
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
                if (version.changes?.length === 0) {
                  return null;
                }
                return (
                  <div key={`version_${index}`} className="py-2" data-cy="history-row">
                    <div className="flex font-semibold mb-2" data-cy="history-row-ribbon">
                      <div className="mr-5">
                        {format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}
                      </div>
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
                            {(change.oldValue || change.newValue) && (
                              <>
                                <div className="flex flex-1 m-1 text-red-600">
                                  {change.oldValue}
                                </div>
                                <div className="flex flex-1 m-1 text-green-500">
                                  {change.newValue}
                                </div>
                              </>
                            )}
                            {(change.removed?.length > 0 || change.added?.length > 0) && (
                              <>
                                <div className="flex flex-1 flex-wrap">
                                  {change.removed?.map((item, index) => (
                                    <div
                                      key={`removed_${index}`}
                                      className="inline-block h-6 center bg-red-100 text-red-800 text-xs font-semibold m-1 px-2.5 py-1 rounded"
                                    >
                                      {item}
                                    </div>
                                  ))}
                                </div>
                                <div className="flex flex-1 flex-wrap">
                                  {change.added?.map((item, index) => (
                                    <div
                                      key={`added_${index}`}
                                      className="inline-block h-6 center bg-green-100 text-green-800 text-xs font-semibold m-1 px-2.5 py-1 rounded"
                                    >
                                      {item}
                                    </div>
                                  ))}
                                </div>
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
