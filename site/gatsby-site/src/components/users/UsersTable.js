import React, { useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  DefaultDateCell,
} from 'components/ui/Table';
import { Badge, Button } from 'flowbite-react';
import UserEditModal from './UserEditModal';

function RolesCell({ cell }) {
  return (
    <div className="flex flex-wrap gap-2">
      {cell.value.map((role) => (
        <Badge key={role}>{role}</Badge>
      ))}
    </div>
  );
}

export default function UsersTable({ data, className = '', ...props }) {
  const [userEditId, setUserEditId] = useState(null);

  const defaultColumn = React.useMemo(
    () => ({
      className: 'w-[120px]',
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const columns = React.useMemo(() => {
    const columns = [
      {
        title: 'Email',
        accessor: 'adminData.email',
        Cell: ({ cell }) => cell.value || <Badge color="grey">Not found</Badge>,
      },
      {
        title: 'Id',
        accessor: 'userId',
      },
      {
        title: 'First Name',
        accessor: 'first_name',
      },
      {
        title: 'Last Name',
        accessor: 'last_name',
      },
      {
        title: 'Roles',
        accessor: 'roles',
        Cell: RolesCell,
      },
      {
        title: 'Creation Date',
        accessor: 'adminData.creationDate',
        Cell: DefaultDateCell,
      },
      {
        title: 'Last Login Date',
        accessor: 'adminData.lastAuthenticationDate',
        Cell: DefaultDateCell,
      },
      {
        id: 'actions',
        title: 'Actions',
        className: 'w-[80px]',
        Cell: ({ row: { values } }) => (
          <Button
            onClick={() => {
              setUserEditId(values.userId);
            }}
          >
            Edit
          </Button>
        ),
      },
    ];

    return columns;
  }, [setUserEditId]);

  const table = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { sortBy: [{ id: 'email', desc: true }] },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <Table table={table} className={className} {...props} />
      {userEditId && <UserEditModal userId={userEditId} onClose={() => setUserEditId(null)} />}
    </>
  );
}
