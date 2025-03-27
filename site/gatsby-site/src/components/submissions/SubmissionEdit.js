import { Button } from 'flowbite-react';
import { Link } from 'gatsby';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../../graphql/entities';
import { format, getUnixTime } from 'date-fns';
import { FIND_SUBMISSION, UPDATE_SUBMISSION } from '../../graphql/submissions';
import { schema } from './schemas';
import { stripMarkdown } from 'utils/typography';
import { processEntities } from 'utils/entities';
import isArray from 'lodash/isArray';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faSpinner } from '@fortawesome/free-solid-svg-icons';
import DefaultSkeleton from 'elements/Skeletons/Default';
import { FIND_USERS_BY_ROLE } from '../../graphql/users';
import SubmissionEditForm from './SubmissionEditForm';

const SubmissionEdit = ({ id }) => {
  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [findSubmission, { data, loading }] = useLazyQuery(FIND_SUBMISSION);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const { data: userData, loading: userLoading } = useQuery(FIND_USERS_BY_ROLE, {
    variables: { role: ['incident_editor', 'admin'] },
  });

  const addToast = useToastContext();

  useEffect(() => {
    findSubmission({ variables: { filter: { _id: { EQ: id } } } });
  }, [id]);

  const [saving, setSaving] = useState(false);

  const [submission, setSubmission] = useState(null);

  const { i18n } = useTranslation(['submitted']);

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

      update.implicated_systems = await processEntities(
        entities,
        values.implicated_systems,
        createEntityMutation
      );

      if (update.nlp_similar_incidents) {
        update.nlp_similar_incidents = update.nlp_similar_incidents.map((nlp) => {
          return { ...nlp, __typename: undefined };
        });
      }

      if (update.incident_editors) {
        const userIds = update.incident_editors.map((user) => user.userId);

        update.incident_editors = { link: userIds };
      }

      const now = new Date();

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
        date_modified: format(now, 'yyyy-MM-dd'),
        epoch_date_modified: getUnixTime(now),
      };

      await updateSubmission({
        variables: {
          filter: {
            _id: { EQ: values._id },
          },
          update: { set: updatedSubmission },
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
    <div data-cy="submission">
      <div className="flex flex-row justify-between flex-wrap">
        <h1 className="mb-5">
          <Trans i18n={i18n} ns="submitted">
            Editing Submission
          </Trans>
        </h1>
        <div className="flex items-center gap-2">
          <span className={`${saving ? 'text-orange-400' : 'text-gray-400'} text-sm mb-5`}>
            {saving ? (
              <>
                <FontAwesomeIcon icon={faSpinner} className="mr-1" />{' '}
                <Trans i18n={i18n} ns="submitted">
                  Saving changes...
                </Trans>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faCheck} className="mr-1" />
                <Trans i18n={i18n} ns="submitted">
                  Changes saved
                </Trans>
              </>
            )}
          </span>
          <Link to={`/apps/submitted/`} className="hover:no-underline mb-5">
            <Button outline={true} color={'light'}>
              <Trans i18n={i18n} ns="submitted">
                Back to Submission List
              </Trans>
            </Button>
          </Link>
        </div>
      </div>
      {loading ? (
        <DefaultSkeleton />
      ) : (
        <>
          {!loading && submission && entitiesData?.entities && (
            <div className="flex md:flex-row flex-col" data-cy="submission-form">
              <Formik
                validationSchema={schema}
                onSubmit={handleSubmit}
                initialValues={{
                  ...submission,
                  developers:
                    submission.developers === null
                      ? []
                      : submission.developers.filter((item) => item.name).map((item) => item.name),
                  deployers:
                    submission.deployers === null
                      ? []
                      : submission.deployers.filter((item) => item.name).map((item) => item.name),
                  harmed_parties:
                    submission.harmed_parties === null
                      ? []
                      : submission.harmed_parties
                          .filter((item) => item.name)
                          .map((item) => item.name),
                  implicated_systems:
                    submission.implicated_systems === null ||
                    submission.implicated_systems === undefined
                      ? []
                      : submission.implicated_systems
                          .filter((item) => item.name)
                          .map((item) => item.name),
                }}
              >
                <SubmissionEditForm
                  handleSubmit={handleSubmit}
                  setSaving={setSaving}
                  userData={userData}
                  userLoading={userLoading}
                  saving={saving}
                />
              </Formik>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SubmissionEdit;
