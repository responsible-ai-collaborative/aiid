import React from 'react';
import { useExpanded, useFilters, useSortBy, useTable } from 'react-table';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  DefaultDateCell,
} from 'components/ui/Table';
import { Badge } from 'flowbite-react';

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
  const defaultColumn = React.useMemo(
    () => ({
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
      },
      {
        title: 'Id',
        accessor: 'userId',
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
        title: 'Creation Date',
        accessor: 'adminData.lastAuthenticationDate',
        Cell: DefaultDateCell,
      },
    ];

    return columns;
  }, []);

  const table = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { sortBy: [{ id: 'email', desc: true }] },
    },
    useFilters,
    useSortBy,
    useExpanded
  );

  return <Table data={data} table={table} className={className} {...props} />;
}
