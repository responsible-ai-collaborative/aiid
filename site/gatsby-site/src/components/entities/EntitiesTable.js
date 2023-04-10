import Link from 'components/ui/Link';
import React from 'react';
import { useExpanded, useFilters, useSortBy, useTable } from 'react-table';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans } from 'react-i18next';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';

function IncidentsCell({ cell }) {
  const { row, column } = cell;

  const filtered = column.filterValue
    ? cell.value.filter((incident) =>
        ['incident_id', 'title'].some((field) =>
          incident[field].toString().toLowerCase().includes(column.filterValue)
        )
      )
    : cell.value;

  return (
    <div>
      <div className={`text-black flex justify-between ${row.isExpanded && 'pb-4'}`}>
        <Trans ns="entities" count={filtered.length}>
          {{ count: filtered.length }} Incident
        </Trans>
      </div>
      {row.isExpanded && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 max-h-240 -mx-4 border-t overflow-y-scroll">
          {filtered.map((incident) => (
            <li className="p-2 pr-3 list-none" key={incident.incident_id}>
              <Link
                className="inline-block bg-red-100 text-red-800 text-xs font-semibold m-1 px-2.5 py-01 rounded dark:bg-green-200 dark:text-green-900"
                to={`/cite/${incident.incident_id}`}
                key={incident.incident_id}
              >
                Incident {incident.incident_id}
              </Link>
              <div className="text-black ml-1">{incident.title}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EntitiesCell({ cell }) {
  const { row, column } = cell;

  const filtered = column.filterValue
    ? cell.value.filter((entity) =>
        ['name'].some((field) =>
          entity[field].toString().toLowerCase().includes(column.filterValue)
        )
      )
    : cell.value;

  return (
    <div>
      <div className={`text-black flex justify-between ${row.isExpanded && 'pb-4'}`}>
        <Trans ns="entities" count={filtered.length}>
          {{ count: filtered.length }} Entity
        </Trans>
      </div>
      {row.isExpanded && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-h-full max-h-240 -mx-4 border-t overflow-y-scroll">
          {filtered.map((entity) => (
            <li className="py-2 list-none" key={entity.id}>
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

function ResponseCell({ cell }) {
  const { row, column } = cell;

  const filtered = column.filterValue
    ? cell.value.filter((response) =>
        ['report_number', 'title'].some((field) =>
          response[field].toString().toLowerCase().includes(column.filterValue)
        )
      )
    : cell.value;

  return (
    <div>
      <div className={`text-black flex justify-between ${row.isExpanded && 'pb-4'}`}>
        <Trans ns="entities" count={filtered.length}>
          {{ count: filtered.length }} Incident responses
        </Trans>
      </div>
      {row.isExpanded && (
        <ul className="divide-y divide-gray-200 dark:divide-gray-700 min-h-full max-h-240 -mx-4 border-t overflow-y-scroll">
          {filtered.map((response) => (
            <li
              className="py-2 list-none"
              key={`${response.incident_id}#r${response.report_number}`}
            >
              <Link
                className="inline-block bg-green-100 text-green-800 text-xs font-semibold m-1 px-2.5 py-0.5 rounded dark:bg-green-200 dark:text-green-900"
                to={`/cite/${response.incident_id}#r${response.report_number}`}
                key={`${response.incident_id}#r${response.report_number}`}
              >
                Response {response.report_number}
              </Link>
              <div className="text-black ml-1">{response.title}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const incidentFilter = (rows, [field], value) =>
  rows.filter((row) => {
    return row.values[field].some((incident) =>
      ['incident_id', 'title'].some((field) =>
        incident[field].toString().toLowerCase().includes(value)
      )
    );
  });

const entitiesFilter = (rows, [field], value) =>
  rows.filter((row) => {
    return row.values[field].some((entity) =>
      entity.name.toLowerCase().includes(value.toLowerCase())
    );
  });

const entityFilter = (rows, _, value) => {
  return rows.filter((row) => row.original.name.toLowerCase().includes(value.toLowerCase()));
};

const responseFilter = (rows, [field], value) =>
  rows.filter((row) => {
    return row.values[field].some((response) =>
      ['report_number', 'title'].some((field) =>
        response[field].toString().toLowerCase().includes(value)
      )
    );
  });

const sortByCount = (rowA, rowB, id) => {
  return rowA.values[id].length - rowB.values[id].length;
};

export default function EntitiesTable({ data, className = '', ...props }) {
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
            <Link className="d-flex" to={`/entities/${values.id}`}>
              {original.name}
            </Link>
          </>
        ),
        filter: entityFilter,
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
        Cell: EntitiesCell,
        filter: entitiesFilter,
        sortType: sortByCount,
      },
      {
        title: 'Incident Responses',
        width: 'w-[20%]',
        accessor: 'responses',
        Cell: ResponseCell,
        filter: responseFilter,
        sortType: sortByCount,
      },
    ];

    return columns;
  }, []);

  const table = useTable(
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

  return <Table data={data} table={table} className={className} {...props} />;
}
