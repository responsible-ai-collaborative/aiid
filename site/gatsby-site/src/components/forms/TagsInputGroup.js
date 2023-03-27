import React, { useState, useEffect } from 'react';
import Label from './Label';
import TagsControl from './TagsControl';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import FieldContainer from './SubmissionWizard/FieldContainer';

const TagsInputGroup = ({
  name,
  label,
  placeholder,
  errors,
  touched,
  schema,
  icon = null,
  disabled = false,
  ...props
}) => {
  const [optional, setOptional] = useState(true);

  // this causes an unnecessary re render, I'm hotfixing to get it working with react 18
  useEffect(() => {
    schema?.fields[name]?.isValid(undefined).then((result) => setOptional(result));
  }, []);

  const isInvalid = errors[name] && touched[name];

  return (
    <FieldContainer>
      <div className="flex items-center">
        {icon && <FontAwesomeIcon fixedWidth icon={icon} title={label} className="mb-2 mr-1" />}
        <Label popover={name} label={(optional ? '' : '*') + label} />
      </div>
      <div style={{ marginTop: '0.25rem' }}>
        <div
          className={
            'tags-control-wrapper rounded-md form-control' +
            (isInvalid ? ' is-invalid border-red-700' : '')
          }
          data-cy={props['data-cy']}
        >
          <TagsControl name={name} placeholder={placeholder} disabled={disabled} />
        </div>
        <div className="text-sm text-red-700">
          <Trans ns="validation">{isInvalid ? errors[name] : null}</Trans>
        </div>
      </div>
    </FieldContainer>
  );
};

export default TagsInputGroup;
