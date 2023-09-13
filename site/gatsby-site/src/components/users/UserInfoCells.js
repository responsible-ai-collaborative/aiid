import React from 'react';
import { format } from 'date-fns';
import { FIND_USER } from '../../graphql/users';
import { useQuery } from '@apollo/client/react';
import { Badge, Spinner } from 'flowbite-react';

const UserCreationDateCell = ({ userId }) => {
  const { data, loading } = useQuery(FIND_USER, {
    variables: { query: { userId } },
  });

  return (
    <>
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!loading &&
        data?.user?.adminData?.creationDate &&
        format(new Date(data.user.adminData.creationDate), 'yyyy-MM-dd')}
    </>
  );
};

const UserLastAuthDateCell = ({ userId }) => {
  const { data, loading } = useQuery(FIND_USER, {
    variables: { query: { userId } },
  });

  return (
    <>
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!loading &&
        data?.user?.adminData?.lastAuthenticationDate &&
        format(new Date(data.user.adminData.lastAuthenticationDate), 'yyyy-MM-dd')}
    </>
  );
};

const UserEmailCell = ({ userId }) => {
  const { data, loading } = useQuery(FIND_USER, {
    variables: { query: { userId } },
  });

  return (
    <>
      {loading && (
        <div className="flex justify-center">
          <Spinner />
        </div>
      )}
      {!loading &&
        data &&
        data.user &&
        (data.user?.adminData?.email || <Badge color="grey">Not found</Badge>)}
    </>
  );
};

export { UserCreationDateCell, UserLastAuthDateCell, UserEmailCell };
