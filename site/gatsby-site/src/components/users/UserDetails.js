import { Badge, Button, Spinner } from 'flowbite-react';
import { Link } from 'gatsby';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_USER } from '../../graphql/users';
import { useQuery } from '@apollo/client';
import UserEditModal from './UserEditModal';
import { BooleanParam, useQueryParams, withDefault } from 'use-query-params';

export default function UserDetails({ userId }) {
  const { t } = useTranslation(['account', 'translation']);

  const [showEditModal, setShowEditModal] = React.useState(false);

  const [{ askToCompleteProfile }] = useQueryParams({
    askToCompleteProfile: withDefault(BooleanParam, false),
  });

  useEffect(() => {
    if (askToCompleteProfile) {
      setShowEditModal(true);
    }
  }, []);

  const { data, loading } = useQuery(FIND_USER, {
    variables: { filter: { userId: { EQ: userId } } },
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
      <table
        className="w-full text-sm text-left text-gray-500 dark:text-gray-400"
        data-cy="details-table"
      >
        <tbody>
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            data-cy="user-email"
          >
            <th
              scope="row"
              className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {t('Email')}
            </th>
            <td className="py-4">{data.user.adminData.email}</td>
          </tr>
          <tr
            className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            data-cy="user-first-name"
          >
            <th
              scope="row"
              className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {t('First Name')}
            </th>
            <td className="py-4">{data.user.first_name}</td>
          </tr>
          <tr className="bg-white dark:bg-gray-800" data-cy="user-last-name">
            <th
              scope="row"
              className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {t('Last Name')}
            </th>
            <td className="py-4">{data.user.last_name}</td>
          </tr>
          <tr className="bg-white dark:bg-gray-800" data-cy="user-role">
            <th
              scope="row"
              className="py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
            >
              {t('Roles')}
            </th>
            <td className="py-4">
              <div className="flex flex-wrap gap-2">
                {data.user.roles.map((role) => (
                  <Badge key={role} data-cy="role-badge">
                    {role}
                  </Badge>
                ))}
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="flex gap-2 items-center justify-between mt-4">
        <Link to="/logout">
          <Trans ns="login">Log out</Trans>
        </Link>
        <Button onClick={() => setShowEditModal(true)}>
          <Trans>Edit</Trans>
        </Button>
      </div>

      {showEditModal && (
        <UserEditModal
          userId={userId}
          onClose={() => setShowEditModal(false)}
          alertTitle={t('completeInfoAlertTitle')}
          alertText={t('completeInfoAlertMessage')}
        />
      )}
    </>
  );
}
