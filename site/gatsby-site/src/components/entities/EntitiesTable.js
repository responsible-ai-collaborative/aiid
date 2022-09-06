import Link from 'components/ui/Link';
import React from 'react';
import { Form } from 'react-bootstrap';
import { useFilters, usePagination, useTable } from 'react-table';
import { Pagination } from 'flowbite-react';

function HeaderText({ children, ...props }) {
  return (
    <h6 className="whitespace-nowrap overflow-hidden text-ellipsis" {...props}>
      {children}
    </h6>
  );
}

function DefaultColumnFilter({
  column: { Header, canFilter, filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  if (!canFilter) {
    return <HeaderText>{Header}</HeaderText>;
  }

  return (
    <>
      <HeaderText>{Header}</HeaderText>
      <Form.Control
        data-cy={`input-filter-${Header}`}
        className="w-100"
        type="text"
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    </>
  );
}

function IncidentsCell({ cell }) {
  return (
    <div>
      {cell.value.map((incident) => (
        <Link
          className="inline-block bg-red-100 text-red-800 text-xs font-semibold m-1 px-2.5 py-01 rounded dark:bg-green-200 dark:text-green-900"
          to={`/cite/${incident.incident_id}`}
          key={incident.incident_id}
        >
          {incident.incident_id}
        </Link>
      ))}
    </div>
  );
}

function EntitiestCell({ cell }) {
  return (
    <div>
      {cell.value.map((entity) => (
        <Link
          className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold m-1 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
          to={`/entities/${entity.id}`}
          key={entity.id}
        >
          {entity.name}
        </Link>
      ))}
    </div>
  );
}

const incidentFilter = (rows, [field], value) =>
  rows.filter((row) => {
    return row.values[field].some((incident) => incident.incident_id.toString() === value);
  });

const entitiesFilter = (rows, [field], value) =>
  rows.filter((row) => {
    return row.values[field].some((entity) =>
      entity.name.toLowerCase().includes(value.toLowerCase())
    );
  });

export default function EntitiesTable({ data, className = '' }) {
  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 240,
      width: 320,
      maxWidth: 640,
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const columns = React.useMemo(() => {
    const columns = [
      {
        Header: 'Entity',
        accessor: 'id',
        Cell: ({ row: { values, original } }) => (
          <>
            <a className="d-flex" href={`/entities/${values.id}`}>
              {original.name}
            </a>
          </>
        ),
      },
      {
        Header: 'As Deployer and Developer',
        accessor: 'incidentsAsBoth',
        Cell: IncidentsCell,
        filter: incidentFilter,
      },
      {
        Header: 'As Deployer',
        accessor: 'incidentsAsDeployer',
        Cell: IncidentsCell,
        filter: incidentFilter,
      },
      {
        Header: 'As Developer',
        accessor: 'incidentsAsDeveloper',
        Cell: IncidentsCell,
        filter: incidentFilter,
      },
      {
        Header: 'Related Entities',
        accessor: 'relatedEntities',
        Cell: EntitiestCell,
        filter: entitiesFilter,
      },
    ];

    return columns;
  }, []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    gotoPage,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { pageSize: 50 },
    },
    useFilters,
    usePagination
  );

  return (
    <div className={`max-w-full ${className}`}>
      {/* eslint-disable react/jsx-key */}

      <div className="max-w-full overflow-x-scroll">
        <table
          {...getTableProps()}
          className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-none overflow-hidden"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps({
                      className:
                        (column.collapse ? 'w-[0.0000000001%]' : 'w-[1%]') +
                        'py-3 px-4 border-none',
                    })}
                  >
                    {column.render('Filter')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, i) => {
              prepareRow(row);
              return (
                <tr
                  {...row.getRowProps()}
                  className={`border-b dark:bg-gray-800 dark:border-gray-700") + ${
                    i % 2 == 0
                      ? 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                      : 'bg-white dark:bg-gray-900 dark:border-gray-700'
                  }`}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps({
                          className:
                            (cell.column.collapse ? 'w-[0.0000000001%]' : 'w-[1%]') +
                            'py-4 px-4 border-none',
                        })}
                      >
                        {cell.render('Cell')}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="flex flex-col items-center mt-4 mb-6">
        <span className="text-sm text-gray-700 dark:text-gray-400">
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>

        <Pagination
          currentPage={pageIndex}
          totalPages={pageOptions.length}
          onPageChange={(page) => gotoPage(page)}
        />
      </div>
    </div>
  );
}
