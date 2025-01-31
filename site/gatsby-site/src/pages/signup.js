import React, { useState, useCallback } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { useUserContext } from 'contexts/UserContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Link from '../components/ui/Link';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import TextInputGroup from 'components/forms/TextInputGroup';
import NewsletterSignup from 'components/landing/NewsletterSignup';
import Card from 'elements/Card';
import HeadContent from 'components/HeadContent';
import { navigate } from 'gatsby';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const SignUp = () => {
  const {
    user,
    loading,
    actions: { signUp },
  } = useUserContext();

  const [emailValue, setEmailValue] = useState('');

  const { t } = useTranslation();

  const addToast = useToastContext();

  const [{ redirectTo }] = useQueryParams({
    redirectTo: withDefault(StringParam, '/'),
  });

  const handleSignup = useCallback(
    async ({ email }, { setSubmitting }) => {
      const result = await signUp(email, '/account/?askToCompleteProfile=1');

      if (!result.error) {
        await navigate(`/verify-request`, { state: { email, operation: 'signup' } });
      } else {
        // TODO: Add more specific error messages
        addToast({
          message: t('An unknown error has occurred'),
          severity: SEVERITY.danger,
          error: result.error,
        });
      }

      setSubmitting(false);
    },
    [signUp]
  );

  return (
    <div className="flex gap-8 flex-wrap">
      <Card className="max-w-lg w-96 p-4 shadow-md">
        <h5 className="text-2xl font-bold tracking-tight pb-2 text-gray-900 dark:text-white">
          <Trans ns="landing">Sign Up</Trans>
        </h5>
        <p>
          <Trans ns="landing">
            With an account, you can follow specific{' '}
            <LocalizedLink to="/apps/discover/?display=details&hideDuplicates=1&is_incident_report=true">
              incidents
            </LocalizedLink>{' '}
            and <LocalizedLink to="/entities">entities</LocalizedLink> of interest to you.
          </Trans>
        </p>

        {loading ? (
          <div className="flex flex-wrap gap-2">
            <Spinner />
            <Trans>Loading...</Trans>
          </div>
        ) : user ? (
          <>
            <p>
              <Trans ns="login">Logged in as </Trans>
              {user.email}
            </p>
            <Link to="/logout">
              <Trans ns="login">Log out</Trans>
            </Link>
          </>
        ) : (
          <div>
            <Formik
              initialValues={{ email: emailValue }}
              validationSchema={SignUpSchema}
              onSubmit={handleSignup}
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
                      type="email"
                      label={t('Email address')}
                      placeholder={t('Email')}
                      name="email"
                      value={values.email}
                      handleChange={(event) => {
                        setEmailValue(event.target.value);
                        handleChange(event);
                      }}
                      handleBlur={handleBlur}
                      values={values}
                      errors={errors}
                      touched={touched}
                    />
                  </div>

                  <div className="flex justify-between gap-3 w-full">
                    <Button
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      data-cy="signup-btn"
                      className="w-full"
                    >
                      <div className="flex gap-2 items-center">
                        {isSubmitting ? (
                          <div>
                            <Spinner size="sm" />
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faEnvelope} />
                        )}
                        <Trans ns="login">Sign Up</Trans>
                      </div>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            <div className="my-2 flex justify-center">
              <Trans>or</Trans>
            </div>

            <div className="mt-4">
              <Trans ns="login">Already have an account?</Trans>{' '}
              <Link to={`/login?redirectTo=${redirectTo}`}>
                <Trans ns="login">Login</Trans>
              </Link>
            </div>
          </div>
        )}
      </Card>
      <div className="w-[32rem]">
        <NewsletterSignup />
      </div>
    </div>
  );
};

export const Head = (props) => {
  const { t } = useTranslation();

  return (
    <HeadContent
      metaTitle={t('AIID - Sign Up')}
      path={props.location.pathname}
      metaDescription={t('Sign up for an account')}
    />
  );
};

export default SignUp;
