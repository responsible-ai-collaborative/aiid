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
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';

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

const FORMS = {
  SubscribeToIncidents: 'SubscribeToIncidents',
  SubscribeToMajorUpdates: 'SubscribeToMajorUpdates',
};

const SignUp = (props) => {
  const {
    user,
    loading,
    actions: { signUp, loginWithFacebook },
  } = useUserContext();

  const [displayFacebookSpinner, setDisplayFacebookSpinner] = useState(false);

  const [emailValue, setEmailValue] = useState('');

  const [currentForm, setCurrentForm] = useState(FORMS.SubscribeToMajorUpdates);

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

  const toogleForm = (formName) => {
    setCurrentForm(FORMS[formName]);
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
          {currentForm == FORMS.SubscribeToMajorUpdates && (
            <Formik
              initialValues={{ emailSubscription: emailValue }}
              validationSchema={SubscribeSchema}
              onSubmit={async ({ emailSubscription }, { setSubmitting, resetForm }) => {
                try {
                  await signUp({ email: emailSubscription, password: '123456', redirectTo });
                  addToast({
                    message: t('Thanks for subscribing to our Newsletter!', {
                      email: emailSubscription,
                      ns: 'login',
                    }),
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
                    error: e,
                  });
                }

                setSubmitting(false);
              }}
            >
              {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid }) => (
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3" controlId="formBasicEmailSubscription">
                    <Form.Label>
                      <Trans>Email address</Trans>
                    </Form.Label>
                    <Form.Control
                      isInvalid={errors.emailSubscription && touched.emailSubscription}
                      type="email"
                      placeholder={t('Email')}
                      name="emailSubscription"
                      value={values.emailSubscription}
                      onChange={(event) => {
                        setEmailValue(event.target.value);
                        handleChange(event);
                      }}
                    />
                    <Form.Control.Feedback type="invalid">
                      <Trans>
                        {errors.emailSubscription && touched.emailSubscription
                          ? errors.emailSubscription
                          : null}
                      </Trans>
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="flex justify-between gap-3">
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting || !isValid}
                      data-cy="subscribe-to-updates-btn"
                    >
                      <div className="flex gap-2 items-center">
                        {isSubmitting ? (
                          <div>
                            <Spinner size="sm" />
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faEnvelope} />
                        )}
                        <Trans ns="login">Subscribe to Major Updates</Trans>
                      </div>
                    </Button>

                    <Button
                      variant="primary"
                      type="button"
                      disabled={isSubmitting}
                      data-cy="signup-btn"
                      onClick={() => toogleForm(FORMS.SubscribeToIncidents)}
                    >
                      <div className="flex gap-2 items-center">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <Trans ns="login">Subscribe to New Incidents</Trans>
                      </div>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}

          {currentForm == FORMS.SubscribeToIncidents && (
            <Formik
              initialValues={{ email: emailValue, password: '', passwordConfirm: '' }}
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
                    error: e,
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
                      onChange={(event) => {
                        setEmailValue(event.target.value);
                        handleChange(event);
                      }}
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

                  <div className="flex justify-between gap-3">
                    <Button
                      variant="primary"
                      type="button"
                      disabled={isSubmitting}
                      data-cy="subscribe-to-updates-btn"
                      onClick={() => toogleForm(FORMS.SubscribeToMajorUpdates)}
                    >
                      <div className="flex gap-2 items-center">
                        <FontAwesomeIcon icon={faEnvelope} />
                        <Trans ns="login">Subscribe to Major Updates</Trans>
                      </div>
                    </Button>

                    <Button
                      variant="primary"
                      type="submit"
                      disabled={isSubmitting || !isValid || displayFacebookSpinner}
                      data-cy="signup-btn"
                    >
                      <div className="flex gap-2 items-center">
                        {isSubmitting ? (
                          <div>
                            <Spinner size="sm" />
                          </div>
                        ) : (
                          <FontAwesomeIcon icon={faEnvelope} />
                        )}
                        <Trans ns="login">Subscribe to New Incidents</Trans>
                      </div>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          )}
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
