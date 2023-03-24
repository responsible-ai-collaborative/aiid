import React from 'react';
import Layout from 'components/Layout';
import AiidHelmet from 'components/AiidHelmet';
import { FIND_USERS } from '../../graphql/users';
import { useQuery } from '@apollo/client/react';
import UsersTable from 'components/users/UsersTable';
import ListSkeleton from 'elements/Skeletons/List';

const AdminPage = (props) => {
  const {
    location: { pathname },
  } = props;

  const { data, loading } = useQuery(FIND_USERS);

  return (
    <Layout {...props} className="md:max-w-5xl">
      <AiidHelmet path={pathname}>
        <title>Admin</title>
      </AiidHelmet>
      <div className="w-full">
        {loading && <ListSkeleton />}
        {data?.users && <UsersTable data={data.users} />}
      </div>
    </Layout>
  );
};

export default AdminPage;
