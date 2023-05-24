import React, { useMemo } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import { startsWith, union, uniqWith, isEqual, filter } from 'lodash';

function ValueCell({ cell, ...props }) {
  const {
    row: {
      original: { hightlight },
    },
  } = props;

  const text = JSON.stringify(cell.value);

  return <div className={(hightlight ? 'bg-red-100' : '') + ' -my-2 -mx-2 p-2'}>{text}</div>;
}

function ResultCell({ cell }) {
  const text = cell.value == null ? `Needs disambiguation` : JSON.stringify(cell.value);

  return (
    <div className={(cell.value == null ? 'bg-red-100' : 'bg-green-100') + ' -my-2 -mx-4 p-2'}>
      {text}
    </div>
  );
}

function mergeClassifications(taxa, short_name, values) {
  const mongo_type = taxa.field_list.find((field) => field.short_name == short_name).mongo_type;

  let result = null;

  // all values are the same

  if (uniqWith(values, isEqual).length == 1) {
    result = values[0];
  }

  //disambiguation
  else {
    const truthyValues = filter(
      values,
      (value) => value !== null && value !== undefined && value !== ''
    );

    if (truthyValues.length == 1) {
      result = truthyValues[0];
    } else {
      switch (mongo_type) {
        case 'array':
          {
            switch (short_name) {
              default:
                result = union(...values);
            }
          }
          break;

        case 'string':
          {
            switch (short_name) {
              case 'notes':
                result = values.map((v, i) => `Annotator ${i + 1}: \n\n ${v}`).join('\n\n');
                break;
              default:
                result = null;
            }
          }
          break;

        case 'bool':
        case 'int':
          result = null;
          break;
      }
    }
  }

  return result;
}

export default function CsetTable({ data, taxa, className = '', ...props }) {
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

    columns.push({
      className: 'w-[10%]',
      accessor: 'result',
      title: 'Result',
      Cell: ResultCell,
    });

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

      const hightlight = uniqWith(values, isEqual).length > 1;

      const result = mergeClassifications(taxa, row.short_name, values);

      const processedRow = {
        ...row,
        hightlight,
        result,
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
