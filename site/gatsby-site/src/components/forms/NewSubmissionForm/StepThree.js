import { Button } from 'flowbite-react';
import { Formik, Form } from 'formik';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import { Form as BsForm } from 'react-bootstrap';
import TagsControl from '../TagsControl';
import StepContainer from './StepContainer';

const StepThree = (props) => {
  const { t } = useTranslation(['submit']);

  const stepOneValidationSchema = yup.object().shape({
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

  return (
    <StepContainer name={props.name}>
      <Formik
        initialValues={props.data}
        onSubmit={handleSubmit}
        validationSchema={stepOneValidationSchema}
        enableReinitialize
      >
        {(TextInputGroupProps) => (
          <Form>
            <TextInputGroup
              name="description"
              label={t('Description')}
              as="textarea"
              placeholder={t('Report Description')}
              rows={3}
              className="mt-3"
              {...TextInputGroupProps}
            />

            <BsForm.Group className="mt-3">
              <Label popover="tags" label={t('Tags')} />
              <TagsControl name={'tags'} placeholder="Tags" />
            </BsForm.Group>

            <BsForm.Group className="mt-3">
              <Label popover="developers" label={t('Alleged developer of AI system')} />
              <TagsControl
                name="developers"
                placeholder={t('Who created or built the technology involved in the incident?')}
                {...TextInputGroupProps}
              />
            </BsForm.Group>

            <BsForm.Group className="mt-3">
              <Label popover="deployers" label={t('Alleged deployer of AI system')} />
              <TagsControl
                name="deployers"
                placeholder={t('Who employed or was responsible for the technology?')}
                {...TextInputGroupProps}
              />
            </BsForm.Group>

            <BsForm.Group className="mt-3">
              <Label
                popover="harmed_parties"
                label={t('Alleged harmed or nearly harmed parties')}
              />
              <TagsControl
                name="harmed_parties"
                placeholder={t('Who experienced negative impacts?')}
                {...TextInputGroupProps}
              />
            </BsForm.Group>

            <TextInputGroup
              name="editor_notes"
              label={t('Editor Notes')}
              type="textarea"
              placeholder={t('Optional context and notes about the incident')}
              rows={8}
              className="mt-3"
              {...TextInputGroupProps}
            />

            <div className="flex justify-between mt-4">
              <Button type="button" onClick={() => props.previous(TextInputGroupProps.values)}>
                <Trans>Previous</Trans>
              </Button>
              <Button color={'success'} type="submit">
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
