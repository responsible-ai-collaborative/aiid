import React, { useState, useEffect } from 'react';
import { Form, InputGroup } from 'react-bootstrap';
import Label from './Label';
import { Trans } from 'react-i18next';

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
        <Label popover={name} label={(optional ? '' : '*') + label} />
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
