import React from 'react';
import { Field, useFormikContext } from 'formik';
import * as yup from 'yup';
import TagsControl from 'components/forms/TagsControl';
import { Label, TextInput } from 'flowbite-react';

// Schema for yup
export const schema = yup.object().shape({
  roles: yup.array().of(yup.string()),
});

const UserForm = () => {
  const { isSubmitting } = useFormikContext();

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="email" value="Email" />
        <Field name="adminData.email" as={TextInput} placeholder="Email" disabled={true} />
      </div>
      <div className="mb-2 block">
        <Label htmlFor="roles" value="Roles" />
        <TagsControl name="roles" disabled={isSubmitting} />
      </div>
    </div>
  );
};

export default UserForm;
