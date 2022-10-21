import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Label from './Label';
import TagsControl from './TagsControl';
import { Trans } from 'react-i18next';

const TagsInputGroup = ({ name, label, placeholder, errors, touched, schema, className = '' }) => {
  const [optional, setOptional] = useState(true);

  // this causes an unnecessary re render, I'm hotfixing to get it working with react 18
  useEffect(() => {
    schema?.fields[name]?.isValid(undefined).then((result) => setOptional(result));
  }, []);

  const isInvalid = errors[name] && touched[name];

  return (
    <div className="bootstrap">
      <Form.Group className={`form-group ${className}`}>
        <Label popover={name} label={(optional ? '' : '*') + label} />
        <InputGroup>
          <div
            className={
              'tags-control-wrapper rounded-md form-control' + (isInvalid ? ' is-invalid' : '')
            }
          >
            <TagsControl name={name} placeholder={placeholder} />
          </div>
          <Form.Control.Feedback type="invalid">
            <Trans ns="validation">{isInvalid ? errors[name] : null}</Trans>
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default TagsInputGroup;
