import React from 'react';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';

const Wrapper = styled.div`
  z-index: 1;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
`;

const Loader = ({ loading }) => {
  if (!loading) {
    return null;
  }

  return (
    <Wrapper>
      <FontAwesomeIcon className="fa-spin" icon={faSpinner} />
    </Wrapper>
  );
};

export default Loader;
