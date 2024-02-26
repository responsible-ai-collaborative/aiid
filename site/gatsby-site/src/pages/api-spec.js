import React from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import spec from '../api/spec.json';

const ApiSpec = () => {
  return <SwaggerUI spec={spec} />;
};

export default ApiSpec;
