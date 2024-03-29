import React, { useEffect } from 'react';

const ApiSpec = () => {
  useEffect(() => {
    window.SwaggerUIBundle({
      url: '/spec.json',
      dom_id: '#swagger-ui',
    });
  }, []);

  return (
    <div>
      <div id="swagger-ui" />
    </div>
  );
};

export const Head = () => {
  return (
    <>
      <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />;
      <script
        src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"
        crossOrigin="anonymous"
      />
    </>
  );
};

export default ApiSpec;
