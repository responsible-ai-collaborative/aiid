import React, { useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  SelectDatePickerFilter,
  filterDate,
} from 'components/ui/Table';
import { Badge, Button } from 'flowbite-react';
import { format } from 'date-fns';
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

function UsageCountCell({ value, loading }) {
  return loading ? <span className="text-gray-400">…</span> : value.toLocaleString();
}

export default function UsersTable({ data, usageLoading = false, className = '', ...props }) {
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
      // Per-account API usage over the window chosen on the admin page, from one
      // `apiUsageSummaries` request for the whole table (SEE: src/pages/admin).
      // Sorting by requests is the "who is hammering the API" view.
      {
        title: 'Requests',
        id: 'usage.count',
        accessor: (row) => row.usage?.count ?? 0,
        disableFilters: true,
        sortType: 'basic',
        Cell: ({ value }) => <UsageCountCell value={value} loading={usageLoading} />,
      },
      {
        title: 'Active days',
        id: 'usage.activeDays',
        accessor: (row) => row.usage?.activeDays ?? 0,
        disableFilters: true,
        sortType: 'basic',
        Cell: ({ value }) => <UsageCountCell value={value} loading={usageLoading} />,
      },
      {
        title: 'Refused',
        id: 'usage.deniedCount',
        accessor: (row) => row.usage?.deniedCount ?? 0,
        disableFilters: true,
        sortType: 'basic',
        Cell: ({ value }) => <UsageCountCell value={value} loading={usageLoading} />,
      },
      {
        title: 'Last request',
        id: 'usage.lastRequestAt',
        accessor: (row) => row.usage?.lastRequestAt ?? '',
        disableFilters: true,
        sortType: 'basic',
        Cell: ({ value }) => (value ? format(new Date(value), 'yyyy-MM-dd') : ''),
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
        // `row.values` only holds column accessors, and the id is no longer a
        // column, so the account comes from the original row.
        Cell: ({ row: { original } }) => (
          <Button
            data-cy="edit-user-button"
            onClick={() => {
              setUserEditId(original.userId);
            }}
          >
            Edit
          </Button>
        ),
      },
    ];

    return columns;
  }, [setUserEditId, usageLoading]);

  const table = useTable(
    {
      columns,
      data,
      defaultColumn,
      // The rows are rebuilt when the usage summaries arrive or the usage window
      // changes; that must not throw away the filters, sort and page the admin set.
      autoResetFilters: false,
      autoResetSortBy: false,
      autoResetPage: false,
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
