import { Badge, Button, Label, Select } from 'flowbite-react';
import { Link } from 'gatsby';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import SubmissionForm from './SubmissionForm';
import { Formik, useFormikContext } from 'formik';
import RelatedIncidents from 'components/RelatedIncidents';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import {
  DELETE_SUBMISSION,
  FIND_SUBMISSION,
  PROMOTE_SUBMISSION,
  UPDATE_SUBMISSION,
} from '../../graphql/submissions';
import { incidentSchema, issueSchema, schema } from './schemas';
import { stripMarkdown } from 'utils/typography';
import { processEntities } from 'utils/entities';
import isArray from 'lodash/isArray';
import isString from 'lodash/isString';
import ProgressCircle from 'elements/ProgessCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsProgress,
  faCheck,
  faPlusSquare,
  faSpinner,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { FIND_USERS_BY_ROLE } from '../../graphql/users';
import { debounce } from 'debounce';
import { STATUS, getRowCompletionStatus } from 'utils/submissions';
import StepContainer from 'components/forms/SubmissionWizard/StepContainer';
import { useUserContext } from 'contexts/userContext';
import { UPSERT_SUBSCRIPTION } from '../../graphql/subscriptions';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';
import isEmpty from 'lodash/isEmpty';

const SubmissionEdit = ({ id }) => {
  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [findSubmission, { data, loading }] = useLazyQuery(FIND_SUBMISSION);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const { data: userData, loading: userLoading } = useQuery(FIND_USERS_BY_ROLE, {
    variables: { role: 'editor' },
  });

  const addToast = useToastContext();

  useEffect(() => {
    findSubmission({ variables: { query: { _id: id } } });
  }, [id]);

  const [saving, setSaving] = useState(false);

  const [submission, setSubmission] = useState(null);

  useEffect(() => {
    if (data?.submission) {
      setSubmission({
        ...data.submission,
      });
    }
  }, [data]);

  const handleSubmit = async (values) => {
    try {
      const update = { ...values, __typename: undefined, _id: undefined };

      const { entities } = entitiesData;

      update.deployers = await processEntities(entities, values.deployers, createEntityMutation);

      update.developers = await processEntities(entities, values.developers, createEntityMutation);

      update.harmed_parties = await processEntities(
        entities,
        values.harmed_parties,
        createEntityMutation
      );

      if (update.nlp_similar_incidents) {
        update.nlp_similar_incidents = update.nlp_similar_incidents.map((nlp) => {
          return { ...nlp, __typename: undefined };
        });
      }

      if (update.editor) {
        update.editor = { link: isString(update.editor) ? update.editor : update.editor.userId };
      }

      const updatedSubmission = {
        ...update,
        incident_id: update.incident_id === '' ? 0 : update.incident_id,
        authors: !isArray(values.authors)
          ? values.authors.split(',').map((s) => s.trim())
          : values.authors,
        submitters: values.submitters
          ? !isArray(values.submitters)
            ? values.submitters.split(',').map((s) => s.trim())
            : values.submitters
          : ['Anonymous'],
        plain_text: await stripMarkdown(update.text),
      };

      await updateSubmission({
        variables: {
          query: {
            _id: values._id,
          },
          set: updatedSubmission,
        },
      });

      setSaving(false);
      setSubmission(values);
    } catch (e) {
      addToast({
        message: `Error updating submission ${values._id}`,
        severity: SEVERITY.danger,
        error: e,
      });
    }
  };

  return (
    <div>
      <div className="flex flex-row justify-between flex-wrap">
        <h1 className="mb-5">
          <Trans>Editing Submission</Trans>
        </h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-400 text-sm mb-5">
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="mr-1" />{' '}
                <Trans>Saving changes...</Trans>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                <Trans>Changes saved</Trans>
              </>
            )}
          </span>
          <Link to={`/apps/submitted/`} className="hover:no-underline mb-5">
            <Button outline={true} color={'light'}>
              <Trans>Back to Submission List</Trans>
            </Button>
          </Link>
        </div>
      </div>
      {loading ? (
        <DefaultSkeleton />
      ) : (
        <>
          {!loading && submission && entitiesData?.entities && (
            <div className="flex">
              <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                  ...submission,
                  developers:
                    data?.submission.developers === null
                      ? []
                      : data?.submission.developers.map((item) => item.name),
                  deployers:
                    data?.submission.deployers === null
                      ? []
                      : data?.submission.deployers.map((item) => item.name),
                  harmed_parties:
                    data?.submission.harmed_parties === null
                      ? []
                      : data?.submission.harmed_parties.map((item) => item.name),
                }}
              >
                <SubmissionEditForm
                  handleSubmit={handleSubmit}
                  setSaving={setSaving}
                  userData={userData}
                  userLoading={userLoading}
                />
              </Formik>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SubmissionEditForm = ({ handleSubmit, saving, setSaving, userLoading, userData }) => {
  const [promoType, setPromoType] = useState('incident');

  const [promoting, setPromoting] = useState('');

  const [completion, setCompletion] = useState(0);

  const { values, touched, setFieldValue, isValid } = useFormikContext();

  useEffect(() => {
    const completion = getRowCompletionStatus(Object.values(values));

    setCompletion(completion);
    if (!isEmpty(touched)) {
      setSaving(true);
      saveChanges(values);
    }
  }, [values, touched]);

  const saveChanges = useRef(
    debounce(async (values) => {
      await handleSubmit(values);
      const completion = getRowCompletionStatus(Object.values(values));

      setCompletion(completion);
      setSaving(false);
    }, 1000)
  ).current;

  const addToast = useToastContext();

  const { i18n, t } = useTranslation(['submitted']);

  const [promoteSubmissionToReport] = useMutation(PROMOTE_SUBMISSION, {
    fetchPolicy: 'network-only',
  });

  const [subscribeToNewReportsMutation] = useMutation(UPSERT_SUBSCRIPTION);

  const [deleteSubmission] = useMutation(DELETE_SUBMISSION, {
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

  const { user } = useUserContext();

  const subscribeToNewReports = async (incident_id) => {
    if (user) {
      await subscribeToNewReportsMutation({
        variables: {
          query: {
            type: SUBSCRIPTION_TYPE.incident,
            userId: { userId: user.id },
            incident_id: { incident_id: incident_id },
          },
          subscription: {
            type: SUBSCRIPTION_TYPE.incident,
            userId: {
              link: user.id,
            },
            incident_id: {
              link: incident_id,
            },
          },
        },
      });
    }
  };

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
    if (!(await validateSchema({ submission: values, schema: issueSchema }))) {
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
      submission: values,
      variables: {
        input: {
          submission_id: values._id,
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
  }, [values]);

  const promoteToIncident = useCallback(async () => {
    if (!(await validateSchema({ submission: values, schema: incidentSchema }))) {
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
      submission: values,
      variables: {
        input: {
          submission_id: values._id,
          incident_ids: [],
          is_incident_report: true,
        },
      },
    });

    const incident_id = incident_ids[0];

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

    setPromoting('');
  }, [values]);

  const rejectReport = async () => {
    await deleteSubmission({ variables: { _id: values._id } });
  };

  const promote = () => {
    if (promoType === 'incident') {
      promoteToIncident();
    } else if (promoType === 'issue') {
      promoteToIssue();
    }
  };

  const reject = () => {
    rejectReport();
  };

  return (
    <>
      <StepContainer className="h-[calc(100vh-230px)] overflow-auto p-6">
        <Badge
          className="absolute -top-3 z-10"
          color={values.status ? STATUS[values.status].color : 'warning'}
        >
          {values.status || 'Pending Review'}
        </Badge>
        <SubmissionForm />
        <RelatedIncidents incident={values} setFieldValue={setFieldValue} />
        <div className="flex items-center gap-3 text-red-500">
          {!isValid && (
            <Trans ns="validation">Please review submission. Some data is missing.</Trans>
          )}
        </div>
      </StepContainer>
      <div className="flex w-1/4 py-4 pl-6 items-center flex-col gap-8">
        <ProgressCircle percentage={completion} />
        <div className="flex flex-col w-full items-center gap-2">
          <Label>
            <FontAwesomeIcon icon={faUser} className="mr-2" />
            <Trans>Assignee</Trans>
          </Label>
          <Select
            className="w-full"
            onChange={(e) => {
              setSaving(true);
              saveChanges({ ...values, editor: e.target.value });
              setFieldValue('editor', e.target.value);
            }}
            value={values.editor?.userId}
          >
            <option value={null}>
              <Trans>Unassigned</Trans>
            </option>
            {!userLoading && (
              <>
                {userData.users.map((user) => {
                  return (
                    <option key={user.userId} value={user.userId}>
                      {user.first_name} {user.last_name}
                    </option>
                  );
                })}
              </>
            )}
          </Select>
        </div>
        <div className="flex flex-col w-full items-center gap-2">
          <Label>
            <FontAwesomeIcon icon={faBarsProgress} className="mr-2" />
            <Trans>Status</Trans>
          </Label>
          <Select
            className="w-full"
            value={values.status || 'Pending Review'}
            onChange={(e) => {
              setSaving(true);
              saveChanges({ ...values, status: e.target.value });
              setFieldValue('status', e.target.value);
            }}
          >
            <option value="In Review">
              <Trans>In Review</Trans>
            </option>
            <option value="Pending Review">
              <Trans>Pending Review</Trans>
            </option>
          </Select>
        </div>
        <div className="flex flex-col w-full items-center gap-2">
          <Label>
            <FontAwesomeIcon icon={faPlusSquare} className="mr-2" />
            <Trans>Add as</Trans>
          </Label>
          <Select
            value={promoType}
            className="w-full"
            onChange={(e) => setPromoType(e.target.value)}
          >
            <option value={'incident'}>
              <Trans>New Incident</Trans>
            </option>
            <option value={'issue'}>
              <Trans>New Issue</Trans>
            </option>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Button onClick={promote} disabled={saving}>
            <FontAwesomeIcon className="mr-2" icon={faCheck} />
            <Trans>Accept</Trans>
          </Button>
          <Button color={'failure'} onClick={reject} disabled={saving}>
            <FontAwesomeIcon className="mr-2" icon={faXmark} />
            <Trans>Reject</Trans>
          </Button>
        </div>
        {promoting !== '' && <Trans>Promoting to {promoting}</Trans>}
      </div>
    </>
  );
};

export default SubmissionEdit;
