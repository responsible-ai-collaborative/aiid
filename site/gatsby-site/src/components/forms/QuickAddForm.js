import React from 'react';
import { Form } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { format } from 'date-fns';
import { INSERT_QUICKADD } from '../../graphql/quickadd';
import { useMutation } from '@apollo/client';
import getSourceDomain from '../../utils/getSourceDomain';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Row from 'elements/Row';
import Col from 'elements/Col';
import { Spinner } from 'flowbite-react';

// set in form //
// * url: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.

// set in DB function //
// * source_domain: "blogs.wsj.com" # (string) The domain name hosting the report.
// * date_submitted:`2019-07-25` # (Date) Date the report was submitted to the AIID. This determines citation order.
// * report_number: 2379 # (int) the incrementing primary key for the report. This is a global resource identifier.
// * date_modified: `2019-07-25` # (Date or null) Date the report was edited.
// * language: "en" # (string) The language identifier of the report.

// Schema for yup
const validationSchema = Yup.object().shape({
  url: Yup.string()
    .url('*Must enter URL in http://www.example.com format')
    .required('*URL required'),
});

const QuickAddForm = ({ className = '' }) => {
  const { t } = useTranslation(['translation', 'landing']);

  const addToast = useToastContext();

  const [insertQuickAdd] = useMutation(INSERT_QUICKADD);

  const { values, errors, isSubmitting, handleChange, handleBlur, handleSubmit } = useFormik({
    initialValues: { url: '' },
    validationSchema,
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      setSubmitting(true);

      try {
        const url = new URL(values.url);

        const quickAdd = {
          incident_id: '0',
          date_submitted: format(new Date(), 'yyyy-MM-dd'),
          source_domain: getSourceDomain(url),
          url: url.href,
        };

        await insertQuickAdd({ variables: { quickAdd } });

        addToast({
          message: (
            <>
              {'Report successfully added to review queue. You can see your submission  '}
              <LocalizedLink to="/apps/submitted">here</LocalizedLink>.
            </>
          ),
          severity: SEVERITY.success,
        });
      } catch (e) {
        addToast({
          message: 'Was not able to create the report, please review the form and try again.',
          severity: SEVERITY.warning,
        });
      }

      resetForm();
      setSubmitting(false);
    },
  });

  return (
    <div className="w-full">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Trans ns="landing">Quick Add New Report URL</Trans>
      </h5>
      <form onSubmit={handleSubmit} className={className} data-cy="quick-add">
        <div className="relative">
          <div className="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              className="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              ></path>
            </svg>
          </div>
          <input
            type="text"
            name="url"
            placeholder={t('Report URL')}
            onChange={handleChange}
            onBlur={handleBlur}
            defaultValue={values.url}
            // isInvalid={!!errors.url}
            className={`block p-4 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
              errors.url ? 'is-invalid' : ''
            }`}
          />

          <button
            type="submit"
            className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 flex disabled:opacity-50"
            disabled={isSubmitting || !!errors.url}
          >
            {isSubmitting ? (
              <>
                <Spinner size="sm" />
                <div className="ml-2">
                  <Trans>Submitting...</Trans>
                </div>
              </>
            ) : (
              <Trans>Submit</Trans>
            )}
          </button>
        </div>
        <p className="mt-2 text-sm text-red-600 dark:text-red-500">{errors.url}</p>
        <Row className="mt-2">
          <Col>
            <Form.Text className="text-muted-gray">
              <Trans i18nKey="quickaddDescription" ns="landing">
                Submitted links are added to a{' '}
                <LocalizedLink to="/apps/submitted">review queue </LocalizedLink>
                to be resolved to a new or existing incident record. Incidents submitted with
                <LocalizedLink to="/apps/submit"> full details </LocalizedLink> are processed before
                URLs not possessing the full details.
              </Trans>
            </Form.Text>
          </Col>
        </Row>
      </form>
    </div>
  );
};

export default QuickAddForm;
