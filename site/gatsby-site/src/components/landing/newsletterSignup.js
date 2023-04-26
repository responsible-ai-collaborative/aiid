import React, { useState } from 'react';
import { Button, Spinner } from 'flowbite-react';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import TextInputGroup from 'components/forms/TextInputGroup';

export default function NewsLetterSignup() {

  const SubscribeSchema = Yup.object().shape({
    emailSubscription: Yup.string().email('Invalid email').required('Required'),
  });

  return (
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

            <Button
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
  );
}
