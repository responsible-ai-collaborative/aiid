import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Label from './Label';
import TagsControl from './TagsControl';
import { Trans } from 'react-i18next';

const TagsInputGroup = ({ name, label, placeholder, errors, touched, schema, className = '' }) => {
  const [optional, setOptional] = useState(true);

  useEffect(async () => {
    if (schema?.fields[name]) {
      setOptional(await schema.fields[name].isValid(undefined));
    }
  }, []);

  return (
    <div className="bootstrap">
      <Form.Group className={`form-group ${className}`}>
        <Label popover={name} label={(optional ? '' : '*') + label} />
        <TagsControl name={name} placeholder={placeholder} />
        <InputGroup>
          <Form.Control.Feedback type="invalid">
            <Trans ns="validation">{errors[name] && touched[name] ? errors[name] : null}</Trans>
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default TagsInputGroup;
