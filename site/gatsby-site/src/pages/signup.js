import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Form } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import { useUserContext } from '../contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Link from '../components/ui/Link';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import Button from '../elements/Button';
import { StringParam, useQueryParams } from 'use-query-params';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
  passwordConfirm: Yup.string().test('passwords-match', 'Passwords must match', function (value) {
    return this.parent.password === value;
  }),
});

const SubscribeSchema = Yup.object().shape({
  emailSubscription: Yup.string().email('Invalid email').required('Required'),
});

const SignUp = (props) => {
  const {
    user,
    loading,
    actions: { signUp, loginWithFacebook },
  } = useUserContext();

  const [displayFacebookSpinner, setDisplayFacebookSpinner] = useState(false);

  const { t } = useTranslation();

  const addToast = useToastContext();

  const loginRedirectUri = `${props.location.origin}/logincallback`;

  let [{ redirectTo }] = useQueryParams({
    redirectTo: StringParam,
  });

  const clickLoginWithFacebook = async () => {
    setDisplayFacebookSpinner(true);

    await loginWithFacebook({ loginRedirectUri, redirectTo });

    setDisplayFacebookSpinner(false);
  };

  return (
    <Layout {...props} className="bootstrap">
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
        <div className="max-w-lg">
          <Formik
            initialValues={{ emailSubscription: '' }}
            validationSchema={SubscribeSchema}
            onSubmit={async ({ emailSubscription }, { setSubmitting, resetForm }) => {
              try {
                await signUp({ email: emailSubscription, password: '123456', redirectTo });
                addToast({
                  message: t('Thanks for subscribing to our Newsletter!', { email: emailSubscription, ns: 'login' }),
                  severity: SEVERITY.success,
                });
                resetForm();
              } catch (e) {
                addToast({
                  message: (
                    <label className="capitalize">
                      {t(e.error || 'An unknown error has ocurred')}
                    </label>
                  ),
                  severity: SEVERITY.danger,
                });
              }

              setSubmitting(false);
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmailSubscription">
                  <Form.Label>
                    <Trans>Subscribe to our Newsletter ONLY</Trans>
                  </Form.Label>
                  <Form.Control
                    isInvalid={errors.emailSubscription && touched.emailSubscription}
                    type="email"
                    placeholder={t('Email')}
                    name="emailSubscription"
                    value={values.emailSubscription}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    <Trans>{errors.emailSubscription && touched.emailSubscription ? errors.emailSubscription : null}</Trans>
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-full"
                  data-cy="signup-btn"
                >
                  {isSubmitting && <Spinner />}
                  <span className="pl-3">
                    <Trans ns="login">Subscribe to our Newsletter</Trans>
                  </span>
                </Button>
              </Form>
            )}
          </Formik>

          <div className="my-2 flex justify-center">
            <Trans>or</Trans>
          </div>

          <div className="my-2 flex justify-center">
            <Trans>Create a user account to follow individual incidents and/or receive a notification about all new incidents (you will also be subscribed to our Newsletter)</Trans>
          </div>

          <Formik
            initialValues={{ email: '', password: '', passwordConfirm: '' }}
            validationSchema={SignUpSchema}
            onSubmit={async ({ email, password }, { setSubmitting, resetForm }) => {
              try {
                await signUp({ email, password, redirectTo });
                addToast({
                  message: t('Verification email sent to {{email}}', { email, ns: 'login' }),
                  severity: SEVERITY.success,
                });
                resetForm();
              } catch (e) {
                addToast({
                  message: (
                    <label className="capitalize">
                      {t(e.error || 'An unknown error has ocurred')}
                    </label>
                  ),
                  severity: SEVERITY.danger,
                });
              }

              setSubmitting(false);
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid }) => (
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

                <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>
                    <Trans ns="login">Password</Trans>
                  </Form.Label>
                  <Form.Control
                    isInvalid={errors.password && touched.password}
                    type="password"
                    placeholder={t('Password', { ns: 'login' })}
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                  />
                  <Form.Control.Feedback type="invalid">
                    <Trans>{errors.password && touched.password ? errors.password : null}</Trans>
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                  <Form.Label>
                    <Trans ns="login">Confirm password</Trans>
                  </Form.Label>
                  <Form.Control
                    isInvalid={
                      errors.passwordConfirm &&
                      touched.passwordConfirm &&
                      values.password !== values.passwordConfirm
                    }
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

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !isValid || displayFacebookSpinner}
                  className="w-full"
                  data-cy="signup-btn"
                >
                  {isSubmitting && <Spinner />}
                  <span className="pl-3">
                    <Trans ns="login">Sign up</Trans>
                  </span>
                </Button>
              </Form>
            )}
          </Formik>

          <div className="my-2 flex justify-center">
            <Trans>or</Trans>
          </div>

          <Button
            variant="primary"
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
            <Link to="/login">
              <Trans ns="login">Login</Trans>
            </Link>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default SignUp;
