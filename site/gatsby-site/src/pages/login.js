import React, { useState } from 'react';
import Layout from '../components/Layout';
import { Form } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import { useUserContext } from '../contexts/userContext';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import Link from '../components/ui/Link';
import Button from '../elements/Button';
import { StringParam, useQueryParams } from 'use-query-params';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('required'),
});

const Login = (props) => {
  const {
    user,
    loading,
    actions: { loginWithEmail, loginWithFacebook },
  } = useUserContext();

  const [displayFacebookSpinner, setDisplayFacebookSpinner] = useState(false);

  const { t } = useTranslation();

  const loginRedirectUri = `${props.location.origin}/logincallback`;

  let [{ redirectTo }] = useQueryParams({
    redirectTo: StringParam,
  });

  redirectTo = redirectTo ?? '/';

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
        <>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async ({ email, password }, { setSubmitting }) => {
              await loginWithEmail({ email, password, redirectTo });

              setSubmitting(false);
            }}
          >
            {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid }) => (
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4 w-full" controlId="formBasicEmail">
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

                <Form.Group className="mb-4" controlId="formBasicPassword">
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
                  disabled={isSubmitting || !isValid || displayFacebookSpinner}
                  className="w-full"
                  data-cy="login-btn"
                >
                  {isSubmitting && <Spinner />}
                  <span className="pl-3">
                    <Trans ns="login">Login</Trans>
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
                  title="Login with Facebook"
                />
              )}
              <Trans ns="login">Login with Facebook</Trans>
            </div>
          </Button>

          <div className="mt-3">
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
