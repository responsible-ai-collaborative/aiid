import React from 'react';
import Layout from '../components/Layout';
import { Form, Button } from 'react-bootstrap';
import { useUserContext } from 'contexts/userContext';
import useToastContext, { SEVERITY } from '../hooks/useToast';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Link, navigate } from 'gatsby';

const LoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('required'),
});

const Login = (props) => {
  const {
    user,
    actions: { login },
  } = useUserContext();

  const addToast = useToastContext();

  const loginWithFacebook = async () => {
    try {
      await login({ provider: 'facebook' });
    } catch (e) {
      console.error(e);
      addToast({
        message: <>{e.error || 'An unknown error has ocurred'}</>,
        severity: SEVERITY.danger,
      });
    }
  };

  return (
    <Layout {...props}>
      {user && user.isLoggedIn && user.profile.email ? (
        <div>
          Logged in as {user.profile.email}, <Link to="/logout">Log out</Link>
        </div>
      ) : (
        <>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={LoginSchema}
            onSubmit={async ({ email, password }, { setSubmitting }) => {
              try {
                await login({ email, password });
                navigate('/');
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
                <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
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
                  <Form.Text>
                    <a href="/forgotpassword">Forgot password?</a>
                  </Form.Text>
                  <Form.Control.Feedback type="invalid">
                    {errors.password && touched.password ? errors.password : null}
                  </Form.Control.Feedback>
                </Form.Group>

                <Button variant="primary" type="submit" disabled={isSubmitting || !isValid}>
                  Login
                </Button>
              </Form>
            )}
          </Formik>
          <div className="my-2">or</div>
          <div>
            <Button variant="primary" onClick={loginWithFacebook}>
              Login with Facebook
            </Button>
          </div>
        </>
      )}
    </Layout>
  );
};

export default Login;
