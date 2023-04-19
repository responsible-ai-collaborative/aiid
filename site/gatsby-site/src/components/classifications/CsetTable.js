import React from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import { startsWith } from 'lodash';

export default function CsetTable({ data, className = '', ...props }) {
  const defaultColumn = React.useMemo(
    () => ({
      className: 'w-[20%]',
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const columns = React.useMemo(() => {
    const columns = [
      {
        className: 'w-[10%]',
        accessor: 'short_name',
        title: 'Short Name',
      },
    ];

    const [firstRow] = data;

    if (firstRow) {
      for (const key of Object.keys(firstRow).filter((key) =>
        startsWith(key, 'CSETv1_Annotator-')
      )) {
        columns.push({ accessor: key, title: key });
      }
    }

    return columns;
  }, [data]);

  const table = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 100 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return <Table data={data} table={table} className={className} {...props} />;
}
