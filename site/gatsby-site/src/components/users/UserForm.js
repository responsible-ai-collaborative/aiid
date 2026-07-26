import React from 'react';
import { Field, useFormikContext } from 'formik';
import * as yup from 'yup';
import TagsControl from 'components/forms/TagsControl';
import { Checkbox, Label, TextInput } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { useUserContext } from 'contexts/UserContext';

// Schema for yup
export const schema = yup.object().shape({
  roles: yup.array().of(yup.string()),
  api_access_blocked_reason: yup.string().nullable(),
});

const UserForm = () => {
  const { isRole } = useUserContext();

  const { isSubmitting, values } = useFormikContext();

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

      {/*
        Admin-only, matching the server rule that only an admin may write these
        fields (SEE: server/rules.ts `canEditApiAccess`). Rendering it for
        non-admins would offer a control whose submission would be rejected.
      */}
      {isRole('admin') && (
        <fieldset className="mt-4 border-t pt-3">
          <legend className="text-sm font-semibold">{t('API access')}</legend>
          <div className="flex items-center gap-2 mb-2">
            <Field
              id="api_access_blocked"
              name="api_access_blocked"
              type="checkbox"
              as={Checkbox}
              disabled={isSubmitting}
              data-cy="api-access-blocked"
            />
            <Label htmlFor="api_access_blocked" value={t('Block this account from the API')} />
          </div>
          <div className="mb-2 block">
            <Label htmlFor="api_access_blocked_reason" value={t('Reason')} />
            <Field
              id="api_access_blocked_reason"
              name="api_access_blocked_reason"
              as={TextInput}
              placeholder={t('e.g. automated scraping at 400 req/min')}
              // The reason is shown to the blocked account, so it is only editable
              // when a block is actually being applied.
              disabled={isSubmitting || !values.api_access_blocked}
              data-cy="api-access-blocked-reason"
            />
          </div>
        </fieldset>
      )}
    </div>
  );
};

export default UserForm;
