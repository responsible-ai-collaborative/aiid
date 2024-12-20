import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Alert, Modal } from 'flowbite-react';
import { Formik } from 'formik';
import { Trans } from 'react-i18next';
import UserForm, { schema } from './UserForm';
import { FIND_USER, UPDATE_USER_PROFILE, UPDATE_USER_ROLES } from '../../graphql/users';
import DefaultSkeleton from 'elements/Skeletons/Default';
import SubmitButton from 'components/ui/SubmitButton';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import lodash from 'lodash';
import { useUserContext } from 'contexts/UserContext';

const supportedRoles = [
  { name: 'admin', description: 'All permissions' },
  {
    name: 'subscriber',
    description:
      'Can subscribe to incidents, entities, reports, and anything else that is subscribeable',
  },
  { name: 'submitter', description: 'Permitted to submit incidents under their user account' },
  { name: 'incident_editor', description: 'Can edit incidents' },
  { name: 'taxonomy_editor', description: 'Can edit all taxonomies' },
  { name: 'taxonomy_editor_{name}', description: 'Can edit the taxonomy with the specified name' },
];

const RolesTable = ({ roles }) => (
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-4 py-3">
          Role
        </th>
        <th scope="col" className="px-4 py-3">
          Description
        </th>
      </tr>
    </thead>
    <tbody>
      {roles.map((role) => (
        <tr key={role.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {role.name}
          </td>
          <td className="px-4 py-2">{role.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export default function UserEditModal({ onClose, userId, alertTitle = '', alertText = '' }) {
  const { data: userData, loading } = useQuery(FIND_USER, {
    variables: { filter: { userId: { EQ: userId } } },
  });

  const { isRole } = useUserContext();

  const [updateUserRoles] = useMutation(UPDATE_USER_ROLES);

  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);

  const addToast = useToastContext();

  const handleSubmit = async (values) => {
    try {
      if (!lodash.isEqual(values.roles, userData.user.roles)) {
        await updateUserRoles({ variables: { roles: values.roles, userId } });
      }

      await updateUserProfile({
        variables: {
          userId,
          first_name: values.first_name,
          last_name: values.last_name,
        },
      });

      addToast({
        message: <>User updated.</>,
        severity: SEVERITY.success,
      });

      onClose();
    } catch (e) {
      addToast({
        message: <>Error updating user.</>,
        severity: SEVERITY.danger,
        error: e,
      });
    }
  };

  return (
    <Modal show={true} onClose={onClose} data-testid="edit-user-modal" size="lg">
      <Modal.Header>
        <Trans>Edit</Trans>
      </Modal.Header>

      {loading && (
        <Modal.Body>
          <DefaultSkeleton />
        </Modal.Body>
      )}

      {userData?.user && (
        <Formik
          initialValues={{ ...userData.user }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, submitForm }) => (
            <>
              <Modal.Body>
                {(alertTitle || alertText) && (
                  <Alert color="info" className="mb-4">
                    <h5>{alertTitle}</h5>
                    <span>{alertText}</span>
                  </Alert>
                )}
                <UserForm />
                {isRole('admin') && (
                  <details>
                    <summary className="cursor-pointer text-sm">Supported Roles</summary>
                    <div className="mt-2">
                      <RolesTable roles={supportedRoles} />
                    </div>
                  </details>
                )}
              </Modal.Body>
              <Modal.Footer>
                <SubmitButton
                  loading={isSubmitting}
                  disabled={!isValid}
                  onClick={() => submitForm()}
                >
                  Submit
                </SubmitButton>
              </Modal.Footer>
            </>
          )}
        </Formik>
      )}
    </Modal>
  );
}
