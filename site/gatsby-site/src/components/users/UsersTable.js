import React, { useEffect, useRef, useState } from 'react';
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
import { useApolloClient } from '@apollo/client';
import { FIND_USER } from '../../graphql/users';
import ListSkeleton from 'elements/Skeletons/List';

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

  const [updatedData, setUpdatedData] = useState(data);

  const [loading, setLoading] = useState(true);

  const defaultColumn = React.useMemo(
    () => ({
      className: 'w-[120px]',
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const client = useApolloClient();

  // The rows shown. They start from the list query and are enriched with each
  // account's `adminData`, which is only readable one user at a time.
  const rowsRef = useRef(updatedData);

  useEffect(() => {
    rowsRef.current = updatedData;
  }, [updatedData]);

  useEffect(() => {
    if (!data) return;

    // Keep the rows in step with the list query. The edit modal's mutations update
    // that query through the Apollo cache (roles, names, API access), and the rows
    // used to be copied from it only once, so an edit — such as blocking an
    // account — did not show until the page was reloaded. The adminData already
    // fetched is kept and only fetched for accounts that still lack it.
    const previousRows = rowsRef.current || [];

    setUpdatedData(
      data.map((user) => ({
        ...previousRows.find((row) => row.userId === user.userId),
        ...user,
      }))
    );

    const missingAdminData = data.filter(
      (user) => !previousRows.find((row) => row.userId === user.userId)?.adminData
    );

    const fetchUserAdminData = async () => {
      try {
        await Promise.all(
          missingAdminData.map(async (user) => {
            const result = await client.query({
              query: FIND_USER,
              variables: { filter: { userId: { EQ: user.userId } } },
            });

            if (result.data && result.data.user && result.data.user.adminData) {
              setUpdatedData((prev) =>
                prev.map((row) =>
                  row.userId === result.data.user.userId ? { ...row, ...result.data.user } : row
                )
              );
            }
          })
        );
      } catch (error) {
        console.error('Error querying user admin data:', error);
      }
      setLoading(false);
    };

    fetchUserAdminData();
  }, [data]);

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
  }, [setUserEditId, updatedData, setUpdatedData, loading]);

  const table = useTable(
    {
      columns,
      data: updatedData,
      defaultColumn,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  if (loading) return <ListSkeleton />;

  return (
    <>
      <Table table={table} className={className} {...props} />
      <UserEditModal show={userEditId} userId={userEditId} onClose={() => setUserEditId(null)} />
    </>
  );
}
