import React from 'react';
import Layout from '../components/Layout';
import { Form, Button } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { navigate } from 'gatsby';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import useLocalizePath from 'components/i18n/useLocalizePath';
import Link from 'components/ui/Link';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('required'),
});

const Login = (props) => {
  const {
    user,
    actions: { login },
  } = useUserContext();

  const { t } = useTranslation();

  const localizePath = useLocalizePath();

  const addToast = useToastContext();

  const loginWithFacebook = async () => {
    try {
      await login({ provider: 'facebook', redirectUri: `${props.location.origin}/logincallback` });
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
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async ({ email, password }, { setSubmitting }) => {
              try {
                await login({ email, password });
                navigate(localizePath({ path: `/` }));
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
                <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
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
                  <Form.Text>
                    <Link to="/forgotpassword">
                      <Trans ns="login">Forgot password?</Trans>
                    </Link>
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    <Trans>{errors.password && touched.password ? errors.password : null}</Trans>
                  </Form.Control.Feedback>
                </Form.Group>

                <Button
                  variant="primary"
                  type="submit"
                  disabled={isSubmitting || !isValid}
                  className="w-100"
                >
                  <Trans ns="login">Login</Trans>
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
                <Trans ns="login">Login with Facebook</Trans>
              </div>
            </div>
          </Button>
        </>
      )}
    </Layout>
  );
};

export default Login;
