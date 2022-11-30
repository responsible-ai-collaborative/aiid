import React from 'react';
import Layout from 'components/Layout';
import SubmitForm from 'components/forms/SubmitForm';

const SubmitPage = (props) => {
  return (
    <Layout {...props} className="md:max-w-5xl">
      <SubmitForm />
    </Layout>
  );
};

export default SubmitPage;
