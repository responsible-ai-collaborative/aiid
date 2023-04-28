import React, { useState } from 'react';
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

export default function NewsletterSignup() {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const [emailValue, setEmailValue] = useState('');

  const SubscribeSchema = Yup.object().shape({
    emailSubscription: Yup.string().email('Invalid email').required('Required'),
  });

  const {
    //    user,
    //    loading,
    actions: { signUp },
  } = useUserContext();

  let [{ redirectTo }] = useQueryParams({
    redirectTo: StringParam,
  });

  return (
    <Card className="h-full w-full self-stretch p-6 flex justify-center">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <Trans ns="landing">Subscribe to our newsletter</Trans>
      </h5>
      <div className="h-full flex-shrink flex items-center justify-center">
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
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
            isValid,
          }) => (
            <Form onSubmit={handleSubmit}>
              <div className="mb-3" id="formBasicEmailSubscription">
                <TextInputGroup
                  type="email"
                  label={t('Email address')}
                  placeholder={t('Email')}
                  name="emailSubscription"
                  value={values.emailSubscription}
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

              <div className="flex justify-between gap-3">
                <Button
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
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </Card>
  );
}
