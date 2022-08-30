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
import ReadMoreText from '../../components/ReadMoreText';
import RelatedIncidents from '../../components/RelatedIncidents';
import isArray from 'lodash/isArray';
import { useUserContext } from '../../contexts/userContext';
import { UPDATE_REPORT } from '../../graphql/reports';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_INCIDENT, UPDATE_INCIDENT } from '../../graphql/incidents';
import { DELETE_SUBMISSION, PROMOTE_SUBMISSION } from '../../graphql/submissions';
import { FIND_SUBSCRIPTIONS } from '../../graphql/subscriptions';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { format, getUnixTime } from 'date-fns';
import SubmissionEditModal from './SubmissionEditModal';
import { Spinner } from 'react-bootstrap';
import Link from '../../components/ui/Link';
import { Trans, useTranslation } from 'react-i18next';
import sendEmail from '../../utils/email';
import { realmApp } from '../../services/realmApp';

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
              {isArray(item[key]) ? item[key].join(', ') : item[key]}
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

const otherDetails = ['language', '_id', 'developers', 'deployers', 'harmed_parties'];

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

  const isNewIncident = submission.incident_id === 0;

  const { i18n } = useTranslation(['submitted']);

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

  let subscriptionsData;

  if (!isNewIncident) {
    const findSubscriptionsResult = useQuery(FIND_SUBSCRIPTIONS, {
      variables: { query: { incident_id: { incident_id: submission.incident_id } } },
    });

    subscriptionsData = findSubscriptionsResult.data;
  }

  const promoteSubmission = useCallback(async () => {
    if (!submission.developers || !submission.deployers || !submission.harmed_parties) {
      addToast({
        message: `Please review submission before approving. Some data is missing.`,
        severity: SEVERITY.danger,
      });
      return;
    }
    const {
      data: {
        promoteSubmissionToReport: { 0: incident },
      },
    } = await promoteSubmissionToReport({
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: isNewIncident ? [] : [submission.incident_id],
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

    const report = {
      ...submission,
      incident_id: undefined,
      deployers: undefined,
      developers: undefined,
      harmed_parties: undefined,
      _id: undefined,
      __typename: undefined,
      nlp_similar_incidents: undefined,
      editor_similar_incidents: undefined,
      editor_dissimilar_incidents: undefined,
    };

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

    if (isNewIncident) {
      await updateIncident({
        variables: {
          query: {
            incident_id: incident.incident_id,
          },
          set: {
            title: submission.title,
            date: submission.incident_date,
            description: submission.description,
          },
        },
      });
    }

    const incident_id = incident.incident_id;

    // Process subscriptions to incident updates
    if (subscriptionsData?.subscriptions?.length > 0) {
      const userIds = subscriptionsData.subscriptions.map(
        (subscription) => subscription.userId.userId
      );

      const userEmails = userIds
        .map((userId) => {
          const user = realmApp.allUsers[userId];

          return user && user.profile ? user.profile.email : null;
        })
        .filter((userEmail) => userEmail != null);

      await sendEmail({
        to: userEmails,
        subject: 'Incident {{incidentId}} was updated',
        templateFileName: 'incidentUpdated',
        text: 'Incident {{incident_id}}: "{{incident_title}}" was updated.',
        data: {
          incidentId: `${incident_id}`,
          incidentTitle: incident.title,
          incidentUrl: `https://incidentdatabase.ai/cite/${incident_id}`,
          reportUrl: `https://incidentdatabase.ai/cite/${incident_id}#r${report_number}`,
          reportTitle: report.title,
          reportAuthor: report.authors[0],
        },
        userIds,
      });
    }

    addToast({
      message: isNewIncident ? (
        <Trans i18n={i18n} ns="submitted" incident_id={incident_id} report_number={report_number}>
          Successfully promoted submission to Incident {{ incident_id }} and Report{' '}
          {{ report_number }}
        </Trans>
      ) : (
        <Trans i18n={i18n} ns="submitted" incident_id={incident_id} report_number={report_number}>
          Successfully promoted submission to{' '}
          <Link to={`/cite/${incident_id}`}>
            Incident {{ incident_id }} and Report {{ report_number }}
          </Link>
        </Trans>
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
              data-cy="review-button"
            >
              <Trans>review</Trans> &gt;
            </Button>
          </Col>
          <Col xs={12} sm={10} lg={10}>
            {' '}
            {submission['title']}
            <br />
            <Badge bg="secondary">
              Inc: {submission.incident_date || incidentData?.incident?.date}
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

          <Card className="m-3" data-cy="text">
            <Card.Header>Text</Card.Header>
            <Card.Body>
              <ReadMoreText text={submission.text} visibility={open} />
            </Card.Body>
          </Card>

          {submission.editor_notes && (
            <Card className="m-3" data-cy="editor_notes">
              <Card.Header>Editor Notes</Card.Header>
              <Card.Body>
                <ReadMoreText text={submission.editor_notes} visibility={open} />
              </Card.Body>
            </Card>
          )}

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
              {isNewIncident ? (
                <Trans ns="submitted">Add New Incident</Trans>
              ) : (
                <Trans ns="submitted">Add New Report</Trans>
              )}
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
              {isNewIncident ? (
                <Trans ns="submitted">Reject New Incident</Trans>
              ) : (
                <Trans ns="submitted">Reject New Report</Trans>
              )}
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
