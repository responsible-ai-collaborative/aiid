import React from 'react';
import { useQueryParam } from 'use-query-params';
import { DisplayModeEnumParam } from './queryParams';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTh, faThList, faInfo } from '@fortawesome/free-solid-svg-icons';
import { Button } from 'react-bootstrap';
import styled from 'styled-components';

const Buttons = styled.div`
  display: flex;
  gap: 4px;
`;

const StyledButton = styled(Button)`
  width: 32px;
`;

function ModeButton({ icon, ...rest }) {
  return (
    <StyledButton {...rest} size="sm">
      <FontAwesomeIcon icon={icon} />
    </StyledButton>
  );
}

const modes = {
  details: {
    icon: faInfo,
  },
  compact: {
    icon: faTh,
  },
  list: {
    icon: faThList,
  },
};

export default function DisplayModeSwitch() {
  const [display, setDisplay] = useQueryParam('display', DisplayModeEnumParam);

  const onChange = (key) => {
    setDisplay(key);
  };

  return (
    <div className="bootstrap">
      <Buttons>
        {Object.keys(modes).map((key) => (
          <ModeButton
            variant="secondary"
            active={key == display}
            key={key}
            icon={modes[key].icon}
            onClick={() => onChange(key)}
          />
        ))}
      </Buttons>
    </div>
  );
}
