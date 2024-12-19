import React from 'react';
import { FIND_USERS } from '../../graphql/users';
import { useQuery } from '@apollo/client/react';
import UsersTable from 'components/users/UsersTable';
import ListSkeleton from 'elements/Skeletons/List';
import { useUserContext } from 'contexts/UserContext';
import { Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { useLocalization } from 'plugins/gatsby-theme-i18n';
import useLocalizePath from 'components/i18n/useLocalizePath';
import HeadContent from 'components/HeadContent';

const AdminPage = (props) => {
  const { data, loading } = useQuery(FIND_USERS);

  const { isRole, loading: loadingAuth } = useUserContext();

  const { locale } = useLocalization();

  const localizePath = useLocalizePath();

  return (
    <div className="w-full" {...props}>
      <div>
        {loading && <ListSkeleton />}
        {!loading && !loadingAuth && !isRole('admin') && <div>Not enough permissions</div>}
        {data?.users && isRole('admin') && (
          <>
            <div className="w-fit mb-5">
              <Button href={localizePath({ path: '/incidents/new', language: locale })}>
                <Trans>New Incident</Trans>
              </Button>
            </div>
            <UsersTable data={data.users} />
          </>
        )}
      </div>
    </div>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  return (
    <HeadContent path={pathname} metaTitle={'Admin'} metaDescription={'Administration page'} />
  );
};

export default AdminPage;
