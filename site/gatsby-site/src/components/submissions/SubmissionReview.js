import React, { useCallback, useState } from 'react';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Collapse from 'react-bootstrap/Collapse';
import Badge from 'react-bootstrap/Badge';
import ListGroup from 'react-bootstrap/ListGroup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import ReadMoreText from 'components/ReadMoreText';
import RelatedIncidents from 'components/RelatedIncidents';

import { useUserContext } from 'contexts/userContext';
import { UPDATE_REPORT } from '../../graphql/reports';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { DELETE_SUBMISSION, PROMOTE_SUBMISSION } from '../../graphql/submissions';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { format, getUnixTime } from 'date-fns';
import SubmissionEditModal from './SubmissionEditModal';
import { Spinner } from 'react-bootstrap';

const ListedGroup = ({ item, className = '', keysToRender }) => {
  return (
    <ListGroup className={className}>
      {keysToRender
        .filter((key) => !!item[key])
        .map((key) => (
          <ListGroup.Item key={key} className="d-flex gap-4" data-cy={key}>
            <div style={{ width: 140 }} className="flex-grow">
              <b>{key}</b>
            </div>
            <div className="text-break">
              {item[key] == 'object' && item[key] !== null ? item[key].join(', ') : item[key]}
            </div>
          </ListGroup.Item>
        ))}
    </ListGroup>
  );
};

const leadItems = ['source_domain', 'authors', 'submitters', 'incident_id'];

const urls = ['url', 'image_url'];

const dateRender = [
  'incident_date',
  'date_published',
  'date_submitted',
  'date_downloaded',
  'date_modified',
];

const otherDetails = ['language', '_id'];

const SubmissionReview = ({ submission }) => {
  const { isRole } = useUserContext();

  const [isEditing, setIsEditing] = useState(false);

  const [open, setOpen] = useState(false);

  const isSubmitter = isRole('submitter');

  const [promoteSubmissionToReport, { loading: promoting }] = useMutation(PROMOTE_SUBMISSION, {
    fetchPolicy: 'network-only',
  });

  const [updateReport] = useMutation(UPDATE_REPORT);

  const [updateIncident] = useMutation(UPDATE_INCIDENT);

  const [deleteSubmission, { loading: deleting }] = useMutation(DELETE_SUBMISSION, {
    update: (cache, { data }) => {
      // Apollo expects a `deleted` boolean field otherwise manual cache manipulation is needed
      cache.evict({
        id: cache.identify({
          __typename: data.deleteOneSubmission.__typename,
          id: data.deleteOneSubmission._id,
        }),
      });
    },
  });

  const addToast = useToastContext();

  const promoteSubmission = useCallback(async () => {
    const {
      data: {
        promoteSubmissionToReport: { 0: incident },
      },
    } = await promoteSubmissionToReport({
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: submission.incident_id === 0 ? [] : [submission.incident_id],
        },
      },
      fetchPolicy: 'no-cache',
      update: (cache) => {
        cache.modify({
          fields: {
            submissions(refs, { readField }) {
              return refs.filter((s) => submission._id !== readField('_id', s));
            },
          },
        });
      },
    });

    const report = { ...submission, incident_id: undefined, _id: undefined, __typename: undefined };

    report.date_modified = format(new Date(), 'yyyy-MM-dd');

    report.epoch_date_modified = getUnixTime(new Date(report.date_modified));
    report.epoch_date_published = getUnixTime(new Date(report.date_published));
    report.epoch_date_downloaded = getUnixTime(new Date(report.date_downloaded));
    report.epoch_date_submitted = getUnixTime(new Date(report.date_submitted));

    const report_number = incident.reports
      .sort((a, b) => b.report_number - a.report_number)
      .shift().report_number;

    await updateReport({
      variables: {
        query: {
          report_number,
        },
        set: {
          ...report,
        },
      },
    });

    if (submission.incident_id === 0) {
      await updateIncident({
        variables: {
          query: {
            incident_id: incident.incident_id,
          },
          set: {
            title: submission.title,
            date: submission.incident_date,
            description: '',
            AllegedDeployerOfAISystem: [],
            AllegedDeveloperOfAISystem: [],
            AllegedHarmedOrNearlyHarmedParties: [],
          },
        },
      });
    }

    addToast({
      message: (
        <>
          Successfully promoted submission to Incident {incident.incident_id} and Report{' '}
          {report_number}{' '}
        </>
      ),
      severity: SEVERITY.success,
    });
  }, [submission]);

  const rejectReport = async () => {
    await deleteSubmission({ variables: { _id: submission._id } });
  };

  const { data: incidentData } = useQuery(FIND_INCIDENT, {
    variables: { query: { incident_id: submission.incident_id } },
  });

  return (
    <>
      <Card.Header data-cy="submission">
        <Row>
          <Col xs={12} sm={2} lg={2}>
            <Button
              onClick={() => setOpen(!open)}
              aria-controls="collapse-incident-submission"
              aria-expanded={open}
            >
              review &gt;
            </Button>
          </Col>
          <Col xs={12} sm={10} lg={10}>
            {' '}
            {submission['title']}
            <br />
            <Badge bg="secondary">
              Inc: {submission.incident_date || incidentData?.incident.date}
            </Badge>{' '}
            <Badge bg="secondary">Pub: {submission.date_published}</Badge>{' '}
            <Badge bg="secondary">Sub: {submission.date_submitted}</Badge>{' '}
            {submission.submitters.map((submitter) => (
              <Badge key={submitter} bg="secondary">
                {submitter}
              </Badge>
            ))}
          </Col>
        </Row>
      </Card.Header>
      <Collapse in={open}>
        <div id="collapse-incident-submission" className="pt-3">
          <ListedGroup className="mx-3" item={submission} keysToRender={leadItems} />
          <ListedGroup className="mt-2 mx-3" item={submission} keysToRender={dateRender} />
          <ListedGroup className="mt-2 mx-3" item={submission} keysToRender={urls} />
          <ListedGroup className="mt-2 mx-3" item={submission} keysToRender={otherDetails} />

          <Card className="m-3">
            <Card.Header>Text</Card.Header>
            <Card.Body>
              <ReadMoreText text={submission.text} visibility={open} />
            </Card.Body>
          </Card>

          {open && (
            <div className="mx-3">
              <h5>Possible related incidents</h5>
              <RelatedIncidents incident={submission} />
            </div>
          )}
          <Card.Footer className="d-flex text-muted">
            <Button
              className="me-auto"
              data-cy="edit-submission"
              disabled={!isSubmitter}
              onClick={() => setIsEditing(true)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
            <Button
              className="me-2"
              variant="outline-primary"
              disabled={!isSubmitter || promoting}
              onClick={promoteSubmission}
            >
              {submission.incident_id === 0 ? <>Add New Incident</> : <>Add New Report</>}
              {promoting && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="ms-2"
                />
              )}
            </Button>
            <Button
              variant="outline-secondary"
              disabled={!isSubmitter || deleting}
              onClick={rejectReport}
            >
              {submission.incident_id === 0 ? <>Reject New Incident</> : <>Reject New Report</>}
              {deleting && (
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="ms-2"
                  variant="secondary"
                />
              )}
            </Button>
          </Card.Footer>
        </div>
      </Collapse>
      <SubmissionEditModal
        show={isEditing}
        onHide={() => setIsEditing(false)}
        submissionId={submission._id}
      />
    </>
  );
};

export default SubmissionReview;
