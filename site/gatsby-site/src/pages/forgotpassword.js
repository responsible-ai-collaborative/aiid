import React from 'react';
import Layout from '../components/Layout';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import TextInputGroup from 'components/forms/TextInputGroup';
import { Button, Spinner } from 'flowbite-react';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPassword = (props) => {
  const {
    actions: { sendResetPasswordEmail },
    loading,
  } = useUserContext();

  const { t } = useTranslation();

  const addToast = useToastContext();

  return (
    <Layout {...props}>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <Spinner />
          <Trans>Loading...</Trans>
        </div>
      ) : (
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
                  <label className="capitalize">
                    {t(e.error || 'An unknown error has ocurred')}
                  </label>
                ),
                severity: SEVERITY.danger,
                error: e,
              });
            }

            setSubmitting(false);
          }}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="mb-3" id="formBasicEmail">
                <TextInputGroup
                  label={t('Email address')}
                  type="email"
                  placeholder={t('Email')}
                  name="email"
                  value={values.email}
                  handleChange={handleChange}
                  values={values}
                  errors={errors}
                  touched={touched}
                  handleBlur={handleBlur}
                />
              </div>
              <Button type="submit" disabled={isSubmitting || !isValid}>
                <Trans>Submit</Trans>
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default ForgotPassword;
