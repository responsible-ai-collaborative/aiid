import { Button } from 'flowbite-react';
import { Formik, Form, useFormikContext } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
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
import { debounce } from 'debounce';
import UsersInputGroup from '../UsersInputGroup';
import SubmissionButton from './SubmissionButton';

const StepThree = (props) => {
  const [data, setData] = useState(props.data);

  const stepThreeValidationSchema = yup.object().shape({
    editor_notes: yup.string(),
    incident_title: yup.string(),
    incident_editors: yup.array().of(yup.string()).nullable(),
    description: yup
      .string()
      .matches(/^[\s\S]{3,}$/, {
        excludeEmptyString: true,
        message: 'Description must have at least 3 characters',
      })
      .matches(/^[\s\S]{3,500}$/, {
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
    props.next(values, true);
  };

  useEffect(() => {
    setData({ ...props.data });
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
      allMongodbAiidprodEntities {
        nodes {
          name
        }
      }
    }
  `);

  const entityNames = staticQueryData.allMongodbAiidprodEntities.nodes
    .map((node) => node.name)
    .sort();

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
    <StepContainer name={props.name} childClassName="p-6">
      <Formik
        initialValues={data}
        onSubmit={() => {}}
        validationSchema={stepThreeValidationSchema}
        enableReinitialize
      >
        <FormDetails
          data={data}
          previous={props.previous}
          schema={stepThreeValidationSchema}
          submitForm={handleSubmit}
          validateAndSubmitForm={props.validateAndSubmitForm}
          submissionFailed={props.submissionFailed}
          entityNames={entityNames}
          setSavingInLocalStorage={props.setSavingInLocalStorage}
          submissionComplete={props.submissionComplete}
          submissionReset={props.submissionReset}
        />
      </Formik>
    </StepContainer>
  );
};

const FormDetails = ({
  data,
  previous,
  schema,
  submitForm,
  validateAndSubmitForm,
  submissionFailed,
  submissionComplete,
  submissionReset,
  entityNames,
  setSavingInLocalStorage,
}) => {
  const { t } = useTranslation(['submit']);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [submitCount, setSubmitCount] = useState(0);

  const { isRole } = useUserContext();

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    setFieldTouched,
    isValid,
    validateForm,
    resetForm,
  } = useFormikContext();

  useEffect(() => {
    Object.keys(errors).map((key) => {
      setFieldTouched(key, true);
    });
  }, [data, errors]);

  useEffect(() => {
    if (submissionFailed || submissionComplete || submissionReset.reset) {
      setIsSubmitting(false);
      setSubmitCount(0);
    }

    if (submissionComplete || submissionReset.reset) {
      resetForm();
    }
  }, [submissionFailed, submissionComplete, submissionReset]);

  const saveInLocalStorage = useRef(
    debounce((values) => {
      localStorage.setItem('formValues', JSON.stringify(values));
      setSavingInLocalStorage(false);
    }, 1000)
  ).current;

  useEffect(() => {
    // Save form values to local storage when form values change
    setSavingInLocalStorage(true);
    saveInLocalStorage(values);
  }, [values]);

  return (
    <>
      <Form>
        {data.incident_ids.length == 0 && (
          <>
            {isRole('incident_editor') && (
              <FieldContainer>
                <TextInputGroup
                  name="incident_title"
                  label={t('Incident Title', { ns: 'variants' })}
                  icon={faTenge}
                  placeholder={t('Incident Title', { ns: 'variants' })}
                  schema={schema}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  touched={touched}
                  values={values}
                  errors={errors}
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
                schema={schema}
                icon={faAlignLeft}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                values={values}
                errors={errors}
              />
            </FieldContainer>

            {isRole('incident_editor') && (
              <FieldContainer>
                <UsersInputGroup
                  name="incident_editors"
                  label={t('Editors', { ns: 'translation' })}
                  placeholder={t('Editors', { ns: 'translation' })}
                  icon={faPenNib}
                  schema={schema}
                  errors={errors}
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
                schema={schema}
                options={entityNames}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                values={values}
                errors={errors}
              />
            </FieldContainer>

            <FieldContainer>
              <TagsInputGroup
                name="developers"
                label={t('Alleged developer of AI system')}
                icon={faCode}
                placeholder={t('Who created or built the technology involved in the incident?')}
                className="mt-3"
                schema={schema}
                options={entityNames}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                values={values}
                errors={errors}
              />
            </FieldContainer>

            <FieldContainer>
              <TagsInputGroup
                name="harmed_parties"
                label={t('Alleged harmed or nearly harmed parties')}
                icon={faBolt}
                placeholder={t('Who experienced negative impacts?')}
                className="mt-3"
                schema={schema}
                options={entityNames}
                handleChange={handleChange}
                handleBlur={handleBlur}
                touched={touched}
                values={values}
                errors={errors}
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
            schema={schema}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            values={values}
            errors={errors}
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
            schema={schema}
            handleChange={handleChange}
            handleBlur={handleBlur}
            touched={touched}
            values={values}
            errors={errors}
          />
        </FieldContainer>

        <div className="flex justify-between mt-8">
          <Button
            type="button"
            color={'light'}
            disabled={isSubmitting}
            onClick={() => previous(values)}
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

          <SubmissionButton
            type="submit"
            data-cy="submit-step-3"
            disabled={isSubmitting}
            onClick={() => {
              setSubmitCount(submitCount + 1);
              validateAndSubmitForm(
                false,
                setIsSubmitting,
                isValid,
                validateForm,
                setFieldTouched,
                values,
                submitForm
              );
            }}
          />
        </div>
      </Form>
      {!isValid && submitCount > 0 && (
        <div className="text-danger">
          <Trans ns="validation">Please review. Some data is missing.</Trans>
        </div>
      )}
    </>
  );
};

export default StepThree;
