import { Button, Spinner } from 'flowbite-react';
import { Formik, Form } from 'formik';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import StepContainer from './StepContainer';
import { graphql, useStaticQuery } from 'gatsby';
import TagsInputGroup from '../TagsInputGroup';
import { useUserContext } from 'contexts/userContext';
import FieldContainer from './FieldContainer';
import {
  faHandPointRight,
  faCode,
  faBolt,
  faTag,
  faAlignLeft,
  faStickyNote,
  faPenNib,
  faTenge,
} from '@fortawesome/free-solid-svg-icons';

const StepThree = (props) => {
  const { t } = useTranslation(['submit']);

  const [data, setData] = useState(props.data);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isRole } = useUserContext();

  const stepThreeValidationSchema = yup.object().shape({
    editor_notes: yup.string(),
    incident_title: yup.string(),
    incident_editors: yup
      .string()
      .matches(/^.{3,}$/, {
        excludeEmptyString: true,
        message: 'Incident Editor must have at least 3 characters',
      })
      .matches(/^.{3,200}$/, {
        excludeEmptyString: true,
        message: "Incident Editor can't be longer than 200 characters",
      })
      .nullable(),
    description: yup
      .string()
      .matches(/^.{3,}$/, {
        excludeEmptyString: true,
        message: 'Description must have at least 3 characters',
      })
      .matches(/^.{3,500}$/, {
        excludeEmptyString: true,
        message: "Description can't be longer than 500 characters",
      })
      .nullable(),
    developers: yup
      .string()
      .matches(/^.{3,}$/, {
        excludeEmptyString: true,
        message: 'Alleged Developer must have at least 3 characters',
      })
      .matches(/^.{3,200}$/, {
        excludeEmptyString: true,
        message: "Alleged Developers can't be longer than 200 characters",
      })
      .nullable(),
    deployers: yup
      .string()
      .matches(/^.{3,}$/, {
        excludeEmptyString: true,
        message: 'Alleged Deployers must have at least 3 characters',
      })
      .matches(/^.{3,200}$/, {
        excludeEmptyString: true,
        message: "Alleged Deployers can't be longer than 200 characters",
      })
      .nullable(),
    harmed_parties: yup
      .string()
      .matches(/^.{3,}$/, {
        excludeEmptyString: true,
        message: 'Harmed Parties must have at least 3 characters',
      })
      .matches(/^.{3,200}$/, {
        excludeEmptyString: true,
        message: "Harmed Parties can't be longer than 200 characters",
      })
      .nullable(),
  });

  const handleSubmit = (values) => {
    setIsSubmitting(true);
    props.next(values, true);
  };

  useEffect(() => {
    if (props.submissionFailed || props.submissionComplete) {
      setIsSubmitting(false);
    }
  }, [props.submissionFailed, props.submissionComplete]);

  useEffect(() => {
    setData(props.data);
  }, [props.data]);

  const staticQueryData = useStaticQuery(graphql`
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

  for (const node of staticQueryData.allMongodbAiidprodReports.edges) {
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
        initialValues={data}
        onSubmit={handleSubmit}
        validationSchema={stepThreeValidationSchema}
        enableReinitialize
      >
        {(TextInputGroupProps) => (
          <>
            <Form>
              {!data.incident_id && (
                <>
                  {isRole('incident_editor') && (
                    <FieldContainer>
                      <TextInputGroup
                        name="incident_title"
                        label={t('Incident Title')}
                        icon={faTenge}
                        placeholder={t('Incident title')}
                        className="mt-3"
                        schema={stepThreeValidationSchema}
                        {...TextInputGroupProps}
                      />
                    </FieldContainer>
                  )}

                  <FieldContainer>
                    <TextInputGroup
                      name="description"
                      label={t('Description')}
                      type="textarea"
                      as="textarea"
                      placeholder={t('Incident Description')}
                      rows={3}
                      schema={stepThreeValidationSchema}
                      icon={faAlignLeft}
                      {...TextInputGroupProps}
                    />
                  </FieldContainer>

                  {isRole('incident_editor') && (
                    <FieldContainer>
                      <TagsInputGroup
                        name="incident_editors"
                        label={t('Editors')}
                        icon={faPenNib}
                        className="mt-3"
                        schema={stepThreeValidationSchema}
                        {...TextInputGroupProps}
                      />
                    </FieldContainer>
                  )}

                  <FieldContainer>
                    <TagsInputGroup
                      name="deployers"
                      label={t('Alleged deployer of AI system')}
                      icon={faHandPointRight}
                      placeholder={t('Who employed or was responsible for the technology?')}
                      className="mt-3"
                      schema={stepThreeValidationSchema}
                      {...TextInputGroupProps}
                    />
                  </FieldContainer>

                  <FieldContainer>
                    <TagsInputGroup
                      name="developers"
                      label={t('Alleged developer of AI system')}
                      icon={faCode}
                      placeholder={t(
                        'Who created or built the technology involved in the incident?'
                      )}
                      className="mt-3"
                      schema={stepThreeValidationSchema}
                      {...TextInputGroupProps}
                    />
                  </FieldContainer>

                  <FieldContainer>
                    <TagsInputGroup
                      name="harmed_parties"
                      label={t('Alleged harmed or nearly harmed parties')}
                      icon={faBolt}
                      placeholder={t('Who experienced negative impacts?')}
                      className="mt-3"
                      schema={stepThreeValidationSchema}
                      {...TextInputGroupProps}
                    />
                  </FieldContainer>
                </>
              )}

              <FieldContainer>
                <TagsInputGroup
                  name="tags"
                  label={t('Tags')}
                  icon={faTag}
                  placeholder={t('Tags')}
                  schema={stepThreeValidationSchema}
                  {...TextInputGroupProps}
                />
              </FieldContainer>

              <FieldContainer>
                <TextInputGroup
                  name="editor_notes"
                  label={t('Editor Notes')}
                  icon={faStickyNote}
                  type="textarea"
                  placeholder={t('Optional context and notes about the incident')}
                  rows={8}
                  schema={stepThreeValidationSchema}
                  {...TextInputGroupProps}
                />
              </FieldContainer>

              <div className="flex justify-between mt-8">
                <Button
                  type="button"
                  color={'light'}
                  disabled={isSubmitting}
                  onClick={() => props.previous(TextInputGroupProps.values)}
                >
                  <svg
                    aria-hidden="true"
                    className="mr-2 w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  <Trans>Previous</Trans>
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting && (
                    <div className="mr-3">
                      <Spinner size="sm" light={true} />
                    </div>
                  )}
                  <Trans>Submit</Trans>
                </Button>
              </div>
            </Form>
            {!TextInputGroupProps.isValid && TextInputGroupProps.submitCount > 0 && (
              <div className="text-danger">
                <Trans ns="validation">Please review. Some data is missing.</Trans>
              </div>
            )}
          </>
        )}
      </Formik>
    </StepContainer>
  );
};

export default StepThree;
