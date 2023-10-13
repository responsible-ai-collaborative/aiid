import React, { useEffect, useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import { Badge, Button } from 'flowbite-react';
import UserEditModal from './UserEditModal';
import { UserCreationDateCell, UserEmailCell, UserLastAuthDateCell } from './UserInfoCells';
import { useApolloClient } from '@apollo/client';
import { FIND_USER } from '../../graphql/users';

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
        data.forEach(async (user) => {
          try {
            const result = await client.query({
              query: FIND_USER,
              variables: { query: { userId: user.userId } },
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
          } catch (error) {
            console.error('Error querying user admin data:', error);
          }
        });
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
          const user = updatedData.find((user) => user.userId === values.userId);

          return <UserEmailCell email={user?.adminData?.email} />;
        },
        filter: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const rowValue = row.values;

            const user = updatedData.find((user) => user.userId === rowValue.userId);

            if (user?.adminData?.email) {
              return user.adminData.email.toLowerCase().includes(filterValue.toLowerCase());
            }
            return false;
          });
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
        Cell: ({ row: { values } }) => {
          const user = updatedData.find((user) => user.userId === values.userId);

          return <UserCreationDateCell creationDate={user?.adminData?.creationDate} />;
        },
      },
      {
        title: 'Last Login Date',
        accessor: 'adminData.lastAuthenticationDate',
        Cell: ({ row: { values } }) => {
          const user = updatedData.find((user) => user.userId === values.userId);

          return (
            <UserLastAuthDateCell
              lastAuthenticationDate={user?.adminData?.lastAuthenticationDate}
            />
          );
        },
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
  }, [setUserEditId, updatedData, setUpdatedData]);

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
      {userEditId && <UserEditModal userId={userEditId} onClose={() => setUserEditId(null)} />}
    </>
  );
}
