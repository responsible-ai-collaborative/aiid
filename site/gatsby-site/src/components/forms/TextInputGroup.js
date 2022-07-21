import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

import Label from './Label';
import * as POP_OVERS from '../ui/PopOvers';
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
  className = '',
  ...props
}) => (
  <Form.Group className={`form-group ${className}`}>
    <Label popover={POP_OVERS[name]} label={label} />
    <InputGroup>
      <Form.Control
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name] || ''}
        className={touched[name] && errors[name] ? 'has-error' : null}
        isInvalid={errors[name] && touched[name]}
        {...props}
      />
      {addOnComponent}
      <Form.Control.Feedback type="invalid">
        <Trans ns="validation">{errors[name] && touched[name] ? errors[name] : null}</Trans>
      </Form.Control.Feedback>
    </InputGroup>
  </Form.Group>
);

export default TextInputGroup;
