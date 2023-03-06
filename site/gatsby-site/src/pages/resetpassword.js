import React from 'react';
import Layout from '../components/Layout';
import { Form } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import { StringParam, useQueryParams } from 'use-query-params';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import Button from '../elements/Button';

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

const ResetPassword = (props) => {
  const {
    actions: { resetPassword },
  } = useUserContext();

  const { t } = useTranslation();

  const addToast = useToastContext();

  const [{ token, tokenId }] = useQueryParams({
    token: StringParam,
    tokenId: StringParam,
  });

  return (
    <Layout {...props} className="bootstrap">
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
          <Form onSubmit={handleSubmit} className={'w-64'}>
            <Form.Group className="mb-3">
              <Form.Label>
                <Trans ns="login">Password</Trans>
              </Form.Label>
              <Form.Control
                isInvalid={errors.password && touched.password}
                type="password"
                placeholder={t('Enter new password', { ns: 'login' })}
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                <Trans>{errors.password && touched.password ? errors.password : null}</Trans>
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                <Trans ns="login">Confirm new password</Trans>
              </Form.Label>
              <Form.Control
                isInvalid={errors.passwordConfirm && touched.passwordConfirm}
                type="password"
                placeholder={t('Confirm password', { ns: 'login' })}
                name="passwordConfirm"
                value={values.passwordConfirm}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                <Trans>
                  {errors.passwordConfirm && touched.passwordConfirm
                    ? errors.passwordConfirm
                    : null}
                </Trans>
              </Form.Control.Feedback>
            </Form.Group>

            <Button variant="primary" type="submit" disabled={isSubmitting || !isValid}>
              <Trans>Submit</Trans>
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default ResetPassword;
