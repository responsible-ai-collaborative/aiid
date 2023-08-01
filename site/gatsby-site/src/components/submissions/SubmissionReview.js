import React, { useCallback, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import ReadMoreText from '../../components/ReadMoreText';
import RelatedIncidents from '../../components/RelatedIncidents';
import isArray from 'lodash/isArray';
import isObject from 'lodash/isObject';
import { useUserContext } from '../../contexts/userContext';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import { DELETE_SUBMISSION, PROMOTE_SUBMISSION } from '../../graphql/submissions';
import { UPSERT_SUBSCRIPTION } from '../../graphql/subscriptions';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import SubmissionEditModal from './SubmissionEditModal';
import { Badge, Button, Card, ListGroup, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { incidentSchema, issueSchema, reportSchema } from './schemas';
import { arrayToList } from 'utils/typography';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';

const ListedGroup = ({ item, className = '', keysToRender, objectKeyToDisplay = '' }) => {
  return (
    <ListGroup className={className}>
      {keysToRender
        .filter((key) => !!item[key])
        .map((key) => (
          <div
            key={key}
            className="flex flex-row justify-between gap-4 px-5 py-3 border-b last:border-none"
            data-cy={key}
          >
            <div>
              <b>{key}</b>
            </div>
            <div style={{ overflowWrap: 'anywhere' }}>
              {isArray(item[key])
                ? arrayToList(item[key].map((i) => (isObject(i) ? i[objectKeyToDisplay] : i)))
                : item[key]}
            </div>
          </div>
        ))}
    </ListGroup>
  );
};

const leadItems = ['source_domain', 'authors', 'submitters', 'incident_ids'];

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
  const { isRole, user } = useUserContext();

  const [isEditing, setIsEditing] = useState(false);

  const [open, setOpen] = useState(false);

  const isSubmitter = isRole('submitter');

  const [promoteSubmissionToReport] = useMutation(PROMOTE_SUBMISSION, {
    fetchPolicy: 'network-only',
  });

  const [subscribeToNewReportsMutation] = useMutation(UPSERT_SUBSCRIPTION);

  const [subscribeToNewSubmissionPromotionMutation] = useMutation(UPSERT_SUBSCRIPTION);

  const promoteSubmission = ({ submission, variables }) =>
    promoteSubmissionToReport({
      variables,
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

  const subscribeToNewReports = async (incident_id, userId = null) => {
    if (!user && !userId) {
      return;
    }

    const subscriptionUsers = [];

    if (userId) {
      subscriptionUsers.push(userId);
    }

    if (user) {
      subscriptionUsers.push(user.id);
    }

    subscriptionUsers.forEach(async (userId) => {
      await subscribeToNewReportsMutation({
        variables: {
          query: {
            type: SUBSCRIPTION_TYPE.incident,
            userId: { userId },
            incident_id: { incident_id: incident_id },
          },
          subscription: {
            type: SUBSCRIPTION_TYPE.incident,
            userId: {
              link: userId,
            },
            incident_id: {
              link: incident_id,
            },
          },
        },
      });
    });
  };

  const [promoting, setPromoting] = useState('');

  const isNewIncident = submission.incident_ids.length === 0;

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

  const validateSchema = async ({ submission, schema }) => {
    try {
      await schema.validate(submission);
    } catch (e) {
      const [error] = e.errors;

      addToast({
        message: t(error),
        severity: SEVERITY.danger,
        error: e,
      });

      return false;
    }

    return true;
  };

  const promoteToIssue = useCallback(async () => {
    if (!(await validateSchema({ submission, schema: issueSchema }))) {
      return;
    }

    if (
      !confirm(
        t(
          'Are you sure this is a new issue? Any data entered that is associated with incident records will not be added'
        )
      )
    ) {
      return;
    }

    setPromoting('issue');

    const {
      data: {
        promoteSubmissionToReport: { report_number },
      },
    } = await promoteSubmission({
      submission,
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: [],
          is_incident_report: false,
        },
      },
    });

    addToast({
      message: (
        <Trans i18n={i18n} ns="submitted" report_number={report_number}>
          Successfully promoted submission to Issue {{ report_number }}
        </Trans>
      ),
      severity: SEVERITY.success,
    });

    setPromoting('');
  }, [submission]);

  const promoteToReport = useCallback(async () => {
    if (!(await validateSchema({ submission, schema: reportSchema }))) {
      return;
    }

    if (
      !confirm(
        t('Sure you want to promote this Submission and link it to Incident {{ incident_id }}?', {
          incident_id: submission.incident_id,
        })
      )
    ) {
      return;
    }

    setPromoting('incident');

    const {
      data: {
        promoteSubmissionToReport: { report_number, incident_ids },
      },
    } = await promoteSubmission({
      submission,
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: submission.incident_ids,
          is_incident_report: true,
        },
      },
    });

    for (const incident_id of incident_ids) {
      await subscribeToNewReports(incident_id);

      addToast({
        message: (
          <Trans i18n={i18n} ns="submitted" incident_id={incident_id} report_number={report_number}>
            Successfully promoted submission to Incident {{ incident_id }} and Report{' '}
            {{ report_number }}
          </Trans>
        ),
        severity: SEVERITY.success,
      });
    }

    setPromoting('');
  }, [submission]);

  const promoteToIncident = useCallback(async () => {
    if (!(await validateSchema({ submission, schema: incidentSchema }))) {
      return;
    }

    if (
      !confirm(
        t(
          'Are you sure this is a new incident? This will create a permanent record with all the details you provided about the incident.'
        )
      )
    ) {
      return;
    }

    setPromoting('incident');

    const {
      data: {
        promoteSubmissionToReport: { report_number, incident_ids },
      },
    } = await promoteSubmission({
      submission,
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: [],
          is_incident_report: true,
        },
      },
    });

    const incident_id = incident_ids[0];

    await subscribeToNewReports(incident_id);

    if (submission.user) {
      await subscribeToNewSubmissionPromotionMutation({
        variables: {
          query: {
            type: SUBSCRIPTION_TYPE.submissionPromoted,
            userId: { userId: submission.user.userId },
            incident_id: { incident_id: incident_id },
          },
          subscription: {
            type: SUBSCRIPTION_TYPE.submissionPromoted,
            userId: {
              link: submission.user.userId,
            },
            incident_id: {
              link: incident_id,
            },
          },
        },
      });
    }

    addToast({
      message: (
        <Trans i18n={i18n} ns="submitted" incident_id={incident_id} report_number={report_number}>
          Successfully promoted submission to Incident {{ incident_id }} and Report{' '}
          {{ report_number }}
        </Trans>
      ),
      severity: SEVERITY.success,
    });

    setPromoting('');
  }, [submission]);

  const rejectReport = async () => {
    await deleteSubmission({ variables: { _id: submission._id } });
  };

  const { data: incidentsData } = useQuery(FIND_INCIDENTS, {
    variables: { query: { incident_id_in: submission.incident_ids } },
  });

  return (
    <>
      <div className="flex md:flex-nowrap flex-wrap items-center p-2" data-cy="submission">
        <div className="mr-10">
          <Button
            onClick={() => setOpen(!open)}
            aria-controls="collapse-incident-submission"
            aria-expanded={open}
            data-cy="review-button"
            className="text-xs"
          >
            <Trans>review</Trans>
            <svg
              aria-hidden="true"
              className="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Button>
        </div>
        <div>
          {' '}
          <h5>{submission['title']}</h5>
          <div className="flex gap-2 flex-wrap">
            {submission.incident_date ? (
              <Badge>Inc: {submission.incident_date}</Badge>
            ) : (
              incidentsData?.incidents?.map((incident) => (
                <Badge key={incident.incident_id}>Inc: {incident.date}</Badge>
              ))
            )}
            <Badge>Pub: {submission.date_published}</Badge>{' '}
            <Badge>Sub: {submission.date_submitted}</Badge>{' '}
            {submission.submitters.map((submitter) => (
              <Badge key={submitter}>{submitter}</Badge>
            ))}
          </div>
        </div>
      </div>
      {open && (
        <>
          <div id="collapse-incident-submission" className="pt-3">
            <ListedGroup className="mx-3" item={submission} keysToRender={leadItems} />
            <ListedGroup className="mt-2 mx-3" item={submission} keysToRender={dateRender} />
            <ListedGroup className="mt-2 mx-3" item={submission} keysToRender={urls} />
            <ListedGroup
              className="mt-2 mx-3"
              item={submission}
              keysToRender={otherDetails}
              objectKeyToDisplay="name"
            />

            <Card className="m-3" data-cy="text">
              <h5>Text</h5>
              <div>
                <ReadMoreText text={submission.text} visibility={open} />
              </div>
            </Card>

            {submission.editor_notes && (
              <Card className="m-3" data-cy="editor_notes">
                <h5>Editor Notes</h5>
                <div>
                  <ReadMoreText text={submission.editor_notes} visibility={open} />
                </div>
              </Card>
            )}

            {open && (
              <div className="mx-3">
                <h5>Possible related incidents</h5>
                <RelatedIncidents incident={submission} />
              </div>
            )}
            <div className="flex text-muted-gray m-3">
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
                onClick={() => promoteToIssue()}
              >
                <div className="flex gap-2">
                  {promoting === 'issue' && <Spinner size="sm" />}
                  <Trans ns="submitted">Add as issue</Trans>
                </div>
              </Button>

              <Button
                className="mr-2 text-xs md:text-base"
                variant="outline-primary"
                disabled={!isSubmitter || promoting}
                onClick={() => (isNewIncident ? promoteToIncident() : promoteToReport())}
              >
                <div className="flex gap-2">
                  {promoting === 'incident' && <Spinner size="sm" />}
                  {isNewIncident ? (
                    <Trans ns="submitted">Add new Incident</Trans>
                  ) : submission.incident_ids.length == 1 ? (
                    <Trans ns="submitted" id={submission.incident_ids[0]}>
                      Add to incident {{ id: submission.incident_ids[0] }}
                    </Trans>
                  ) : (
                    <Trans ns="submitted" ids={arrayToList(submission.incident_ids)}>
                      Add to incidents {{ ids: arrayToList(submission.incident_ids) }}
                    </Trans>
                  )}
                </div>
              </Button>
              <Button
                variant="outline-secondary"
                disabled={!isSubmitter || deleting || promoting}
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
            </div>
          </div>
        </>
      )}
      <SubmissionEditModal
        show={isEditing}
        onHide={() => setIsEditing(false)}
        submissionId={submission._id}
      />
    </>
  );
};

export default SubmissionReview;
