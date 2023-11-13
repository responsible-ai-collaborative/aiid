import React from 'react';
import { format } from 'date-fns';
import { Badge } from 'flowbite-react';

const UserCreationDateCell = ({ creationDate }) => {
  return <>{creationDate && format(new Date(creationDate), 'yyyy-MM-dd')}</>;
};

const UserLastAuthDateCell = ({ lastAuthenticationDate }) => {
  return <>{lastAuthenticationDate && format(new Date(lastAuthenticationDate), 'yyyy-MM-dd')}</>;
};

const UserEmailCell = ({ email }) => {
  return <>{email || <Badge color="grey">Not found</Badge>}</>;
};

export { UserCreationDateCell, UserLastAuthDateCell, UserEmailCell };
