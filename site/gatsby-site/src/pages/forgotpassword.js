import React from 'react';
import Layout from '../components/Layout';
import { Form, Button } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
});

const ForgotPassword = (props) => {
  const {
    actions: { sendResetPasswordEmail },
  } = useUserContext();

  const addToast = useToastContext();

  return (
    <Layout {...props}>
      <Formik
        initialValues={{ email: '' }}
        validationSchema={ForgotPasswordSchema}
        onSubmit={async ({ email }, { setSubmitting }) => {
          try {
            await sendResetPasswordEmail({ email });

            addToast({
              message: <>Succesfully sent password reset email.</>,
              severity: SEVERITY.success,
            });
          } catch (e) {
            addToast({
              message: <>{e.error || 'An unknown error has ocurred'}</>,
              severity: SEVERITY.danger,
            });
          }

          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                isInvalid={errors.email && touched.email}
                type="email"
                placeholder="Enter email"
                name="email"
                value={values.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email && touched.email ? errors.email : null}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting || !isValid}>
              Submit
            </Button>
          </Form>
        )}
      </Formik>
    </Layout>
  );
};

export default ForgotPassword;
