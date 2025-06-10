import React, { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchUserAdminData = async () => {
      if (data) {
        try {
          const promises = data.map(async (user) => {
            const result = await client.query({
              query: FIND_USER,
              variables: { filter: { userId: { EQ: user.userId } } },
            });

            if (result.data && result.data.user && result.data.user.adminData) {
              const adminDataUserIndex = updatedData.findIndex(
                (updatedUser) =>
                  updatedUser.userId === result.data.user.userId && !updatedUser.adminData
              );

              if (adminDataUserIndex !== -1) {
                const updatedNode = {
                  ...updatedData[adminDataUserIndex],
                  ...result.data.user,
                };

                setUpdatedData((prev) => {
                  const updatedData = [...prev];

                  updatedData[adminDataUserIndex] = updatedNode;
                  return updatedData;
                });
              }
            }
          });

          await Promise.all(promises);
        } catch (error) {
          console.error('Error querying user admin data:', error);
        }
        setLoading(false);
      }
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
