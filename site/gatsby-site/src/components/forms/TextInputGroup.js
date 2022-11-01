import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Label from './Label';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const TextInputGroup = ({
  name,
  label,
  placeholder,
  values = {},
  errors,
  touched,
  type = 'text',
  handleChange,
  handleBlur,
  addOnComponent = null,
  schema,
  className = '',
  icon,
  ...props
}) => {
  const [optional, setOptional] = useState(true);

  // this causes an unncessary re-render
  useEffect(() => {
    schema.fields[name].isValid(undefined).then((result) => setOptional(result));
  }, []);

  return (
    <div className="bootstrap">
      <Form.Group className={`form-group ${className}`}>
        <div className="flex items-center">
          {icon && <FontAwesomeIcon fixedWidth icon={icon} title={label} className="mb-2 mr-1" />}
          <Label popover={name} label={(optional ? '' : '*') + label} />
        </div>
        <InputGroup>
          <Form.Control
            type={type}
            name={name}
            placeholder={placeholder}
            onChange={handleChange}
            onBlur={handleBlur}
            value={values[name] || ''}
            isInvalid={errors[name] && touched[name]}
            className={addOnComponent ? 'rounded-r-none' : 'rounded-md'}
            {...props}
          />
          {addOnComponent}
          <Form.Control.Feedback type="invalid">
            <Trans ns="validation">{errors[name] && touched[name] ? errors[name] : null}</Trans>
          </Form.Control.Feedback>
        </InputGroup>
      </Form.Group>
    </div>
  );
};

export default TextInputGroup;
