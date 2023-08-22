import React from 'react';
import { format, fromUnixTime } from 'date-fns';
import { useQuery } from '@apollo/client';
import { Modal, Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import DefaultSkeleton from 'elements/Skeletons/Default';
import Row from 'elements/Row';
import Col from 'elements/Col';
import Container from 'elements/Container';
import Card from 'elements/Card';
import Link from 'components/ui/Link';
import AllegedEntities from 'components/entities/AllegedEntities';
import IncidentStatsCard from 'components/cite/IncidentStatsCard';
import { computeEntities } from 'utils/entities';
import { FIND_REPORTS } from '../../graphql/reports';

export default function IncidentVersionViewModal({
  show,
  onClose,
  entities,
  users,
  incidentVersionDetails: version,
}) {
  const { data: reportsData, loading: loadingReports } = useQuery(FIND_REPORTS, {
    variables: { query: { report_number_in: version.reports || [] } },
  });

  const incidentEntitiesFields = {
    Alleged_deployer_of_AI_system: version.AllegedDeployerOfAISystem,
    Alleged_developer_of_AI_system: version.AllegedDeveloperOfAISystem,
    Alleged_harmed_or_nearly_harmed_parties: version.AllegedHarmedOrNearlyHarmedParties,
  };

  const incidentEntities = computeEntities({
    incidents: [incidentEntitiesFields],
    entities: entities,
    responses: [],
  });

  version.editorsUsers = [];

  for (const editorId of version.editors) {
    const editorUser = users.find((user) => user.userId === editorId);

    if (editorUser) {
      version.editorsUsers.push(editorUser);
    }
  }

  if (!show) {
    return null;
  }

  return (
    <Modal show={show} onClose={onClose} className="submission-modal" size="3xl">
      <Modal.Header>
        <Trans>View Version details</Trans>
      </Modal.Header>

      {!version && (
        <Modal.Body>
          <Trans>Version not found</Trans>
        </Modal.Body>
      )}

      {version && (
        <>
          <Modal.Body>
            <div className="flex">
              <div className="shrink-1">
                <Row>
                  <Col>
                    <div>
                      <strong>Title</strong>: {version.title}
                    </div>
                  </Col>
                </Row>
                {version.modifiedByUser && (
                  <Row className="mt-2">
                    <Col>
                      <div>
                        <strong>Modified by</strong>: {version.modifiedByUser.first_name}{' '}
                        {version.modifiedByUser.last_name}
                      </div>
                    </Col>
                  </Row>
                )}
                {version.epoch_date_modified && (
                  <Row className="mt-2">
                    <Col>
                      <div>
                        <strong>Modified on</strong>:{' '}
                        {format(fromUnixTime(version.epoch_date_modified), 'yyyy-MM-dd hh:mm a')}
                      </div>
                    </Col>
                  </Row>
                )}
                <Row className="mt-2">
                  <Col>
                    <div>
                      <strong>Description</strong>: {version.description}
                    </div>
                  </Col>
                </Row>
                {version.editor_notes && version.editor_notes !== '' && (
                  <Row className="mt-2">
                    <Col>
                      <div>
                        <strong>Editor Notes</strong>: {version.editor_notes}
                      </div>
                    </Col>
                  </Row>
                )}
                <Container>
                  <Row>
                    <Col>
                      <Card className="border-1.5 border-border-light-gray rounded-5px shadow-card mt-6">
                        <Card.Header className="items-center justify-between">
                          <h4 className="m-0">
                            <Trans ns="entities">Entities</Trans>
                          </h4>
                          <Link to="/entities">
                            <Trans ns="entities">View all entities</Trans>
                          </Link>
                        </Card.Header>
                        <Card.Body className="block" data-cy="alleged-entities">
                          <AllegedEntities entities={incidentEntities ?? []} />
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                  <Row className="mt-6">
                    <Col>
                      <div data-cy={'incident-stats'}>
                        <IncidentStatsCard
                          {...{
                            incidentId: version.incident_id,
                            reportCount: version.reports.length,
                            incidentDate: version.date,
                            editors: version.editorsUsers
                              .map(({ first_name, last_name }) => `${first_name} ${last_name}`)
                              .join(', '),
                          }}
                        />
                      </div>
                    </Col>
                  </Row>
                  <Row className="mt-4">
                    <Col>
                      <Card className="flex flex-col shadow-card rounded-5px border-border-light-gray border-1.5">
                        <Card.Header>
                          <h4 className="m-0">
                            <Trans>Reports</Trans>
                          </h4>
                        </Card.Header>
                        <Card.Body className="max-w-full p-5">
                          {loadingReports && <DefaultSkeleton />}
                          {!loadingReports && (
                            <div className="flex flex-col gap-2">
                              {reportsData?.reports.map((report, index) => (
                                <div key={`version-report-${index}`}>
                                  <Link
                                    to={`/cite/${version.incident_id}#r${report.report_number}`}
                                    className="text-black"
                                  >
                                    #{report.report_number} - {report.title}
                                  </Link>
                                </div>
                              ))}
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </Container>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={onClose}>
              <Trans>Close</Trans>
            </Button>
          </Modal.Footer>
        </>
      )}
    </Modal>
  );
}
