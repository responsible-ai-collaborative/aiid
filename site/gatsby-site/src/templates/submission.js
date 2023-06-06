import React, { useEffect, useState } from 'react';
import AiidHelmet from 'components/AiidHelmet';
import Layout from 'components/Layout';
import { Trans } from 'react-i18next';
import Container from '../elements/Container';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import { graphql } from 'gatsby';
import { useUserContext } from 'contexts/userContext';
import { Formik } from 'formik';
import SubmissionForm from 'components/submissions/SubmissionForm';
import RelatedIncidents from 'components/RelatedIncidents';
import { Button, Spinner } from 'flowbite-react';
import { schema } from 'components/submissions/schemas';
import { useMutation, useQuery } from '@apollo/client';
import { FIND_ENTITIES, UPSERT_ENTITY } from '../graphql/entities';
import { processEntities } from 'utils/entities';
import { UPDATE_SUBMISSION } from '../graphql/submissions';
import isArray from 'lodash/isArray';
import { stripMarkdown } from 'utils/typography';
import useToastContext, { SEVERITY } from 'hooks/useToast';

function SubmissionPage(props) {
  const {
    data: { submission: submissionData },
  } = props;

  const [submission, setSubmission] = useState(submissionData);

  const { data: entitiesData } = useQuery(FIND_ENTITIES);

  const [createEntityMutation] = useMutation(UPSERT_ENTITY);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  // const { t } = useTranslation();

  const { locale } = useLocalization();

  const { loading } = useUserContext();

  const addToast = useToastContext();

  console.log(submissionData, entitiesData);

  useEffect(() => {
    setSubmission(submissionData);
  }, [submissionData]);

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

      // onHide();

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

  if (!submission) return <></>;

  return (
    <Layout {...props}>
      <AiidHelmet
        {...{
          metaTitle: `Submission ${submission.id}`,
          metaDescription: submission.description,
          path: props.location.pathname,
          metaImage: submission.image_url,
        }}
      >
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1 className="tw-styled-heading">
          {locale == 'en' ? `Submission ${submission.id}` : `Submission ${submission.id}`}
        </h1>
      </div>

      <Container>
        {!loading && submissionData && entitiesData?.entities && (
          <Formik
            validationSchema={schema}
            onSubmit={handleSubmit}
            initialValues={{
              ...submissionData,
              developers:
                submissionData.developers === null
                  ? []
                  : submissionData.developers.map((item) => item.name),
              deployers:
                submissionData.deployers === null
                  ? []
                  : submissionData.deployers.map((item) => item.name),
              harmed_parties:
                submissionData.harmed_parties === null
                  ? []
                  : submissionData.harmed_parties.map((item) => item.name),
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
        )}
      </Container>
    </Layout>
  );
}

export const query = graphql`
  query SubmissionPageQuery($id: String) {
    submission: mongodbAiidprodSubmissions(id: { eq: $id }) {
      id
      cloudinary_id
      title
      description
    }
  }
`;

export default SubmissionPage;
