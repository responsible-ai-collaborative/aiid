import React, { useEffect, useState } from 'react';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { FIND_INCIDENT_HISTORY } from '../../graphql/incidents';
import { FIND_USERS_FIELDS_ONLY } from '../../graphql/users';
import { useQuery } from '@apollo/client/react/hooks';
import { useTranslation, Trans } from 'react-i18next';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { format, fromUnixTime } from 'date-fns';
import { getIncidentChanges } from 'utils/cite';

function IncidentHistoryPage() {
  const { t } = useTranslation();

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, 1));

  const [incidentTitle, setIncidentTitle] = useState(null);

  const [incidentHistory, setIncidentHistory] = useState([]);

  const { data: usersData, loading: loadingUsers } = useQuery(FIND_USERS_FIELDS_ONLY);

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

        console.log(version);

        version.changes = getIncidentChanges(previousVersionData, versionData);

        incidentHistory.push(version);
      }

      setIncidentHistory(incidentHistory);
    }
  }, [incidentHistoryData, usersData]);

  const loading = loadingIncidentHistory && loadingUsers;

  return (
    <div className={'w-full p-1'}>
      {!loading && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="text-2xl mb-5">{incidentTitle}</h1>
        </div>
      )}

      {loading && (
        <div className="flex">
          <DefaultSkeleton />
        </div>
      )}

      {!loading && (
        <>
          {!(incidentHistoryData?.history_incidents?.length > 0) ? (
            <div>There are no version history records for this incident</div>
          ) : (
            <>
              {incidentHistory.map((version, index) => {
                return (
                  <div key={`version_${index}`} className="py-3">
                    <div className="flex">
                      <div className="mr-5">
                        {format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}
                      </div>
                      <div>
                        <Trans>Modified by</Trans>: {version.modifiedByUser?.first_name}{' '}
                        {version.modifiedByUser?.last_name}
                      </div>
                    </div>
                    <div className="mb-3">
                      {version.changes.map((change, index) => {
                        return (
                          <div key={`change_${index}`} className="flex">
                            <div className="mr-5">{t(change.field)}</div>
                            {change.oldValue && change.newValue && (
                              <>
                                <div className="mr-5 text-red-600">{change.oldValue}</div>
                                <div className="text-green-500">{change.newValue}</div>
                              </>
                            )}
                            {change.removed?.map((item, index) => (
                              <div key={`removed_${index}`} className="mr-5 text-red-600">
                                {item}
                              </div>
                            ))}
                            {change.added?.map((item, index) => (
                              <div key={`added_${index}`} className="mr-5 text-green-500">
                                {item}
                              </div>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                    <hr />
                  </div>
                );
              })}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default IncidentHistoryPage;
