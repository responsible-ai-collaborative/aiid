import React from 'react';
import AiidHelmet from 'components/AiidHelmet';

const Default404 = () => {
  return (
    <div className={'w-full'}>
      <AiidHelmet>
        <title>Page not found</title>
      </AiidHelmet>
      <div className="flex flex-col content-center items-center w-full">
        <h4>Unknown page.</h4>
        <h5>Please use the menus to navigate to an existing page.</h5>
      </div>
    </div>
  );
};

export default Default404;
