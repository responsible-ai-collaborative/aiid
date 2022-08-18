import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Form, Spinner } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook, faGoogle } from '@fortawesome/free-brands-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import Button from '../elements/Button';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('required'),
});

const Login = (props) => {
  const {
    user,
    actions: { loginWithEmail, loginWithFacebook, loginWithGoogle },
  } = useUserContext();

  const [displaySpinner, setDisplaySpinner] = useState(false);

  const { t } = useTranslation();

  const loginRedirectUri = `${props.location.origin}/logincallback`;

  return (
    <Layout {...props}>
      {displaySpinner && <Spinner animation="border" size="sm" role="status" aria-hidden="true" />}
      {!displaySpinner && user && user.isLoggedIn && user.profile.email ? (
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
              setDisplaySpinner(true);

              await loginWithEmail({ email, password });

              setDisplaySpinner(false);
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
                  className="tw-w-full"
                >
                  {isSubmitting ? (
                    <Spinner animation="border" size="sm" role="status" aria-hidden="true" />
                  ) : (
                    <Trans ns="login">Login</Trans>
                  )}
                </Button>
              </Form>
            )}
          </Formik>

          <div className="my-2 d-flex justify-content-center">
            <Trans>or</Trans>
          </div>

          <Button
            variant="primary"
            onClick={() => {
              loginWithFacebook({ loginRedirectUri });
            }}
            className={'tw-w-full'}
          >
            <div className={'d-flex justify-content-center'}>
              <FontAwesomeIcon
                icon={faFacebook}
                color={'#ffffff'}
                className={'pointer fa fa-lg'}
                title="Login with Facebook"
              />
              <div className={'tw-ml-2'}>
                <Trans ns="login">Login with Facebook</Trans>
              </div>
            </div>
          </Button>

          <Button
            variant="primary"
            onClick={() => {
              loginWithGoogle({ loginRedirectUri });
            }}
            className={'tw-w-full tw-mt-5'}
          >
            <div className={'d-flex justify-content-center'}>
              <FontAwesomeIcon
                icon={faGoogle}
                color={'#ffffff'}
                className={'pointer fa fa-lg'}
                title="Login with Google"
              />
              <div className={'tw-ml-2'}>
                <Trans ns="login">Login with Google</Trans>
              </div>
            </div>
          </Button>

          <div className="mt-4">
            <Trans ns="login">Don&apos;t have an account?</Trans>{' '}
            <Link to="/signup">
              <Trans ns="login">Sign up</Trans>
            </Link>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Login;
