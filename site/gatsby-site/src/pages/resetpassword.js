import React from 'react';
import { useUserContext } from 'contexts/userContext';
import { StringParam, useQueryParams } from 'use-query-params';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import TextInputGroup from 'components/forms/TextInputGroup';
import { Button, Spinner } from 'flowbite-react';

const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must be less than 128 characters long')
    .required('Required'),
  passwordConfirm: Yup.string()
    .required('Required')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value;
    }),
});

const ResetPassword = () => {
  const {
    actions: { resetPassword },
    loading,
  } = useUserContext();

  const { t } = useTranslation();

  const addToast = useToastContext();

  const [{ token, tokenId }] = useQueryParams({
    token: StringParam,
    tokenId: StringParam,
  });

  return (
    <>
      {loading ? (
        <div className="flex flex-wrap gap-2">
          <Spinner />
          <Trans>Loading...</Trans>
        </div>
      ) : (
        <Formik
          initialValues={{ password: '', passwordConfirm: '' }}
          validationSchema={ResetPasswordSchema}
          onSubmit={async ({ password }, { setSubmitting }) => {
            try {
              await resetPassword({ password, token, tokenId });

              addToast({
                message: (
                  <>
                    {t('Succesfully updated password, click here to ', { ns: 'login' })}
                    <Link to="/login" className="sape">
                      {t('Login', { ns: 'login' })}
                    </Link>
                  </>
                ),
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
            <Form onSubmit={handleSubmit} className={'w-64'}>
              <div className="mb-3">
                <TextInputGroup
                  type="password"
                  label={t('Password', { ns: 'login' })}
                  placeholder={t('Enter new password', { ns: 'login' })}
                  name="password"
                  value={values.password}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <div className="mb-3">
                <TextInputGroup
                  type="password"
                  label={t('Confirm new password', { ns: 'login' })}
                  placeholder={t('Confirm password', { ns: 'login' })}
                  name="passwordConfirm"
                  value={values.passwordConfirm}
                  handleChange={handleChange}
                  handleBlur={handleBlur}
                  values={values}
                  errors={errors}
                  touched={touched}
                />
              </div>

              <Button type="submit" disabled={isSubmitting || !isValid}>
                <Trans>Submit</Trans>
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </>
  );
};

export default ResetPassword;
