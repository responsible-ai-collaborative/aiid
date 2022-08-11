import React from 'react';
import Layout from '../components/Layout';
import { Form, Button } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import Link from 'components/ui/Link';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';

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
    actions: { signUp },
  } = useUserContext();

  const { t } = useTranslation();

  const addToast = useToastContext();

  const loginWithFacebook = async () => {
    try {
      await signUp({ provider: 'facebook', redirectUri: `${props.location.origin}/logincallback` });
    } catch (e) {
      console.error(e);
      addToast({
        message: <>{t(e.error || 'An unknown error has ocurred')}</>,
        severity: SEVERITY.danger,
      });
    }
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
                  message: <>{t(e.error || 'An unknown error has ocurred')}</>,
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
                  disabled={isSubmitting || !isValid}
                  className="w-100"
                >
                  <Trans ns="login">Sign up</Trans>
                </Button>
              </Form>
            )}
          </Formik>

          <div className="my-2 d-flex justify-content-center">
            <Trans>or</Trans>
          </div>

          <Button variant="primary" onClick={loginWithFacebook} className={'btn-login-fb w-100'}>
            <div className={'d-flex justify-content-center'}>
              <FontAwesomeIcon
                icon={faFacebook}
                color={'#ffffff'}
                className={'pointer fa fa-lg'}
                title="Share to Facebook"
              />
              <div className={'btn-text'}>
                <Trans ns="login">Sign up with Facebook</Trans>
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
