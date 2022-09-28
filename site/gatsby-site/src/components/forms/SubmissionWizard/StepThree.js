import { Button } from 'flowbite-react';
import { Formik, Form } from 'formik';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import StepContainer from './StepContainer';
import { graphql, useStaticQuery } from 'gatsby';
import TagsInputGroup from '../TagsInputGroup';

const StepThree = (props) => {
  const { t } = useTranslation(['submit']);

  const stepThreeValidationSchema = yup.object().shape({
    editor_notes: yup.string(),
    description: yup
      .string()
      .min(3, 'Description must have at least 3 characters')
      .max(200, "Description can't be longer than 200 characters")
      .when('_id', {
        is: (_id) => _id !== undefined,
        then: yup.string().required('*Incident Description required'),
      }),
    developers: yup
      .string()
      .min(3, 'Alleged Developer must have at least 3 characters')
      .max(200, "Alleged Developers can't be longer than 200 characters")
      .when('_id', {
        is: (_id) => _id !== undefined,
        then: yup.string().required('*Developer is required'),
      }),
    deployers: yup
      .string()
      .min(3, 'Alleged Deployers must have at least 3 characters')
      .max(200, "Alleged Deployers can't be longer than 200 characters")
      .when('_id', {
        is: (_id) => _id !== undefined,
        then: yup.string().required('*Deployer is required'),
      }),
    harmed_parties: yup
      .string()
      .min(3, 'Harmed Parties must have at least 3 characters')
      .max(200, "Harmed Parties can't be longer than 200 characters")
      .when('_id', {
        is: (_id) => _id !== undefined,
        then: yup.string().required('*Harm Parties is required'),
      }),
    image_url: yup
      .string()
      .matches(
        /((https?):\/\/)(\S)*$/,
        '*Must enter URL in http://www.example.com/images/preview.png format'
      ),
  });

  const handleSubmit = (values) => {
    props.next(values, true);
  };

  const data = useStaticQuery(graphql`
    query SubmissionFormQuery {
      allMongodbAiidprodReports {
        edges {
          node {
            tags
          }
        }
      }
    }
  `);

  const tags = [];

  for (const node of data.allMongodbAiidprodReports.edges) {
    if (node.node.tags) {
      for (const tag of node.node.tags) {
        if (!tags.includes(tag)) {
          tags.push(tag);
        }
      }
    }
  }

  return (
    <StepContainer name={props.name}>
      <Formik
        initialValues={props.data}
        onSubmit={handleSubmit}
        validationSchema={stepThreeValidationSchema}
        enableReinitialize
      >
        {(TextInputGroupProps) => (
          <Form>
            <TextInputGroup
              name="description"
              label={t('Description')}
              type="textarea"
              as="textarea"
              placeholder={t('Incident Description')}
              rows={3}
              className="mt-3"
              {...TextInputGroupProps}
              schema={stepThreeValidationSchema}
            />

            {!props.data.incident_id && (
              <>
                <TagsInputGroup
                  name="developers"
                  label={t('Alleged developer of AI system')}
                  placeholder={t('Who created or built the technology involved in the incident?')}
                  className="mt-3"
                  {...TextInputGroupProps}
                  schema={stepThreeValidationSchema}
                />

                <TagsInputGroup
                  name="deployers"
                  label={t('Alleged deployer of AI system')}
                  placeholder={t('Who employed or was responsible for the technology?')}
                  className="mt-3"
                  {...TextInputGroupProps}
                  schema={stepThreeValidationSchema}
                />

                <TagsInputGroup
                  name="harmed_parties"
                  label={t('Alleged harmed or nearly harmed parties')}
                  placeholder={t('Who experienced negative impacts?')}
                  className="mt-3"
                  {...TextInputGroupProps}
                  schema={stepThreeValidationSchema}
                />
              </>
            )}

            <TagsInputGroup
              name="tags"
              label={t('Tags')}
              className="mt-3"
              {...TextInputGroupProps}
              placeholder={t('Tags')}
              schema={stepThreeValidationSchema}
            />

            <TextInputGroup
              name="editor_notes"
              label={t('Editor Notes')}
              type="textarea"
              placeholder={t('Optional context and notes about the incident')}
              rows={8}
              className="mt-3"
              {...TextInputGroupProps}
              schema={stepThreeValidationSchema}
            />

            <div className="flex justify-between mt-4">
              <Button
                type="button"
                color={'light'}
                onClick={() => props.previous(TextInputGroupProps.values)}
              >
                <Trans>Previous</Trans>
              </Button>
              <Button gradientDuoTone="greenToBlue" type="submit">
                <Trans ns="submit">Submit</Trans>
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </StepContainer>
  );
};

export default StepThree;
