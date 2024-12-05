import React, { useEffect, useState } from 'react';
import { format, fromUnixTime } from 'date-fns';
import { useQuery } from '@apollo/client';
import { Modal, Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { RESPONSE_TAG, computeEntities } from 'utils/entities';
import { FIND_REPORTS } from '../../graphql/reports';
import CiteTemplate from 'templates/citeTemplate';
import { sortIncidentsByDatePublished } from 'utils/cite';
import { isCompleteReport } from 'utils/variants';
import DefaultSkeleton from 'elements/Skeletons/Default';

export default function IncidentVersionViewModal({
  show,
  onClose,
  entities,
  users,
  version,
  incidentClassifications,
  allMongodbAiidprodTaxa,
}) {
  const [loading, setLoading] = useState(true);

  const [sortedReports, setSortedReports] = useState([]);

  const [timeline, setTimeline] = useState(null);

  const { data: reportsData } = useQuery(FIND_REPORTS, {
    variables: { filter: { report_number: { IN: version.reports || [] } } },
  });

  const incidentEntitiesFields = {
    Alleged_deployer_of_AI_system: version.AllegedDeployerOfAISystem,
    Alleged_developer_of_AI_system: version.AllegedDeveloperOfAISystem,
    Alleged_harmed_or_nearly_harmed_parties: version.AllegedHarmedOrNearlyHarmedParties,
    implicated_systems: version.implicated_systems,
  };

  const incidentEntities = computeEntities({
    incidents: [incidentEntitiesFields],
    entities: entities,
    responses: [],
  });

  if (version.editors && version.editors.length > 0 && !version.editors[0]?.userId) {
    const editorsUsers = [];

    for (const editorId of version.editors) {
      const editorUser = users.find((user) => user.userId === editorId);

      if (editorUser) {
        editorsUsers.push(editorUser);
      }
    }
    version.editors = editorsUsers;
  }

  const variants = sortedReports.filter((report) => !isCompleteReport(report));

  useEffect(() => {
    if (reportsData?.reports) {
      const reports = reportsData?.reports.map((report) => {
        return { ...report };
      });

      const sortedIncidentReports = sortIncidentsByDatePublished(reports);

      const sortedReports = sortedIncidentReports.filter((report) => isCompleteReport(report));

      setSortedReports(sortedReports);

      const timeline = sortedReports.map(({ date_published, title, _id, report_number, tags }) => ({
        date_published,
        title,
        mongo_id: _id,
        report_number,
        isResponse: tags && tags.includes(RESPONSE_TAG),
      }));

      timeline.push({
        date_published: version.date,
        title: 'Incident Occurrence',
        mongodb_id: 0,
        isOccurrence: true,
      });

      setTimeline(timeline);
      setLoading(false);
    }
  }, [reportsData]);

  if (!show) {
    return null;
  }

  return (
    <Modal
      show={show}
      onClose={onClose}
      className="submission-modal"
      size="4xl"
      data-cy="version-view-modal"
    >
      <Modal.Header>
        <Trans>View Version details</Trans>
        <div className="flex gap-5 text-base mt-2">
          {version.modifiedByUser && (
            <div>
              <strong>Modified by</strong>: {version.modifiedByUser.first_name}{' '}
              {version.modifiedByUser.last_name}
            </div>
          )}
          {version.epoch_date_modified && (
            <div>
              <strong>Modified on</strong>:{' '}
              {format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}
            </div>
          )}
        </div>
      </Modal.Header>
      <Modal.Body>
        {loading && <DefaultSkeleton />}
        {!loading && (
          <CiteTemplate
            incident={version}
            sortedReports={sortedReports}
            variants={variants}
            metaTitle={version.title}
            entities={incidentEntities ?? []}
            timeline={timeline}
            locationPathName={null}
            allMongodbAiidprodTaxa={allMongodbAiidprodTaxa}
            allMongodbAiidprodClassifications={{ nodes: incidentClassifications }}
            nextIncident={null}
            prevIncident={null}
            nlp_similar_incidents={[]}
            editor_similar_incidents={[]}
            editor_dissimilar_incidents={[]}
            setIsLiveData={null}
            readOnly={true}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          <Trans>Close</Trans>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
