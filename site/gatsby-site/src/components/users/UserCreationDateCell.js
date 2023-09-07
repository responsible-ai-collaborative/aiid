import React from 'react';
import { format } from 'date-fns';
import { FIND_USER } from '../../graphql/users';
import { useQuery } from '@apollo/client/react';
import { Spinner } from 'flowbite-react';

const UserCreationDateCell = ({ userId }) => {
  const { data, loading } = useQuery(FIND_USER, {
    variables: { query: { userId } },
  });

  return (
    <>
      {loading && <Spinner />}
      {!loading &&
        data?.user?.adminData?.creationDate &&
        format(new Date(data.user.adminData.creationDate), 'yyyy-MM-dd')}
    </>
  );
};

export default UserCreationDateCell;
