import React, { useCallback } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { useUserContext } from 'contexts/UserContext';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Trans, useTranslation } from 'react-i18next';
import Link from '../ui/Link';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';
import TextInputGroup from 'components/forms/TextInputGroup';
import { navigate } from 'gatsby';
import useToastContext, { SEVERITY } from 'hooks/useToast';

const AuthSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const LoginSignupForm = () => {
  const {
    user,
    loading,
    actions: { sendMagicLink },
  } = useUserContext();

  const addToast = useToastContext();

  const { t } = useTranslation();

  const [{ redirectTo }] = useQueryParams({
    redirectTo: withDefault(StringParam, '/account/?askToCompleteProfile=1'),
  });

  const handleSubmit = useCallback(
    async ({ email }, { setSubmitting }) => {
      try {
        const result = await sendMagicLink(email, redirectTo);

        if (!result.error) {
          navigate(`/verify-request`, { state: { email } });
        } else {
          throw result?.error;
        }
      } catch (e) {
        addToast({
          message: t('An unknown error has occurred'),
          severity: SEVERITY.danger,
          error: e,
        });
      }

      setSubmitting(false);
    },
    [redirectTo, sendMagicLink]
  );

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        <Spinner />
        <Trans>Loading...</Trans>
      </div>
    );
  }

  if (user) {
    return (
      <>
        <p>
          <Trans ns="login">Logged in as </Trans>
          {user.email}
        </p>
        <Link to="/logout">
          <Trans ns="login">Log out</Trans>
        </Link>
      </>
    );
  }

  return (
    <>
      <p className="mb-4">
        <Trans ns="login">
          Enter your email to sign in. We&apos;ll create an account for you if you don&apos;t have
          one yet.
        </Trans>
      </p>
      <Formik
        isInitialValid={false}
        initialValues={{ email: '' }}
        validationSchema={AuthSchema}
        onSubmit={handleSubmit}
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
            <div className="mb-4 w-full" id="formBasicEmail">
              <TextInputGroup
                type="email"
                label={t('Email address')}
                placeholder={t('Email')}
                name="email"
                value={values.email}
                handleChange={handleChange}
                handleBlur={handleBlur}
                values={values}
                errors={errors}
                touched={touched}
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting || !isValid}
              className="w-full"
              data-cy="login-btn"
            >
              {isSubmitting && <Spinner />}
              <span className="pl-3">
                <Trans ns="login">Continue with email</Trans>
              </span>
            </Button>
          </Form>
        )}
      </Formik>
    </>
  );
};

export default LoginSignupForm;
