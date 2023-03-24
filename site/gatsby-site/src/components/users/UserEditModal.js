import React from 'react';
import { useQuery } from '@apollo/client';
import { Modal } from 'flowbite-react';
import { Formik } from 'formik';
import { Trans } from 'react-i18next';
import UserForm, { schema } from './UserForm';
import { FIND_USER } from '../../graphql/users';
import DefaultSkeleton from 'elements/Skeletons/Default';

export default function UserEditModal({ onClose, userId }) {
  const { data: userData, loading } = useQuery(FIND_USER, {
    variables: { query: { userId: userId } },
  });

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
          onSubmit={async () => {}}
        >
          {() => (
            <>
              <Modal.Body>
                <UserForm />
              </Modal.Body>
            </>
          )}
        </Formik>
      )}
    </Modal>
  );
}
