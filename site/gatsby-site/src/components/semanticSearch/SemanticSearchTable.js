import React from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faSortDown, faSortUp } from '@fortawesome/free-solid-svg-icons';
import Link from 'components/ui/Link';
import Table, { formatDateField } from 'components/ui/Table';

// Header that toggles sorting on click and shows the current sort direction.
function SortHeader({ column }) {
  const icon = column.isSorted ? (column.isSortedDesc ? faSortDown : faSortUp) : faSort;

  return (
    <button
      type="button"
      {...column.getSortByToggleProps()}
      className="flex items-center gap-1 uppercase text-left"
    >
      {column.title}
      {column.canSort && <FontAwesomeIcon icon={icon} className="text-gray-400" />}
    </button>
  );
}

/**
 * Lists search results with sortable columns and pagination, rendered through the shared Table.
 * Rows start sorted by score, best match first.
 */
export default function SemanticSearchTable({ results }) {
  const { t } = useTranslation();

  const data = React.useMemo(
    () => results.map(({ score, incident }) => ({ score, ...incident })),
    [results]
  );

  const columns = React.useMemo(
    () => [
      {
        title: t('Score'),
        accessor: 'score',
        // Compares numbers, since the default alphanumeric sort misorders decimals.
        sortType: 'basic',
        sortDescFirst: true,
        Cell: ({ value }) => value.toFixed(3),
      },
      {
        title: t('Incident ID'),
        accessor: 'incident_id',
        sortType: 'basic',
        Cell: ({ value }) => <Link to={`/cite/${value}`}>{value}</Link>,
      },
      {
        title: t('Date'),
        accessor: 'date',
        Cell: ({ value }) => formatDateField(value),
      },
      { title: t('Title'), accessor: 'title' },
      { title: t('Description'), accessor: 'description', disableSortBy: true },
    ],
    [t]
  );

  const table = useTable(
    {
      columns,
      data,
      defaultColumn: { Header: SortHeader },
      initialState: { sortBy: [{ id: 'score', desc: true }], pageSize: 25 },
    },
    useSortBy,
    usePagination
  );

  return <Table table={table} />;
}
