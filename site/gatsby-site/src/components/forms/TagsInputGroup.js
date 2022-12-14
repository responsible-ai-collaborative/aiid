import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Label from './Label';
import TagsControl from './TagsControl';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TagsInputGroup = ({
  name,
  label,
  placeholder,
  errors,
  touched,
  schema,
  className = '',
  icon,
  disabled = false,
}) => {
  const [optional, setOptional] = useState(true);

  // this causes an unnecessary re render, I'm hotfixing to get it working with react 18
  useEffect(() => {
    schema?.fields[name]?.isValid(undefined).then((result) => setOptional(result));
  }, []);

  const isInvalid = errors[name] && touched[name];

  return (
    <div className="bootstrap">
      <Form.Group className={`form-group ${className}`}>
        <div className="flex items-center">
          {icon && <FontAwesomeIcon fixedWidth icon={icon} title={label} className="mb-2 mr-1" />}
          <Label popover={name} label={(optional ? '' : '*') + label} />
        </div>
        <InputGroup style={{ marginTop: '0.25rem' }}>
          <div
            className={
              'tags-control-wrapper rounded-md form-control' + (isInvalid ? ' is-invalid' : '')
            }
          >
            <TagsControl name={name} placeholder={placeholder} disabled={disabled} />
          </div>
          <Form.Control.Feedback type="invalid" className="text-sm">
            <Trans ns="validation">{isInvalid ? errors[name] : null}</Trans>
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default TagsInputGroup;
