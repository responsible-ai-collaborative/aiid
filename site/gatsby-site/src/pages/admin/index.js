import React from 'react';
import Layout from 'components/Layout';
import AiidHelmet from 'components/AiidHelmet';
import { FIND_USERS } from '../../graphql/users';
import { useQuery } from '@apollo/client/react';
import UsersTable from 'components/users/UsersTable';
import ListSkeleton from 'elements/Skeletons/List';
import { useUserContext } from 'contexts/userContext';

const AdminPage = (props) => {
  const {
    location: { pathname },
  } = props;

  const { data, loading } = useQuery(FIND_USERS);

  const { isRole, loading: loadingAuth } = useUserContext();

  return (
    <Layout {...props} sidebarCollapsed={true} className="w-full">
      <AiidHelmet path={pathname}>
        <title>Admin</title>
      </AiidHelmet>
      <div>
        {loading && <ListSkeleton />}
        {!loading && !loadingAuth && !isRole('admin') && <div>Not enough permissions</div>}
        {data?.users && isRole('admin') && <UsersTable data={data.users} />}
      </div>
    </Layout>
  );
};

export default AdminPage;
