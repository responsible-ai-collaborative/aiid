import React, { useEffect, useState } from 'react';
import { NumberParam, useQueryParam, withDefault } from 'use-query-params';
import {
  FIND_FULL_INCIDENT,
  FIND_INCIDENT_HISTORY,
  UPDATE_INCIDENT,
} from '../../graphql/incidents';
import { FIND_USERS } from '../../graphql/users';
import { FIND_ENTITIES } from '../../graphql/entities';
import { FIND_CLASSIFICATION } from '../../graphql/classifications';
import { useMutation, useQuery } from '@apollo/client/react/hooks';
import { useTranslation, Trans } from 'react-i18next';
import DefaultSkeleton from 'elements/Skeletons/Default';
import CustomButton from 'elements/Button';
import Link from 'components/ui/Link';
import IncidentVersionViewModal from 'components/incidents/IncidentVersionViewModal';
import { format, fromUnixTime, getUnixTime } from 'date-fns';
import { getIncidentChanges } from 'utils/cite';
import { StringDiff, DiffMethod } from 'react-string-diff';
import { Button, Spinner } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import { useLogIncidentHistory } from '../../hooks/useLogIncidentHistory';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { graphql } from 'gatsby';

function IncidentHistoryPage(props) {
  const allMongodbAiidprodTaxa = props.data.allMongodbAiidprodTaxa;

  const { t } = useTranslation();

  const { isRole, user } = useUserContext();

  const addToast = useToastContext();

  const [incidentId] = useQueryParam('incident_id', withDefault(NumberParam, Number.NaN));

  const [restoringVersion, setRestoringVersion] = useState(false);

  const [incidentTitle, setIncidentTitle] = useState(null);

  const [incidentHistory, setIncidentHistory] = useState(null);

  const [incidentVersionDetails, setIncidentVersionDetails] = useState(null);

  const [incident, setIncident] = useState(null);

  const [incidentClassifications, setIncidentClassifications] = useState([]);

  const { data: usersData, loading: loadingUsers } = useQuery(FIND_USERS);

  const { data: entitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES, {
    fetchPolicy: 'network-only',
  });

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const { logIncidentHistory } = useLogIncidentHistory();

  const { data: incidentData, loading: loadingIncident } = useQuery(FIND_FULL_INCIDENT, {
    fetchPolicy: 'network-only',
    variables: {
      filter: { incident_id: { EQ: incidentId } },
    },
  });

  const {
    data: incidentHistoryData,
    loading: loadingIncidentHistory,
    refetch: refetchHistory,
  } = useQuery(FIND_INCIDENT_HISTORY, {
    fetchPolicy: 'network-only',
    variables: {
      query: {
        incident_id: incidentId,
      },
    },
  });

  const { data: classificationsData, loading: loadingIncidentClassifications } = useQuery(
    FIND_CLASSIFICATION,
    {
      variables: { filter: { incidents: { EQ: incidentId } } },
    }
  );

  useEffect(() => {
    if (incidentData?.incident) {
      setIncident({ ...incidentData.incident });
    } else {
      setIncident(undefined);
    }
  }, [incidentData]);

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

  useEffect(() => {
    if (classificationsData?.classifications) {
      setIncidentClassifications(classificationsData.classifications);
    }
  }, [classificationsData]);

  const loading =
    loadingIncident ||
    loadingIncidentHistory ||
    loadingUsers ||
    loadingEntities ||
    loadingIncidentClassifications ||
    incidentHistory === null;

  const restoreVersion = async (version) => {
    if (confirm(t('Are you sure you want to restore this version?'))) {
      try {
        setRestoringVersion(true);

        const updatedIncident = {
          ...version,
          modifiedByUser: undefined,
          modifiedBy: undefined,
          __typename: undefined,
          _id: undefined,
          changes: undefined,
          epoch_date_modified: getUnixTime(new Date()),
          editor_notes: version.editor_notes ? version.editor_notes : '',
        };

        updatedIncident.reports = { link: version.reports };
        updatedIncident.AllegedDeployerOfAISystem = { link: version.AllegedDeployerOfAISystem };
        updatedIncident.AllegedDeveloperOfAISystem = { link: version.AllegedDeveloperOfAISystem };
        updatedIncident.AllegedHarmedOrNearlyHarmedParties = {
          link: version.AllegedHarmedOrNearlyHarmedParties,
        };
        updatedIncident.editors = { link: version.editors };

        // Add the current user to the list of editors
        if (
          user &&
          user.providerType != 'anon-user' &&
          !updatedIncident.editors.link.includes(user.id)
        ) {
          updatedIncident.editors.link = updatedIncident.editors.link.concat(user.id);
        }

        updatedIncident.nlp_similar_incidents = version.nlp_similar_incidents
          ? version.nlp_similar_incidents.map((nlp) => {
              return { ...nlp, __typename: undefined };
            })
          : [];

        if (version.embedding) {
          updatedIncident.embedding = { ...version.embedding, __typename: undefined };
        }

        if (version.tsne) {
          updatedIncident.tsne = { ...version.tsne, __typename: undefined };
        }

        await updateIncident({
          variables: {
            filter: { incident_id: { EQ: incidentId } },
            update: { set: updatedIncident },
          },
        });

        await logIncidentHistory(
          {
            ...incident,
            ...updatedIncident,
          },
          user
        );

        await refetchHistory();

        addToast({
          message: t('Incident version restored successfully.'),
          severity: SEVERITY.success,
        });

        setRestoringVersion(false);
      } catch (error) {
        setRestoringVersion(false);
        addToast({
          message: t('Error restoring Incident version.'),
          severity: SEVERITY.danger,
          error,
        });
      }
    }
  };

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
              {restoringVersion && (
                <div className="font-semibold mb-2" data-testid="restoring-message">
                  <div className="flex gap-3 mb-2">
                    <Trans>Restoring version</Trans>
                    <Spinner />
                  </div>
                  <hr />
                </div>
              )}
              {incidentHistory.map((version, index) => {
                return (
                  <div key={`version_${index}`} className="py-2" data-cy="history-row">
                    <div className="flex font-semibold mb-2 gap-5" data-cy="history-row-ribbon">
                      {version.epoch_date_modified && (
                        <div>
                          {format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}
                        </div>
                      )}
                      {(version.modifiedByUser?.first_name ||
                        version.modifiedByUser?.last_name) && (
                        <div>
                          <Trans>Modified by</Trans>: {version.modifiedByUser?.first_name}{' '}
                          {version.modifiedByUser?.last_name}
                        </div>
                      )}
                      <CustomButton
                        variant="link"
                        title={t('View full version')}
                        className="underline text-black p-0 border-0"
                        data-cy="view-full-version-button"
                        onClick={() => setIncidentVersionDetails(version)}
                      >
                        <Trans>View full version</Trans>
                      </CustomButton>
                      {index > 0 && isRole('incident_editor') && (
                        <CustomButton
                          variant="link"
                          title={t('Restore Version')}
                          className="underline text-black p-0 border-0"
                          data-cy="restore-button"
                          onClick={() => restoreVersion(version)}
                          disabled={restoringVersion}
                        >
                          <Trans>Restore Version</Trans>
                        </CustomButton>
                      )}
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
      {incidentVersionDetails && (
        <IncidentVersionViewModal
          show={true}
          onClose={() => setIncidentVersionDetails(null)}
          entities={entitiesData?.entities}
          users={usersData?.users}
          version={incidentVersionDetails}
          incidentClassifications={incidentClassifications}
          allMongodbAiidprodTaxa={allMongodbAiidprodTaxa}
        />
      )}
    </div>
  );
}

export const query = graphql`
  query CitationPageQuery {
    allMongodbAiidprodTaxa {
      nodes {
        id
        namespace
        weight
        description
        complete_entities
        dummy_fields {
          field_number
          short_name
        }
        field_list {
          field_number
          short_name
          long_name
          short_description
          long_description
          display_type
          mongo_type
          default
          placeholder
          permitted_values
          weight
          instant_facet
          required
          public
          complete_from {
            all
            current
            entities
          }
          subfields {
            field_number
            short_name
            long_name
            short_description
            long_description
            display_type
            mongo_type
            default
            placeholder
            permitted_values
            weight
            instant_facet
            required
            public
            complete_from {
              all
              current
              entities
            }
          }
        }
      }
    }
  }
`;

export default IncidentHistoryPage;
