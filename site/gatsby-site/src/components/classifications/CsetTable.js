import React, { useMemo } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import { startsWith, uniq } from 'lodash';

function ValueCell({ cell, ...props }) {
  const {
    row: {
      original: { hightlight },
    },
  } = props;

  return <div className={(hightlight ? 'bg-red-100' : '') + ' -my-2 -mx-4 p-2'}>{cell.value}</div>;
}

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
        columns.push({ accessor: key, title: key, Cell: ValueCell });
      }
    }

    return columns;
  }, [data]);

  const processedData = useMemo(() => {
    const processedRows = [];

    for (const row of data) {
      const values = [];

      for (const key in row) {
        if (startsWith(key, 'CSETv1_Annotator-')) {
          values.push(row[key]);
        }
      }

      const hightlight = uniq(values).length > 1;

      const processedRow = {
        ...row,
        hightlight,
      };

      processedRows.push(processedRow);
    }

    return processedRows;
  }, [data]);

  const table = useTable(
    {
      columns,
      data: processedData,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 100 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return <Table data={processedData} table={table} className={className} {...props} />;
}
