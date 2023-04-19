import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Loader = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <div className="z-2 absolute top-0 right-0 bottom-0 left-0 flex justify-center bg-white opacity-60">
      <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
    </div>
  );
};

export default Loader;
