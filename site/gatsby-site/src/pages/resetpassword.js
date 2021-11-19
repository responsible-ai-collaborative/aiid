import React from 'react';
import Layout from '../components/Layout';
import { Form, Button } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import { StringParam, useQueryParams } from 'use-query-params';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'gatsby';

const ResetPasswordSchema = Yup.object({
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters long')
    .max(128, 'Password must be less than 128 characters long')
    .required('Password is required'),
  passwordConfirmation: Yup.string()
    .required('Password confirmation is required')
    .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const ResetPassword = (props) => {
  const {
    actions: { resetPassword },
  } = useUserContext();

  const addToast = useToastContext();

  const [{ token, tokenId }] = useQueryParams({
    token: StringParam,
    tokenId: StringParam,
  });

  return (
    <Layout {...props}>
      <Formik
        initialValues={{ password: '', passwordConfirmation: '' }}
        validationSchema={ResetPasswordSchema}
        onSubmit={async ({ password }, { setSubmitting }) => {
          try {
            await resetPassword({ password, token, tokenId });

            addToast({
              message: (
                <>
                  Succesfully updated password, click here to{' '}
                  <Link to="/login" color="#fff">
                    Log in
                  </Link>
                </>
              ),
              severity: SEVERITY.success,
            });
          } catch (e) {
            addToast({
              message: <>{e.error || 'An unknown error ocurred.'}</>,
              severity: SEVERITY.danger,
            });
          }

          setSubmitting(false);
        }}
      >
        {({ values, errors, touched, handleChange, handleSubmit, isSubmitting, isValid }) => (
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                isInvalid={errors.password && touched.password}
                type="password"
                placeholder="Enter new password"
                name="password"
                value={values.password}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.password && touched.password ? errors.password : null}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Confirm password</Form.Label>
              <Form.Control
                isInvalid={errors.passwordConfirmation && touched.passwordConfirmation}
                type="password"
                placeholder="Confirm password"
                name="passwordConfirmation"
                value={values.passwordConfirmation}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                {errors.passwordConfirmation && touched.passwordConfirmation
                  ? errors.passwordConfirmation
                  : null}
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

export default ResetPassword;
