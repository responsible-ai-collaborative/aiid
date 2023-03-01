import React from 'react';
import Layout from '../components/Layout';
import { Form } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import Button from '../elements/Button';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPassword = (props) => {
  const {
    actions: { sendResetPasswordEmail },
  } = useUserContext();

  const { t } = useTranslation();

  const addToast = useToastContext();

  return (
    <Layout {...props}>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={async ({ email }, { setSubmitting }) => {
          try {
            await sendResetPasswordEmail({ email });

            addToast({
              message: <>{t('Succesfully sent password reset email', { ns: 'login' })}</>,
              severity: SEVERITY.success,
            });
          } catch (e) {
            addToast({
              message: (
                <label className="capitalize">{t(e.error || 'An unknown error has ocurred')}</label>
              ),
              severity: SEVERITY.danger,
              error: e,
            });
          }

          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid }) => (
          <div className="bootstrap">
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>
                  <Trans>Email address</Trans>
                </Form.Label>
                <Form.Control
                  isInvalid={errors.email && touched.email}
                  type="email"
                  placeholder={t('Email')}
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  <Trans>{errors.email && touched.email ? errors.email : null}</Trans>
                </Form.Control.Feedback>
              </Form.Group>
              <Button variant="primary" type="submit" disabled={isSubmitting || !isValid}>
                <Trans>Submit</Trans>
              </Button>
            </Form>
          </div>
        )}
      </Formik>
    </Layout>
  );
};

export default ForgotPassword;
