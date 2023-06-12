import { Badge, Button, Card, Label, Select, Spinner } from 'flowbite-react';
import { Link } from 'gatsby';
import React, { useEffect, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import SubmissionForm from './SubmissionForm';
import { Formik, useFormikContext } from 'formik';
import RelatedIncidents from 'components/RelatedIncidents';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { FIND_SUBMISSION, UPDATE_SUBMISSION } from '../../graphql/submissions';
import { schema } from './schemas';
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
import { STATUS } from 'utils/submissions';

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

const SubmissionEditForm = ({ handleSubmit, setSaving, userLoading, userData }) => {
  const { values, setFieldValue, isValid, submitForm, isSubmitting } = useFormikContext();

  const onChange = () => {
    setSaving(true);
    saveChanges(values);
  };

  const saveChanges = useRef(
    debounce(async (values) => {
      await handleSubmit(values);
      setSaving(false);
    }, 1000)
  ).current;

  return (
    <>
      <Card className="w-3/4 relative">
        <Badge className="absolute -top-3" color={STATUS[values.status].color}>
          {values.status}
        </Badge>
        <SubmissionForm onChange={onChange} />
        <RelatedIncidents incident={values} setFieldValue={setFieldValue} />
        <div className="flex items-center gap-3 text-red-500">
          {!isValid && (
            <Trans ns="validation">Please review submission. Some data is missing.</Trans>
          )}
          <Button
            onClick={submitForm}
            className="flex disabled:opacity-50"
            type="submit"
            disabled={isSubmitting || !isValid}
            data-cy="update-btn"
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                <div className="ml-2">
                  <Trans>Updating...</Trans>
                </div>
              </>
            ) : (
              <Trans>Update</Trans>
            )}
          </Button>
        </div>
      </Card>
      <div className="flex w-1/4 py-4 pl-6 items-center flex-col gap-8">
        <ProgressCircle percentage={77} />
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
            value={values.status}
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
          <Select className="w-full">
            <option>
              <Trans>New Incident</Trans>
            </option>
            <option>
              <Trans>New Issue</Trans>
            </option>
          </Select>
        </div>

        <div className="flex flex-col gap-2">
          <Button>
            <FontAwesomeIcon className="mr-2" icon={faCheck} />
            <Trans>Accept</Trans>
          </Button>
          <Button color={'failure'}>
            <FontAwesomeIcon className="mr-2" icon={faXmark} />
            <Trans>Reject</Trans>
          </Button>
        </div>
      </div>
    </>
  );
};

export default SubmissionEdit;
