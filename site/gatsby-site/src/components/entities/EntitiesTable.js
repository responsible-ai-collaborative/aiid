import Link from 'components/ui/Link';
import React from 'react';
import { Form } from 'react-bootstrap';
import { useBlockLayout, useFilters, usePagination, useResizeColumns, useTable } from 'react-table';
import { Pagination } from 'flowbite-react';

function HeaderText({ children, ...props }) {
  return (
    <h6 className="whitespace-nowrap overflow-hidden text-ellipsis" {...props}>
      {children}
    </h6>
  );
}

function ResizeHandle({ isResizing, ...props }) {
  return (
    <div
      {...props}
      className={`inline-block w-[6px] h-full absolute right-0 top-0 translate-x-0.5 z-1 touch-none ${
        isResizing ? 'bg-blue-100' : 'bg-gray-100'
      }`}
    />
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
      minWidth: 30,
      width: 220,
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
    },
    useFilters,
    useBlockLayout,
    useResizeColumns,
    usePagination
  );

  return (
    <>
      {/* eslint-disable react/jsx-key */}

      <div
        {...getTableProps()}
        className={`inline-block text-sm text-left text-gray-500 dark:text-gray-400 ${className}`}
        data-cy="table"
      >
        <div className="relative text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="border-b border-right py-3 px-6">
                  {column.render('Filter')}
                  <ResizeHandle {...column.getResizerProps()} isResizing={column.isResizing} />
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* eslint-disable react/jsx-key */}

        <div {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <div
                {...row.getRowProps()}
                className="relative bg-white border-b dark:bg-gray-900 dark:border-gray-700"
                data-cy="row"
              >
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps()} className="py-4 px-6" data-cy="cell">
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
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
    </>
  );
}
