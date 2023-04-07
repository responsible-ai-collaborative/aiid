import React, { useEffect, useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { useUserContext } from '../contexts/userContext';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFacebook } from '@fortawesome/free-brands-svg-icons';
import { Trans, useTranslation } from 'react-i18next';
import Link from '../components/ui/Link';
import { StringParam, useQueryParams } from 'use-query-params';
import TextInputGroup from 'components/forms/TextInputGroup';
import { useMenuContext } from 'contexts/MenuContext';

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

  const { isCollapsed, collapseMenu } = useMenuContext();

  useEffect(() => {
    if (isCollapsed) {
      collapseMenu(false);
    }
  }, []);

  return (
    <>
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

                <div className="mb-4" id="formBasicPassword">
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
                  <Link to="/forgotpassword" className="text-sm">
                    <Trans ns="login">Forgot password?</Trans>
                  </Link>
                </div>

                <Button
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
            <Link to="/signup/">
              <Trans ns="login">Sign up</Trans>
            </Link>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
