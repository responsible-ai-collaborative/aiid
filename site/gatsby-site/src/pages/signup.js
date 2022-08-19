import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Form, Spinner } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Link from 'components/ui/Link';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import Button from '../elements/Button';

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
    actions: { signUp, loginWithFacebook, loginWithGoogle },
  } = useUserContext();

  const [displayFacebookSpinner, setDisplayFacebookSpinner] = useState(false);

  const [displayGoogleSpinner, setDisplayGoogleSpinner] = useState(false);

  const { t } = useTranslation();

  const addToast = useToastContext();

  const loginRedirectUri = `${props.location.origin}/logincallback`;

  const clickLoginWithFacebook = async () => {
    setDisplayFacebookSpinner(true);

    await loginWithFacebook({ loginRedirectUri });

    setDisplayFacebookSpinner(false);
  };

  const clickLoginWithGoogle = async () => {
    setDisplayGoogleSpinner(true);

    await loginWithGoogle({ loginRedirectUri });

    setDisplayGoogleSpinner(false);
  };

  return (
    <Layout {...props}>
      {user && user.isLoggedIn && user.profile.email ? (
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
        <>
          <Formik
            initialValues={{ email: '', password: '', passwordConfirm: '' }}
            validationSchema={SignUpSchema}
            onSubmit={async ({ email, password }, { setSubmitting, resetForm }) => {
              try {
                await signUp({ email, password });
                addToast({
                  message: t('Account created', { ns: 'login' }),
                  severity: SEVERITY.success,
                });
                resetForm();
              } catch (e) {
                addToast({
                  message: (
                    <label className="tw-capitalize">
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
                  disabled={
                    isSubmitting || !isValid || displayFacebookSpinner || displayGoogleSpinner
                  }
                  className="tw-w-full"
                >
                  {isSubmitting && (
                    <Spinner animation="border" size="sm" role="status" className="tw-mr-2" />
                  )}
                  <Trans ns="login">Sign up</Trans>
                </Button>
              </Form>
            )}
          </Formik>

          <div className="my-2 d-flex justify-content-center">
            <Trans>or</Trans>
          </div>

          <Button
            variant="primary"
            onClick={clickLoginWithFacebook}
            className={'tw-w-full'}
            disabled={displayFacebookSpinner || displayGoogleSpinner}
          >
            <div className={'d-flex justify-content-center align-items-center'}>
              {displayFacebookSpinner ? (
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <FontAwesomeIcon
                  icon={faFacebook}
                  color={'#ffffff'}
                  className={'pointer fa fa-lg'}
                  title="Sign up with Facebook"
                />
              )}
              <div className={'tw-ml-2'}>
                <Trans ns="login">Sign up with Facebook</Trans>
              </div>
            </div>
          </Button>

          <Button
            variant="primary"
            onClick={clickLoginWithGoogle}
            className={'tw-w-full tw-mt-5'}
            disabled={displayFacebookSpinner || displayGoogleSpinner}
          >
            <div className={'d-flex justify-content-center align-items-center'}>
              {displayGoogleSpinner ? (
                <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
              ) : (
                <FontAwesomeIcon
                  icon={faGoogle}
                  color={'#ffffff'}
                  className={'pointer fa fa-lg'}
                  title="Sign up with Google"
                />
              )}
              <div className={'tw-ml-2'}>
                <Trans ns="login">Sign up with Google</Trans>
              </div>
            </div>
          </Button>

          <div className="mt-4">
            <Trans ns="login">Already have an account?</Trans>{' '}
            <Link to="/login">
              <Trans ns="login">Login</Trans>
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
};

export default SignUp;
