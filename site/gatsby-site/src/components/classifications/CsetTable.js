import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import { startsWith, union, uniqWith, isEqual, filter } from 'lodash';
import { Button } from 'flowbite-react';
import { UPDATE_CLASSIFICATION } from '../../graphql/classifications';
import { useMutation } from '@apollo/client';
import { serializeClassification } from 'utils/classifications';

function Entity({ attributes }) {
  const name = JSON.parse(attributes.find((a) => a.short_name == 'Entity').value_json);

  return (
    <div className="my-2 border border-gray-400 p-2">
      <h3>{name}</h3>
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <tbody>
          {attributes.map((a) => (
            <tr key={a.short_name} className="border-b dark:border-gray-700">
              <th
                scope="row"
                className="py-1 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {a.short_name}
              </th>
              <td className="py-1">{JSON.parse(a.value_json)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ValueDisplay({ short_name, cell }) {
  if (short_name == 'Entities') {
    return (
      <div>
        {cell.value.map((entity) => (
          <Entity key={cell.id} attributes={entity.attributes} />
        ))}
      </div>
    );
  }

  const text = JSON.stringify(cell.value);

  return <div>{text}</div>;
}

function ValueCell({ cell, ...props }) {
  const {
    row: {
      values: { short_name },
      original: { highlight, result, disambiguation },
    },
    setData,
  } = props;

  const handleClick = () => {
    if (result == null || !!disambiguation) {
      setData((tableData) => {
        const updated = tableData.map((row) => {
          if (row.short_name == short_name) {
            return { ...row, disambiguation: cell.column.id };
          }

          return row;
        });

        return updated;
      });
    }
  };

  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
  return (
    <div
      className={`${highlight && 'bg-red-100'} ${
        disambiguation == cell.column.id && 'border-2 border-gray-500'
      } -my-2 -mx-2 p-2`}
      onClick={handleClick}
    >
      <ValueDisplay short_name={short_name} cell={cell} />
    </div>
  );
  /* eslint-disable jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */
}

function ResultCell({ cell, ...props }) {
  const {
    row: {
      values: { short_name },
    },
  } = props;

  return (
    <div className={(cell.value == null ? 'bg-red-100' : 'bg-green-100') + ' -my-2 -mx-4 p-2'}>
      <ValueDisplay short_name={short_name} cell={cell} />
    </div>
  );
}

function mergeClassification(taxa, row) {
  const mongo_type = taxa.field_list.find((field) => field.short_name == row.short_name).mongo_type;

  const values = [];

  for (const key in row) {
    if (startsWith(key, 'CSETv1_Annotator-')) {
      values.push(row[key]);
    }
  }

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

    // if only one value is set

    if (truthyValues.length == 1) {
      result = truthyValues[0];
    }

    // if a disambiguation column is chosen
    else if (row.disambiguation != null) {
      result = row[row.disambiguation];
    }

    // disambiguation per field is required
    else {
      switch (mongo_type) {
        case 'array':
          {
            switch (row.short_name) {
              default:
                result = union(...values);
            }
          }
          break;

        case 'string':
          {
            switch (row.short_name) {
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

function TableWrap({ data, setData, className, ...props }) {
  const defaultColumn = useMemo(
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

  const table = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageIndex: 0, pageSize: 9999 },
      setData,
      autoResetPage: false,
      autoResetFilters: false,
      autoResetSortBy: false,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <Table data={data} table={table} className={className} showPagination={false} {...props} />
  );
}

export default function CsetTable({ data, taxa, incident_id, className = '', ...props }) {
  const [updateClassification] = useMutation(UPDATE_CLASSIFICATION);

  const [tableData, setTableData] = useState(data);

  const [processed, setProcessed] = useState(false);

  useEffect(() => {
    const processedRows = [];

    for (const row of tableData) {
      const values = [];

      for (const key in row) {
        if (startsWith(key, 'CSETv1_Annotator-')) {
          values.push(row[key]);
        }
      }

      const highlight = uniqWith(values, isEqual).length > 1;

      const result = mergeClassification(taxa, row);

      const processedRow = {
        ...row,
        highlight,
        result,
        disambiguation: row.disambiguation || null,
      };

      processedRows.push(processedRow);
    }

    setProcessed(true);

    setTableData(processedRows);
  }, [tableData]);

  const submit = useCallback(async () => {
    if (tableData.some((row) => row.result == null)) {
      alert('Please resolve all conflicts before submitting');

      return;
    }

    const values = tableData.reduce((acc, obj) => {
      acc[obj.short_name] = obj.result;
      return acc;
    }, {});

    const attributes = serializeClassification(values, taxa.field_list);

    const data = {
      incident_id,
      namespace: 'CSETv1',
      attributes: attributes.map((a) => a),
    };

    await updateClassification({
      variables: {
        query: {
          incident_id,
          namespace: 'CSETv1',
        },
        data,
      },
    });
  }, [tableData]);

  return (
    <>
      {processed && (
        <TableWrap data={tableData} setData={setTableData} className={className} {...props} />
      )}
      <Button onClick={submit}>Merge Classifications</Button>
    </>
  );
}
