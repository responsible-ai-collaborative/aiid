import React from 'react';

const ApiSpec = () => {
  return (
    <>
      <div id="swagger-ui" />
      <script
        src="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui-bundle.js"
        crossOrigin
      ></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
        window.onload = () => {
          window.ui = SwaggerUIBundle({
            url: '/spec.json',
            dom_id: '#swagger-ui',
          });
        };
    `,
        }}
      ></script>
    </>
  );
};

export const Head = () => {
  return <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@4.5.0/swagger-ui.css" />;
};

export default ApiSpec;
