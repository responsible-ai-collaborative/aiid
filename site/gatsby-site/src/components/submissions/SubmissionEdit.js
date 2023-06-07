import { Badge, Button, Card, Spinner } from 'flowbite-react';
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

const SubmissionEdit = ({ id }) => {
  console.log(id);

  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [findSubmission, { data, loading }] = useLazyQuery(FIND_SUBMISSION);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

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

      <div className="flex">
        {!loading && data?.submission && entitiesData?.entities && (
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
                </>
              )}
            </Formik>
          </Card>
        )}
        <div className="flex w-1/4 p-4">Right side</div>
      </div>
    </div>
  );
};

export default SubmissionEdit;
