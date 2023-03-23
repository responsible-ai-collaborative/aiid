import React from 'react';
import Layout from 'components/Layout';
import AiidHelmet from 'components/AiidHelmet';
import { FIND_USERS } from '../../graphql/admin';
import { useQuery } from '@apollo/client/react';
import UsersTable from 'components/users/UsersTable';

const SubmitPage = (props) => {
  const {
    location: { pathname },
  } = props;

  const { data } = useQuery(FIND_USERS);

  return (
    <Layout {...props} className="md:max-w-5xl">
      <AiidHelmet path={pathname}>
        <title>Admin</title>
      </AiidHelmet>
      <div>{data?.users && <UsersTable data={data.users} />}</div>
    </Layout>
  );
};

export default SubmitPage;
