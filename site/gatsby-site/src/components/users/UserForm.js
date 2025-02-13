import React from 'react';
import { Field, useFormikContext } from 'formik';
import * as yup from 'yup';
import TagsControl from 'components/forms/TagsControl';
import { Label, TextInput } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'contexts/UserContext';

// Schema for yup
export const schema = yup.object().shape({
  roles: yup.array().of(yup.string()),
});

const UserForm = () => {
  const { isRole } = useUserContext();

  const { isSubmitting } = useFormikContext();

  const { t } = useTranslation(['account']);

  return (
    <div>
      <div className="mb-2 block">
        <Label htmlFor="email" value={t('Email')} />
        <Field name="adminData.email" as={TextInput} placeholder={t('Email')} disabled={true} />
      </div>
      <div className="mb-2 block">
        <Label htmlFor="first_name" value={t('First Name')} />
        <Field id="first_name" name="first_name" as={TextInput} placeholder={t('First Name')} />
      </div>
      <div className="mb-2 block">
        <Label htmlFor="last_name" value={t('Last Name')} />
        <Field id="last_name" name="last_name" as={TextInput} placeholder={t('Last Name')} />
      </div>
      <div className="mb-2 block">
        <Label htmlFor="roles" value={t('Roles')} />
        <TagsControl name="roles" disabled={isSubmitting || !isRole('admin')} />
      </div>
    </div>
  );
};

export default UserForm;
