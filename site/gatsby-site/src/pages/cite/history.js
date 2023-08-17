import React, { useEffect, useState } from 'react';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import { FIND_REPORT_HISTORY } from '../../graphql/reports';
import { FIND_USERS_FIELDS_ONLY } from '../../graphql/users';
import { useQuery } from '@apollo/client/react/hooks';
import { useTranslation, Trans } from 'react-i18next';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { format, fromUnixTime } from 'date-fns';
import { getReportChanges } from 'utils/reports';
import { Viewer } from '@bytemd/react';
import { StringDiff, DiffMethod } from 'react-string-diff';
import diff from 'rich-text-diff';
import Link from 'components/ui/Link';
import { Button } from 'flowbite-react';

function IncidentHistoryPage() {
  const { t } = useTranslation();

  const [reportNumber] = useQueryParam('report_number', withDefault(NumberParam, 1));

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, 1));

  const [incidentTitle, setIncidentTitle] = useState(null);

  const [incidentHistory, setIncidentHistory] = useState([]);

  const { data: usersData, loading: loadingUsers } = useQuery(FIND_USERS_FIELDS_ONLY);

  const { data: reportHistoryData, loading: loadingReportHistory } = useQuery(FIND_REPORT_HISTORY, {
    fetchPolicy: 'network-only',
    variables: {
      query: {
        report_number: reportNumber,
      },
    },
  });

  useEffect(() => {
    if (reportHistoryData?.history_reports?.length > 0) {
      const lastVersion = reportHistoryData.history_reports[0];

      setIncidentTitle(`Report #${lastVersion.report_number}: ${lastVersion.title}`);

      const incidentHistory = [];

      for (let index = 0; index < reportHistoryData.history_reports.length - 1; index++) {
        const versionData = reportHistoryData.history_reports[index];

        const previousVersionData = reportHistoryData.history_reports[index + 1];

        const version = {
          ...versionData,
          modifiedByUser: usersData?.users.find((user) => user.userId === versionData.modifiedBy),
        };

        version.changes = getReportChanges(previousVersionData, versionData);

        incidentHistory.push(version);
      }

      // The initial version
      const initialVersionData =
        reportHistoryData.history_reports[reportHistoryData.history_reports.length - 1];

      incidentHistory.push({
        ...initialVersionData,
        modifiedByUser: usersData?.users.find(
          (user) => user.userId === initialVersionData.modifiedBy
        ),
      });

      setIncidentHistory(incidentHistory);
    }
  }, [reportHistoryData, usersData]);

  const loading = loadingReportHistory || loadingUsers;

  return (
    <div className={'w-full p-1'}>
      {!loading && (
        <div className="flex flex-row justify-between flex-wrap">
          <h1 className="text-2xl mb-5">{incidentTitle}</h1>
          <Link to={`/cite/${incidentId}#r${reportNumber}`} className="hover:no-underline mb-5">
            <Button outline={true} color={'light'}>
              <Trans>Back to Report {{ reportNumber }}</Trans>
            </Button>
          </Link>
        </div>
      )}

      {loading && (
        <div className="flex">
          <DefaultSkeleton />
        </div>
      )}

      {!loading && (
        <>
          {!(reportHistoryData?.history_reports?.length > 0) ? (
            <div>
              <Trans>There are no version history records for this Report</Trans>
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

                            {change.type == 'rich_text' && (change.oldValue || change.newValue) && (
                              <div className="flex flex-1 m-1 richtext-diff">
                                <Viewer value={diff(change.oldValue, change.newValue)} />
                              </div>
                            )}
                            {change.type == 'image' && (change.oldValue || change.newValue) && (
                              <>
                                <div className="flex flex-1 m-1 text-red-600">
                                  <Image
                                    className="h-[320px] object-cover w-full"
                                    publicID={change.oldValue}
                                    alt="Old Image"
                                    transformation={fill().height(640)}
                                    plugins={[]}
                                    itemIdentifier={`change_${index}`}
                                  />
                                </div>
                                <div className="flex flex-1 m-1 text-green-500">
                                  <Image
                                    className="h-[320px] object-cover w-full"
                                    publicID={change.newValue}
                                    alt="New Image"
                                    transformation={fill().height(640)}
                                    plugins={[]}
                                    itemIdentifier={`change_${index}`}
                                  />
                                </div>
                              </>
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
