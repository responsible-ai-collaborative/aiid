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
import Button from 'elements/Button';

// set in form //
// * url: "https://blogs.wsj.com/digits/2015/05/19/googles-youtube-kids-app-criti" # The fully qualified URL to the report as hosted on the web.

// set in DB function //
// * source_domain: "blogs.wsj.com" # (string) The domain name hosting the report.
// * date_submitted:`2019-07-25` # (Date) Date the report was submitted to the AIID. This determines citation order.
// * ref_number: 25 # (int) The reference number scoped to the incident ID.
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
              {'Report successfully added to review queue. It will appear on the  '}
              <LocalizedLink to="/apps/submitted">review queue page</LocalizedLink> within an hour.
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
    <>
      <Form onSubmit={handleSubmit} className={className} data-cy="quick-add">
        <Row className="w-full">
          <Form.Group as={Col} controlId="formUrl">
            <Form.Control
              type="text"
              name="url"
              placeholder={t('Report URL')}
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.url}
              isInvalid={!!errors.url}
            />
            <Form.Control.Feedback type="invalid">{errors.url}</Form.Control.Feedback>
          </Form.Group>

          <Col xs="auto" className="flex-0-0-auto w-auto">
            <Button variant="primary" type="submit" disabled={isSubmitting || !!errors.url}>
              <Trans>Submit</Trans>
            </Button>
          </Col>
        </Row>
        <Row className="mt-2">
          <Col>
            <Form.Text className="text-muted">
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
      </Form>
    </>
  );
};

export default QuickAddForm;
