import React, { useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  SelectDatePickerFilter,
  filterDate,
} from 'components/ui/Table';
import { Badge, Button } from 'flowbite-react';
import UserEditModal from './UserEditModal';
import { UserCreationDateCell, UserEmailCell, UserLastAuthDateCell } from './UserInfoCells';

function RolesCell({ cell }) {
  return (
    <div className="flex flex-wrap gap-2">
      {cell.value.map((role) => (
        <Badge key={role}>{role}</Badge>
      ))}
    </div>
  );
}

function ApiAccessCell({ cell }) {
  return cell.value ? (
    <Badge color="failure" data-cy="api-access-blocked-badge">
      Blocked
    </Badge>
  ) : (
    <Badge color="success">Allowed</Badge>
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

  // The rows are the list query's result, admin data included (SEE:
  // `FIND_USERS_ADMIN`). The edit modal's mutations return the user with its
  // `userId`, which is the cache key, so an edit shows here without a refetch.

  const columns = React.useMemo(() => {
    const columns = [
      {
        title: 'Email',
        accessor: 'adminData.email',
        className: 'min-w-[240px]',
        Cell: ({ row: { values } }) => {
          return <UserEmailCell email={values['adminData.email']} />;
        },
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
        // Surfaces the block on the list itself, so an admin can see at a glance
        // which accounts are barred from the API without opening each one.
        // SEE: server/apiAccess.ts
        title: 'API Access',
        accessor: 'api_access_blocked',
        Cell: ApiAccessCell,
      },
      {
        title: 'Creation Date',
        accessor: 'adminData.creationDate',
        Filter: SelectDatePickerFilter,
        Cell: ({ row: { values } }) => {
          return <UserCreationDateCell creationDate={values['adminData.creationDate']} />;
        },
        filter: (rows, id, filterValue) => filterDate(rows, id, filterValue),
      },
      {
        title: 'Last Login Date',
        accessor: 'adminData.lastAuthenticationDate',
        Cell: ({ row: { values } }) => {
          return (
            <UserLastAuthDateCell
              lastAuthenticationDate={values['adminData.lastAuthenticationDate']}
            />
          );
        },
        Filter: SelectDatePickerFilter,
        filter: (rows, id, filterValue) => filterDate(rows, id, filterValue),
      },
      {
        id: 'actions',
        title: 'Actions',
        className: 'w-[80px]',
        Cell: ({ row: { values } }) => (
          <Button
            data-cy="edit-user-button"
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
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <Table table={table} className={className} {...props} />
      <UserEditModal show={userEditId} userId={userEditId} onClose={() => setUserEditId(null)} />
    </>
  );
}
