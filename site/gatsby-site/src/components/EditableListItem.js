import { faPen } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState, useRef } from 'react';
import { Col, Row } from 'react-bootstrap';
import styled from 'styled-components';

const Key = styled.span`
  color: rgb(28, 211, 198);
`;

const EditButton = styled.button`
  border: none;
  background: none;
  color: inherit;
  line-height: 1.8rem;
  text-align: left;
  word-break: break-word;

  svg {
    display: none;
    margin-left: 1rem;
  }

  &:hover,
  &:focus {
    outline: none;
    svg {
      display: inline;
      color: rgb(28, 211, 198);
    }
  }
`;

const Input = styled.input`
  flex: 1;
  height: 1.8rem;
  border: none;
  border-bottom: 1px solid rgb(28, 211, 198);
  background: none;
  color: inherit;
  box-sizing: border-box;

  &:hover,
  &:focus {
    outline: none;
  }
`;

const SaveButton = styled.button`
  margin: 0 1rem;
  border: none;
  background: none;
  color: rgb(28, 211, 198);

  &:hover,
  &:focus {
    outline: none;
  }
`;

const EditableListItem = ({ editable, onUpdate, name, value }) => {
  const inputRef = useRef();

  const [editing, setEditing] = useState(false);

  const toggleEditing = () => setEditing(!editing);

  const isLink = name === 'image_url' || name === 'url';

  const handleSave = () => {
    onUpdate(inputRef.current.value);
    toggleEditing();
  };

  return (
    <Row className="g-0">
      <Col xs={12} lg={3} className="text-lg-right pr-2">
        <Key>{name}</Key> :
      </Col>
      <Col xs={12} lg={9} className="d-flex align-items-center">
        {!editing && (
          <EditButton onClick={toggleEditing} disabled={!editable}>
            {isLink ? (
              <a href={value} target="_blank" rel="noreferrer">
                {value}
              </a>
            ) : (
              value
            )}
            {editable && <FontAwesomeIcon icon={faPen} size="xs" />}
          </EditButton>
        )}
        {editing && (
          <>
            <Input ref={inputRef} defaultValue={value} />
            <SaveButton onClick={handleSave}>save</SaveButton>
          </>
        )}
      </Col>
    </Row>
  );
};

export default EditableListItem;
