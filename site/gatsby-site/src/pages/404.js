import AiidHead from 'components/AiidHead';
import React from 'react';

const Default404 = () => {
  return (
    <div className={'w-full'}>
      <div className="flex flex-col content-center items-center w-full">
        <h4>Unknown page.</h4>
        <h5>Please use the menus to navigate to an existing page.</h5>
      </div>
    </div>
  );
};

export const Head = (props) => (
  <AiidHead path={props.location.pathname} metaTitle={'Page not found'} />
);

export default Default404;
