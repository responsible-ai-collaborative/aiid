import React from 'react';
import Layout from 'components/Layout';
import AiidHelmet from 'components/AiidHelmet';
import styled from 'styled-components';

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const Default404 = (props) => {
  return (
    <Layout {...props} className={'fullWidth'}>
      <AiidHelmet>
        <title>Page not found</title>
      </AiidHelmet>
      <Centered>
        <h4>Unknown page.</h4>
        <h5>Please use the menus to navigate to an existing page.</h5>
      </Centered>
    </Layout>
  );
};

export default Default404;
