import { Button, Label, Spinner } from 'flowbite-react';
import { Link } from 'gatsby';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_USER } from '../../graphql/users';
import { useQuery } from '@apollo/client';
import UserEditModal from './UserEditModal';

export default function UserDetails({ userId }) {
  const { t } = useTranslation(['account']);

  const [showEditModal, setShowEditModal] = React.useState(false);

  const { data, loading } = useQuery(FIND_USER, {
    variables: { query: { userId } },
  });

  if (loading) {
    return (
      <div className="flex flex-wrap gap-2">
        <Spinner />
        <Trans>Loading...</Trans>
      </div>
    );
  }

  return (
    <>
      <p>
        <Label value={t('Email address')} /> : {data.user.adminData.email}
      </p>
      <p>
        <Label value={t('First Name')} /> : {data.user.first_name}
      </p>
      <p>
        <Label value={t('Last Name')} /> : {data.user.last_name}
      </p>

      <div className="flex gap-2 items-center justify-between">
        <Link to="/logout">
          <Trans ns="login">Log out</Trans>
        </Link>
        <Button onClick={() => setShowEditModal(true)}>Edit</Button>
      </div>

      {showEditModal && <UserEditModal userId={userId} onClose={() => setShowEditModal(false)} />}
    </>
  );
}
