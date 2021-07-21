import React from 'react';
import { Form, InputGroup } from 'react-bootstrap';

import Label from './Label';
import * as POP_OVERS from './PopOvers';

const TextInputGroup = ({
  name,
  label,
  placeholder,
  values = {},
  errors,
  touched,
  type,
  handleChange,
  handleBlur,
  addOnComponent = null,
  ...props
}) => (
  <Form.Group>
    <Label popover={POP_OVERS[name]} label={label} />
    <InputGroup>
      <Form.Control
        type={type || 'text'}
        name={name}
        placeholder={placeholder}
        onChange={handleChange}
        onBlur={handleBlur}
        value={values[name] || ''}
        className={touched[name] && errors[name] ? 'has-error' : null}
        {...props}
      />
      {addOnComponent}
    </InputGroup>
    {touched[name] && errors[name] ? <div className="error-message">{errors[name]}</div> : null}
  </Form.Group>
);

export default TextInputGroup;
