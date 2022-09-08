import Link from 'components/ui/Link';
import React from 'react';
import { Form } from 'react-bootstrap';
import { useExpanded, useFilters, useSortBy, useTable } from 'react-table';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function SortButton({ column, ...props }) {
  const { isSorted } = column;

  return (
    <button {...props} className={isSorted ? 'text-blue-500' : ''}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="ml-1 w-3 h-3"
        aria-hidden="true"
        fill="currentColor"
        viewBox="0 0 320 512"
      >
        <path d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z" />
      </svg>
    </button>
  );
}

function DefaultColumnFilter({ column: { Header, filterValue, preFilteredRows, setFilter } }) {
  const count = preFilteredRows.length;

  return (
    <Form.Control
      data-cy={`input-filter-${Header}`}
      className="w-100 mt-4"
      type="text"
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={`Search ${count} records...`}
    />
  );
}

function DefaultColumnHeader({ column, ...props }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h6 className="whitespace-nowrap overflow-hidden text-ellipsis m-0" {...props}>
          {column.title}
        </h6>
        <SortButton column={column} {...column.getSortByToggleProps()} />
      </div>
      {column.render('Filter')}
    </div>
  );
}

function IncidentsCell({ cell }) {
  const { row } = cell;

  return (
    <div>
      <div className={`text-black flex justify-between ${row.isExpanded && 'pb-4'}`}>
        {cell.value.length} Incidents
      </div>
      {row.isExpanded && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-240 -mx-4 border-t overflow-y-scroll">
          {cell.value.map((incident) => (
            <li className="p-2 pr-3" key={incident.incident_id}>
              <Link
                className="inline-block bg-red-100 text-red-800 text-xs font-semibold m-1 px-2.5 py-01 rounded dark:bg-green-200 dark:text-green-900"
                to={`/cite/${incident.incident_id}`}
                key={incident.incident_id}
              >
                {incident.incident_id}
              </Link>
              <div className="inline text-black">{incident.title}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EntitiestCell({ cell }) {
  const { row } = cell;

  return (
    <div>
      <div className={`text-black flex justify-between ${row.isExpanded && 'pb-4'}`}>
        {cell.value.length} Entities
      </div>
      {row.isExpanded && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-h-full max-h-240 -mx-4 border-t overflow-y-scroll">
          {cell.value.map((entity) => (
            <li className="py-2" key={entity.id}>
              <Link
                className="inline-block bg-blue-100 text-blue-800 text-xs font-semibold m-1 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
                to={`/entities/${entity.id}`}
                key={entity.id}
              >
                {entity.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
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

const sortByCount = (rowA, rowB, id) => {
  return rowA.values[id].length - rowB.values[id].length;
};

export default function EntitiesTable({ data, className = '' }) {
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
        id: 'expander',
        width: 'w-[1%]',
        Header: ({ getToggleAllRowsExpandedProps, isAllRowsExpanded }) => {
          return (
            <>
              <span {...getToggleAllRowsExpandedProps()}>
                {isAllRowsExpanded ? (
                  <FontAwesomeIcon icon={faMinusCircle} />
                ) : (
                  <FontAwesomeIcon icon={faPlusCircle} />
                )}
              </span>
            </>
          );
        },
        Cell: ({ row }) => {
          const { isExpanded, getToggleRowExpandedProps } = row;

          return (
            <span {...getToggleRowExpandedProps()}>
              {' '}
              {isExpanded ? (
                <FontAwesomeIcon icon={faMinusCircle} />
              ) : (
                <FontAwesomeIcon icon={faPlusCircle} />
              )}
            </span>
          );
        },
      },
      {
        title: 'Entity',
        accessor: 'id',
        width: 'w-[10%]',
        Cell: ({ row: { values, original } }) => (
          <>
            <a className="d-flex" href={`/entities/${values.id}`}>
              {original.name}
            </a>
          </>
        ),
      },
      {
        title: 'As Deployer and Developer',
        width: 'w-[20%]',
        accessor: 'incidentsAsBoth',
        Cell: IncidentsCell,
        filter: incidentFilter,
        sortType: sortByCount,
      },
      {
        title: 'As Deployer',
        width: 'w-[20%]',
        accessor: 'incidentsAsDeployer',
        Cell: IncidentsCell,
        filter: incidentFilter,
        sortType: sortByCount,
      },
      {
        title: 'As Developer',
        width: 'w-[20%]',
        accessor: 'incidentsAsDeveloper',
        Cell: IncidentsCell,
        filter: incidentFilter,
        sortType: sortByCount,
      },
      {
        title: 'Harmed By',
        width: 'w-[20%]',
        accessor: 'incidentsHarmedBy',
        Cell: IncidentsCell,
        filter: incidentFilter,
        sortType: sortByCount,
      },
      {
        title: 'Related Entities',
        width: 'w-[20%]',
        accessor: 'relatedEntities',
        Cell: EntitiestCell,
        filter: entitiesFilter,
        sortType: sortByCount,
      },
    ];

    return columns;
  }, []);

  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: { sortBy: [{ id: 'incidentsAsBoth', desc: true }] },
    },
    useFilters,
    useSortBy,
    useExpanded
  );

  return (
    <div className={`max-w-full ${className}`}>
      {/* eslint-disable react/jsx-key */}

      <div className="max-w-full overflow-x-scroll">
        <table
          {...getTableProps()}
          className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-none overflow-hidden h-[1px]"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className={`${column.width} py-3 px-4 border-none`}
                  >
                    {column.render('Header')}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {rows.map((row, i) => {
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
                        {...cell.getCellProps()}
                        className={`${cell.column.width} py-3 px-4 border-none align-top h-full`}
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
    </div>
  );
}
