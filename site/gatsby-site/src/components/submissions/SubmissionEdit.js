import { Badge, Button, Card, Label, Select, Spinner } from 'flowbite-react';
import { Link } from 'gatsby';
import React, { useEffect } from 'react';
import { Trans } from 'react-i18next';
import SubmissionForm from './SubmissionForm';
import { Formik } from 'formik';
import RelatedIncidents from 'components/RelatedIncidents';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { FIND_SUBMISSION, UPDATE_SUBMISSION } from '../../graphql/submissions';
import { schema } from './schemas';
import { stripMarkdown } from 'utils/typography';
import { processEntities } from 'utils/entities';
import isArray from 'lodash/isArray';
import ProgressCircle from 'elements/ProgessCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsProgress,
  faCheck,
  faPlusSquare,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { FIND_USERS_BY_ROLE } from '../../graphql/users';

const SubmissionEdit = ({ id }) => {
  console.log(id);

  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [findSubmission, { data, loading }] = useLazyQuery(FIND_SUBMISSION);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const { data: userData, loading: userLoading } = useQuery(FIND_USERS_BY_ROLE, {
    variables: { role: 'editor' },
  });

  console.log('userData', userData);

  const addToast = useToastContext();

  useEffect(() => {
    findSubmission({ variables: { query: { _id: id } } });
  }, [id]);

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

      await updateSubmission({
        variables: {
          query: {
            _id: values._id,
          },
          set: {
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
          },
        },
      });

      addToast({
        message: `Submission updated successfully.`,
        severity: SEVERITY.success,
      });
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
        <Link to={`/apps/submitted/`} className="hover:no-underline mb-5">
          <Button outline={true} color={'light'}>
            <Trans>Back to Submission List</Trans>
          </Button>
        </Link>
      </div>
      {loading ? (
        <DefaultSkeleton />
      ) : (
        <>
          {!loading && data?.submission && entitiesData?.entities && (
            <div className="flex">
              <Card className="w-3/4 relative">
                <Badge className="absolute -top-3" color={'success'}>
                  In Review
                </Badge>
                <Formik
                  validationSchema={schema}
                  onSubmit={handleSubmit}
                  initialValues={{
                    ...data.submission,
                    developers:
                      data.submission.developers === null
                        ? []
                        : data.submission.developers.map((item) => item.name),
                    deployers:
                      data.submission.deployers === null
                        ? []
                        : data.submission.deployers.map((item) => item.name),
                    harmed_parties:
                      data.submission.harmed_parties === null
                        ? []
                        : data.submission.harmed_parties.map((item) => item.name),
                  }}
                >
                  {({ isValid, isSubmitting, submitForm, values, setFieldValue }) => (
                    <>
                      <SubmissionForm />
                      <RelatedIncidents incident={values} setFieldValue={setFieldValue} />
                      <div className="flex items-center gap-3 text-red-500">
                        {!isValid && (
                          <Trans ns="validation">
                            Please review submission. Some data is missing.
                          </Trans>
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
                    </>
                  )}
                </Formik>
              </Card>
              <div className="flex w-1/4 py-4 pl-6 items-center flex-col gap-8">
                <ProgressCircle percentage={77} />
                <div className="flex flex-col w-full items-center gap-2">
                  <Label>
                    <FontAwesomeIcon icon={faUser} className="mr-2" />
                    <Trans>Assignee</Trans>
                  </Label>
                  <Select className="w-full">
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
                  <Select className="w-full">
                    <option>
                      <Trans>In Review</Trans>
                    </option>
                    <option>
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubmissionEdit;
