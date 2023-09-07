import React from 'react';
import { FIND_USER } from '../../graphql/users';
import { useQuery } from '@apollo/client/react';
import { Badge, Spinner } from 'flowbite-react';

const UserEmailCell = ({ userId }) => {
  const { data, loading } = useQuery(FIND_USER, {
    variables: { query: { userId } },
  });

  return (
    <>
      {loading && <Spinner />}
      {!loading &&
        data &&
        data.user &&
        (data.user?.adminData?.email || <Badge color="grey">Not found</Badge>)}
    </>
  );
};

export default UserEmailCell;
