import React from 'react';
import Layout from '../components/Layout';
import { Form, Button } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link } from 'gatsby';

const SignUpSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('required'),
  passwordConfirm: Yup.string().test('passwords-match', 'Passwords must match', function (value) {
    return this.parent.password === value;
  }),
});

const SignUp = (props) => {
  const {
    user,
    actions: { signUp },
  } = useUserContext();

  const addToast = useToastContext();

  return (
    <Layout {...props}>
      {user && user.isLoggedIn && user.profile.email ? (
        <div>
          Logged in as {user.profile.email}, <Link to="/logout">Log out</Link>
        </div>
      ) : (
        <Formik
          initialValues={{ email: '', password: '', passwordConfirm: '' }}
          validationSchema={SignUpSchema}
          onSubmit={async ({ email, password }, { setSubmitting, resetForm }) => {
            try {
              await signUp({ email, password });
              addToast({
                message: <>Account created</>,
                severity: SEVERITY.success,
              });
              resetForm();
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
                  placeholder="Email"
                  name="email"
                  value={values.email}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.email && touched.email ? errors.email : null}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control
                  isInvalid={errors.password && touched.password}
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={values.password}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password && touched.password ? errors.password : null}
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPasswordConfirm">
                <Form.Label>Confirm password</Form.Label>
                <Form.Control
                  isInvalid={
                    errors.passwordConfirm &&
                    touched.passwordConfirm &&
                    values.password !== values.passwordConfirm
                  }
                  type="password"
                  placeholder="Confirm password"
                  name="passwordConfirm"
                  value={values.passwordConfirm}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.passwordConfirm && touched.passwordConfirm
                    ? errors.passwordConfirm
                    : null}
                </Form.Control.Feedback>
              </Form.Group>

              <Button variant="primary" type="submit" disabled={isSubmitting || !isValid}>
                Sign up
              </Button>
            </Form>
          )}
        </Formik>
      )}
    </Layout>
  );
};

export default SignUp;
