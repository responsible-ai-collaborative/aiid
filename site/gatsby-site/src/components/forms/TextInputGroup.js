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
  inputClassName = '',
  ...props
}) => {
  const [optional, setOptional] = useState(true);

  // this causes an unncessary re-render
  useEffect(() => {
    schema.fields[name].isValid(undefined).then((result) => setOptional(result));
  }, []);

  return (
    <Form.Group className={`form-group ${className}`}>
      <div className="flex items-center">
        {icon && <FontAwesomeIcon fixedWidth icon={icon} title={label} className="mb-2 mr-1" />}
        <Label popover={name} label={(optional ? '' : '*') + label} />
      </div>
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
          <span className="text-red-700 text-sm">
            <Trans ns="validation">{errors[name] && touched[name] ? errors[name] : null}</Trans>
          </span>
        </Form.Control.Feedback>
      </InputGroup>
    </Form.Group>
  );
};

const TextAreaInput = ({
  name,
  placeholder,
  values = {},
  errors,
  touched,
  handleChange,
  handleBlur,
  className = '',
  addOnComponent,
  ...props
}) => (
  <>
    <textarea
      name={name}
      className={`block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${className} ${
        touched[name] && errors[name]
          ? 'border-red-600 focus:ring-red-500'
          : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
      } ${className}`}
      placeholder={placeholder}
      value={values[name] || props.defaultValue || ''}
      {...props}
      onChange={handleChange}
      onBlur={handleBlur}
    ></textarea>
    {addOnComponent}
  </>
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
  addOnComponent,
  ...props
}) => (
  <div className="w-full flex">
    <input
      type={type}
      name={name}
      className={`bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
        touched[name] && errors[name]
          ? 'border-red-600 focus:ring-red-500'
          : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
      } ${className}`}
      placeholder={placeholder}
      value={values[name] || props.defaultValue || ''}
      {...props}
      onChange={handleChange}
      onBlur={handleBlur}
    />
    {addOnComponent}
  </div>
);

export default TextInputGroup;
