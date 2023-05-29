import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Button, Spinner } from 'flowbite-react';
import { useUserContext } from '../contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import Link from '../components/ui/Link';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { StringParam, useQueryParams } from 'use-query-params';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import TextInputGroup from 'components/forms/TextInputGroup';
import NewsletterSignup from 'components/landing/NewsletterSignup';
import Card from 'elements/Card';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  passwordConfirm: Yup.string().test('passwords-match', 'Passwords must match', function (value) {
    return this.parent.password === value;
  }),
});

const SignUp = (props) => {
  const {
    user,
    loading,
    actions: { signUp, loginWithFacebook },
  } = useUserContext();

  const [displayFacebookSpinner, setDisplayFacebookSpinner] = useState(false);

  const [emailValue, setEmailValue] = useState('');

  const { t } = useTranslation();

  const addToast = useToastContext();

  const loginRedirectUri = `${props.location.origin}/logincallback`;

  let [{ redirectTo }] = useQueryParams({
    redirectTo: StringParam,
  });

  redirectTo = redirectTo ?? '/';

  const clickLoginWithFacebook = async () => {
    setDisplayFacebookSpinner(true);

    localStorage.setItem('signup', '1');

    await loginWithFacebook({ loginRedirectUri, redirectTo });

    setDisplayFacebookSpinner(false);
  };

  return (
    <Layout {...props}>
      <div className="flex gap-8 flex-wrap">
        <Card className="max-w-lg w-96 p-4 shadow-md">
          <h5 className="text-2xl font-bold tracking-tight pb-2 text-gray-900 dark:text-white">
            <Trans ns="landing">Sign Up</Trans>
          </h5>
          <p>
            <Trans>
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
          ) : user && user.isLoggedIn && user.profile.email ? (
            <>
              <p>
                <Trans ns="login">Logged in as </Trans>
                {user.profile.email}
              </p>
              <Link to="/logout">
                <Trans ns="login">Log out</Trans>
              </Link>
            </>
          ) : (
            <div>
              <Formik
                initialValues={{ email: emailValue, password: '', passwordConfirm: '' }}
                validationSchema={SignUpSchema}
                onSubmit={async ({ email, password }, { setSubmitting }) => {
                  try {
                    await signUp({ email, password, redirectTo });

                    localStorage.setItem('signup', '1');

                    addToast({
                      message: t('Verification email sent to {{email}}', { email, ns: 'login' }),
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

                    <div className="mb-3" id="formBasicPassword">
                      <TextInputGroup
                        type="password"
                        label={t('Password', { ns: 'login' })}
                        placeholder={t('Password', { ns: 'login' })}
                        name="password"
                        value={values.password}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        values={values}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="mb-3" id="formBasicPasswordConfirm">
                      <TextInputGroup
                        type="password"
                        label={t('Confirm password', { ns: 'login' })}
                        placeholder={t('Password', { ns: 'login' })}
                        name="passwordConfirm"
                        value={values.passwordConfirm}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        values={values}
                        errors={errors}
                        touched={touched}
                      />
                    </div>

                    <div className="flex justify-between gap-3 w-full">
                      <Button
                        type="submit"
                        disabled={isSubmitting || !isValid || displayFacebookSpinner}
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

              <Button
                onClick={clickLoginWithFacebook}
                className={'w-full'}
                disabled={displayFacebookSpinner}
              >
                <div className={'flex justify-center items-center gap-2'}>
                  {displayFacebookSpinner ? (
                    <Spinner />
                  ) : (
                    <FontAwesomeIcon
                      icon={faFacebook}
                      color={'#ffffff'}
                      className={'pointer fa fa-lg'}
                      title="Sign up with Facebook"
                    />
                  )}
                  <Trans ns="login">Sign up with Facebook</Trans>
                </div>
              </Button>

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
    </Layout>
  );
};

export default SignUp;
