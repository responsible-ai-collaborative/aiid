import React from 'react';
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
  className = '',
  inputClassName = '',
  ...props
}) => (
  <Form.Group className={`form-group ${className}`}>
    <Label popover={name} label={label} />
    <InputGroup className="mt-1">
      {type === 'textarea' ? (
        <TextAreaInput
          name={name}
          label={label}
          placeholder={placeholder}
          values={values}
          errors={errors}
          touched={touched}
          type={type}
          handleChange={handleChange}
          handleBlur={handleBlur}
          addOnComponent={addOnComponent}
          className={inputClassName}
          {...props}
        />
      ) : (
        <Input
          name={name}
          label={label}
          placeholder={placeholder}
          values={values}
          errors={errors}
          touched={touched}
          type={type}
          handleChange={handleChange}
          handleBlur={handleBlur}
          addOnComponent={addOnComponent}
          className={inputClassName}
          {...props}
        />
      )}
      <Form.Control.Feedback type="invalid">
        <Trans ns="validation">{errors[name] && touched[name] ? errors[name] : null}</Trans>
      </Form.Control.Feedback>
    </InputGroup>
  </Form.Group>
);

const TextAreaInput = ({
  name,
  placeholder,
  values = {},
  errors,
  touched,
  handleChange,
  handleBlur,
  className = '',
  ...props
}) => (
  <textarea
    name={name}
    className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${className} ${
      touched[name] && errors[name] ? 'has-error' : null
    } ${className}`}
    placeholder={placeholder}
    defaultValue={values[name] || ''}
    {...props}
    onChange={handleChange}
    onBlur={handleBlur}
  ></textarea>
);

const Input = ({
  name,
  placeholder,
  values = {},
  errors,
  touched,
  type = 'text',
  handleChange,
  handleBlur,
  className = '',
  ...props
}) => (
  <input
    type={type}
    name={name}
    className={`bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 ${
      touched[name] && errors[name] ? 'has-error' : null
    } ${className}`}
    placeholder={placeholder}
    defaultValue={values[name] || ''}
    {...props}
    onChange={handleChange}
    onBlur={handleBlur}
  />
);

export default TextInputGroup;
