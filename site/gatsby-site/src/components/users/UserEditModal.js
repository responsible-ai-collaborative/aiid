import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Modal } from 'flowbite-react';
import { Formik } from 'formik';
import { Trans } from 'react-i18next';
import UserForm, { schema } from './UserForm';
import { FIND_USER, UPDATE_USER_ROLES } from '../../graphql/users';
import DefaultSkeleton from 'elements/Skeletons/Default';
import SubmitButton from 'components/ui/SubmitButton';

export default function UserEditModal({ onClose, userId }) {
  const { data: userData, loading } = useQuery(FIND_USER, {
    variables: { query: { userId: userId } },
  });

  const [updateUserRoles] = useMutation(UPDATE_USER_ROLES);

  const handleSubmit = async (values) => {
    await updateUserRoles({ variables: { roles: values.roles } });
  };

  return (
    <Modal show={true} onClose={onClose} data-cy="edit-variant-modal" size="lg">
      <Modal.Header>
        <Trans ns="admin">Edit User</Trans>
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
                <UserForm />
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
