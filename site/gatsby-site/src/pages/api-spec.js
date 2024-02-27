import React, { useEffect } from 'react';
import 'swagger-ui-react/swagger-ui.css';
import spec from '../api/spec.json';
import SwaggerUI from 'swagger-ui';

const ApiSpec = () => {
  useEffect(() => {
    SwaggerUI({
      dom_id: '#swagger-ui',
      spec,
    });
  }, []);

  return <div id="swagger-ui" />;
};

export default ApiSpec;
