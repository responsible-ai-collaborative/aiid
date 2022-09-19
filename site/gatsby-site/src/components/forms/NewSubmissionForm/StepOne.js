import { Button, Spinner } from 'flowbite-react';
import { Formik, Form } from 'formik';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from '../TextInputGroup';
import * as yup from 'yup';
import Label from '../Label';
import FlowbiteSearchInput from '../FlowbiteSearchInput';
import RelatedIncidents from 'components/RelatedIncidents';
// import { PreviewImageInputGroup } from 'utils/cloudinary';

const StepOne = (props) => {
  const { t } = useTranslation(['submit']);

  const stepOneValidationSchema = yup.object().shape({
    title: yup.string().required(t('Title is required')),
  });

  const handleSubmit = (values) => {
    props.next(values);
  };

  // console.log(props.data)

  return (
    <div className={`p-6 border rounded-lg mt-6 relative `}>
      <div className="absolute -top-5 bg-white px-4 text-primary-blue text-xl">{props.name}</div>
      <Formik
        initialValues={props.data}
        onSubmit={handleSubmit}
        validationSchema={stepOneValidationSchema}
      >
        {(TextInputGroupProps) => (
          <Form>
            <Label label={t('Report Address')} popover="url"></Label>
            <FlowbiteSearchInput
              name="url"
              label={t('Report Address')}
              placeholder={t('Report URL')}
              addOnComponent={
                <Button
                  // className="outline-secondary"
                  disabled={
                    !!TextInputGroupProps.errors.url ||
                    !TextInputGroupProps.touched.url ||
                    props.parsingNews
                  }
                  onClick={() => props.parseNewsUrl(TextInputGroupProps.values.url)}
                  data-cy="fetch-info"
                >
                  {!props.parsingNews ? (
                    <Trans ns="submit">Fetch info</Trans>
                  ) : (
                    <div className="flex gap-2">
                      <Spinner size="sm" />
                      <Trans ns="submit">Fetching...</Trans>
                    </div>
                  )}
                </Button>
              }
              {...TextInputGroupProps}
              handleChange={(e) => {
                TextInputGroupProps.setFieldTouched('url', true);
                TextInputGroupProps.handleChange(e);
              }}
              btnClick={() => props.parseNewsUrl(TextInputGroupProps.values.url)}
              loading={props.parsingNews}
              btnDisabled={
                !!TextInputGroupProps.errors.url ||
                !TextInputGroupProps.touched.url ||
                props.parsingNews
              }
              btnText={t('Fetch info')}
            />
            <RelatedIncidents
              incident={TextInputGroupProps.values}
              setFieldValue={TextInputGroupProps.setFieldValue}
              columns={['byURL']}
            />

            <TextInputGroup
              name="title"
              label={t('Title')}
              placeholder={t('Report title')}
              className="mt-3"
              {...TextInputGroupProps}
            />

            <TextInputGroup
              name="authors"
              label={t('Author CSV')}
              placeholder={t('Author CSV')}
              className="mt-3"
              {...TextInputGroupProps}
            />

            <RelatedIncidents
              incident={TextInputGroupProps.values}
              setFieldValue={TextInputGroupProps.setFieldValue}
              columns={['byAuthors']}
            />

            <TextInputGroup
              name="submitters"
              label={t('Submitter CSV')}
              placeholder={t('Submitter CSV')}
              className="mt-3"
              {...TextInputGroupProps}
            />

            <TextInputGroup
              name="date_published"
              label={t('Date Published')}
              type="date"
              placeholder={t('YYYY-MM-DD')}
              className="mt-3"
              {...TextInputGroupProps}
            />
            <RelatedIncidents
              incident={TextInputGroupProps.values}
              setFieldValue={TextInputGroupProps.setFieldValue}
              columns={['byDatePublished']}
            />

            <TextInputGroup
              name="date_downloaded"
              label={t('Date Downloaded')}
              type="date"
              placeholder={t('YYYY-MM-DD')}
              className="mt-3"
              {...TextInputGroupProps}
            />
            {/* <PreviewImageInputGroup
                            publicID={TextInputGroupProps.values.cloudinary_id}
                            name="image_url"
                            label={t('Image Address')}
                            placeholder={t('Image URL')}
                            className="mt-3"
                            {...TextInputGroupProps}
                        /> */}
            <TextInputGroup
              name="title"
              label={t('Title')}
              placeholder={t('Report title')}
              className="mt-3"
              {...TextInputGroupProps}
            />
            {/* <ErrorMessage name="title" /> */}
            <Button type="submit">Next</Button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default StepOne;
