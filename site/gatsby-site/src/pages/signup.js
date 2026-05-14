import React from 'react';
import { useTranslation } from 'react-i18next';
import HeadContent from 'components/HeadContent';
import LoginSignupForm from 'components/loginSignup/LoginSignupForm';

const SignUp = () => <LoginSignupForm />;

export const Head = (props) => {
  const { t } = useTranslation();

  return (
    <HeadContent
      metaTitle={t('AIID - Sign in or sign up')}
      path={props.location.pathname}
      metaDescription={t('Sign in to your AIID account or create a new one')}
    />
  );
};

export default SignUp;
