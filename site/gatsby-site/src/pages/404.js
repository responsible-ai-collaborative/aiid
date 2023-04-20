import React from 'react';
import Layout from 'components/Layout';
import AiidHelmet from 'components/AiidHelmet';

const Default404 = (props) => {
  return (
    <Layout {...props} className={'fullWidth'}>
      <AiidHelmet>
        <title>Page not found</title>
      </AiidHelmet>
      <div className="flex flex-col content-center items-center w-full">
        <h4>Unknown page.</h4>
        <h5>Please use the menus to navigate to an existing page.</h5>
      </div>
    </Layout>
  );
};

export default Default404;
