import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputGroup from 'components/forms/TextInputGroup';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { useUserContext } from 'contexts/userContext';
import { StringParam, useQueryParams } from 'use-query-params';
import Card from 'elements/Card';
import Envelope from '../../images/neural-net-envelope.png';

export default function NewsletterSignup() {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const {
    user,
    actions: { signUp },
    loading,
  } = useUserContext();

  const [emailValue, setEmailValue] = useState('');

  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  const SubscribeSchema = Yup.object().shape({
    emailSubscription: Yup.string().email('Invalid email').required('Required'),
  });

  let [{ redirectTo }] = useQueryParams({
    redirectTo: StringParam,
  });

  if (loading) return <></>;

  return (
    <Card className="h-full w-full self-stretch flex justify-center shadow-md">
      <h5 className="text-2xl font-bold tracking-tight p-4 pb-2 text-gray-900 dark:text-white">
        <Trans ns="landing">The AI Incident Briefing</Trans>
      </h5>
      <div className="h-full flex-shrink flex flex-col items-center justify-center p-8 bg-[#e1effe]">
        <img
          src={Envelope}
          alt={t('An envelope with a neural net diagram on its left')}
          className="w-2/5 mx-auto drop-shadow-xl mb-6"
        />
        {hydrated && user && user.providerType != 'anon-user' ? (
          <p>
            <Trans>
              Check your inbox for the AI Incident Briefing, which includes incident round-ups along
              with occasional major database updates. You can manage your subscription status from
              the links in the email footer.
            </Trans>
          </p>
        ) : (
          <>
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
                  console.error(e);
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
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
              }) => (
                <Form
                  onSubmit={handleSubmit}
                  className="w-full flex flex-wrap md:flex-nowrap gap-3 items-end"
                >
                  <div id="formBasicEmailSubscription" className="w-full shrink-1">
                    <TextInputGroup
                      type="email"
                      placeholder={t('Email address')}
                      name="emailSubscription"
                      value={values.emailSubscription}
                      handleChange={(event) => {
                        setEmailValue(event.target.value);
                        handleChange(event);
                      }}
                      handleBlur={handleBlur}
                      values={values}
                      touched={touched}
                    />
                  </div>

                  <div className="flex justify-between gap-3 w-full md:w-min">
                    <Button
                      type="submit"
                      className="w-full md:w-min"
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
                        <Trans ns="login">Subscribe</Trans>
                      </div>
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
            <p>
              <Trans>
                Subscribe to the AI Incident Briefing and get monthly incident round-ups along with
                occasional major database updates.
              </Trans>
            </p>
          </>
        )}
      </div>
    </Card>
  );
}
