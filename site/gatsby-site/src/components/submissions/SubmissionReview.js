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
import { useMutation, useQuery } from '@apollo/client';
import { FIND_INCIDENT } from '../../graphql/incidents';
import { DELETE_SUBMISSION, PROMOTE_SUBMISSION } from '../../graphql/submissions';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import SubmissionEditModal from './SubmissionEditModal';
import { Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';

const ListedGroup = ({ item, className = '', keysToRender }) => {
  return (
    <ListGroup className={className}>
      {keysToRender
        .filter((key) => !!item[key])
        .map((key) => (
          <ListGroup.Item key={key} className="flex gap-4" data-cy={key}>
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

  const [promoteSubmissionToReport] = useMutation(PROMOTE_SUBMISSION, {
    fetchPolicy: 'network-only',
  });

  const [promoting, setPromoting] = useState('');

  const isNewIncident = submission.incident_id === 0;

  const { i18n, t } = useTranslation(['submitted']);

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

  const promoteSubmission = useCallback(
    async ({ is_incident_report = true }) => {
      if (
        !is_incident_report &&
        !confirm(t('Sure you want to promote this Submission to an Issue?'))
      ) {
        return;
      }

      if (
        is_incident_report &&
        isNewIncident &&
        (!submission.description ||
          !submission.developers ||
          !submission.deployers ||
          !submission.harmed_parties)
      ) {
        addToast({
          message: t(`Please review submission before approving. Some data is missing.`),
          severity: SEVERITY.danger,
        });
        return;
      }

      setPromoting(is_incident_report ? 'incident' : 'issue');

      const {
        data: {
          promoteSubmissionToReport: {
            incident_ids: { 0: incident_id },
            report_number,
          },
        },
      } = await promoteSubmissionToReport({
        variables: {
          input: {
            submission_id: submission._id,
            incident_ids: isNewIncident ? [] : [submission.incident_id],
            is_incident_report,
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

      setPromoting('');

      if (is_incident_report) {
        if (isNewIncident) {
          addToast({
            message: (
              <Trans
                i18n={i18n}
                ns="submitted"
                incident_id={incident_id}
                report_number={report_number}
              >
                Successfully promoted submission to new Incident {{ incident_id }} and Report{' '}
                {{ report_number }}
              </Trans>
            ),
            severity: SEVERITY.success,
          });
        } else {
          addToast({
            message: (
              <Trans
                i18n={i18n}
                ns="submitted"
                incident_id={incident_id}
                report_number={report_number}
              >
                Successfully promoted submission to Report {{ report_number }} linked to Incident{' '}
                {{ incident_id }}
              </Trans>
            ),
            severity: SEVERITY.success,
          });
        }
      } else {
        addToast({
          message: (
            <Trans
              i18n={i18n}
              ns="submitted"
              incident_id={incident_id}
              report_number={report_number}
            >
              Successfully promoted submission to Issue {{ report_number }}
            </Trans>
          ),
          severity: SEVERITY.success,
        });
      }
    },
    [submission]
  );

  const rejectReport = async () => {
    await deleteSubmission({ variables: { _id: submission._id } });
  };

  const { data: incidentData } = useQuery(FIND_INCIDENT, {
    variables: { query: { incident_id: submission.incident_id } },
  });

  return (
    <>
      <Card.Header data-cy="submission">
        <Row className="flex items-center p-2">
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
          <Card.Footer className="flex text-muted-gray m-3">
            <Button
              className="mr-auto"
              data-cy="edit-submission"
              disabled={!isSubmitter}
              onClick={() => setIsEditing(true)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>

            <Button
              className="mr-2 text-xs md:text-base"
              variant="outline-primary"
              disabled={!isSubmitter || promoting}
              onClick={() => promoteSubmission({ is_incident_report: false })}
            >
              <div className="flex gap-2">
                {promoting === 'issue' && <Spinner size="sm" />}
                <Trans ns="submitted">Add New Issue</Trans>
              </div>
            </Button>

            <Button
              className="mr-2 text-xs md:text-base"
              variant="outline-primary"
              disabled={!isSubmitter || promoting}
              onClick={promoteSubmission}
            >
              <div className="flex gap-2">
                {promoting === 'incident' && <Spinner size="sm" />}
                {isNewIncident ? (
                  <Trans ns="submitted">Add New Incident</Trans>
                ) : (
                  <Trans ns="submitted">Add New Report</Trans>
                )}
              </div>
            </Button>
            <Button
              variant="outline-secondary"
              disabled={!isSubmitter || deleting}
              onClick={rejectReport}
              className="text-xs md:text-base"
            >
              <div className="flex gap-2">
                {deleting && <Spinner size="sm" />}
                {isNewIncident ? (
                  <Trans ns="submitted">Reject New Incident</Trans>
                ) : (
                  <Trans ns="submitted">Reject New Report</Trans>
                )}
              </div>
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
