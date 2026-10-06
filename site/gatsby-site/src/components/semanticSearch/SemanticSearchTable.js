import React from 'react';
import { usePagination, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faImage,
  faQuestionCircle,
  faSort,
  faSortDown,
  faSortUp,
} from '@fortawesome/free-solid-svg-icons';
import { Tooltip } from 'flowbite-react';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import Link from 'components/ui/Link';
import Table, { formatDateField } from 'components/ui/Table';
import { Image } from 'utils/cloudinary';

// Header that toggles sorting on click and shows the current sort direction.
function SortHeader({ column }) {
  const icon = column.isSorted ? (column.isSortedDesc ? faSortDown : faSortUp) : faSort;

  return (
    <button
      type="button"
      {...column.getSortByToggleProps()}
      className="flex items-center gap-1 whitespace-nowrap uppercase text-left"
    >
      {column.title}
      {column.canSort && <FontAwesomeIcon icon={icon} className="text-gray-400" />}
    </button>
  );
}

// What score ranges mean, from real searches.
const scoreGuide = [
  ['0.4–0.65', 'strong matches'],
  ['0.25–0.4', 'related but looser matches'],
  ['Below about 0.16', 'unrelated topics'],
];

// The score header adds a hint on what a good score is. The hint sits outside the sort button, so
// hovering or clicking it never changes the order.
function ScoreHeader({ column }) {
  const { t } = useTranslation();

  return (
    <div className="flex items-center gap-1">
      <SortHeader column={column} />
      <Tooltip
        content={
          <ul
            className="whitespace-nowrap normal-case text-left"
            data-cy="semantic-search-score-guide"
          >
            {scoreGuide.map(([range, meaning]) => (
              <li key={range}>
                <span className="font-semibold">{t(range)}:</span> {t(meaning)}
              </li>
            ))}
          </ul>
        }
      >
        <button
          type="button"
          aria-label={t('What is a good score?')}
          className="cursor-help text-gray-400"
          data-cy="semantic-search-score-help"
        >
          <FontAwesomeIcon icon={faQuestionCircle} />
        </button>
      </Tooltip>
    </div>
  );
}

// Where an image is stored, the way incident cards find it: by its id, or by its original address.
const publicIdOf = (image) =>
  image && (image.cloudinary_id || (image.image_url && `legacy/${md5(image.image_url)}`));

// A small thumbnail linking to the incident, or a plain box of the same size when it has no image.
function ImageCell({ row }) {
  const { t } = useTranslation();

  const { incident_id, title, image } = row.original;

  const publicID = publicIdOf(image);

  return (
    <Link to={`/cite/${incident_id}`} className="block w-24" data-cy="semantic-search-image">
      {publicID ? (
        <Image
          publicID={publicID}
          transformation={fill().width(192).height(108)}
          alt={title}
          itemIdentifier={t('Incident {{id}}', { id: incident_id }).replace(' ', '.')}
          className="rounded"
          height={108}
        />
      ) : (
        <div className="flex aspect-[16/9] w-full items-center justify-center rounded bg-gray-100 text-gray-300 dark:bg-gray-700">
          <FontAwesomeIcon icon={faImage} />
        </div>
      )}
    </Link>
  );
}

/**
 * Lists search results with sortable columns and pagination, rendered through the shared Table.
 * Each row starts with the incident's picture and ends with its score. Rows start sorted by score,
 * best match first.
 */
export default function SemanticSearchTable({ results }) {
  const { t } = useTranslation();

  const data = React.useMemo(
    () => results.map(({ score, incident, image }) => ({ score, image, ...incident })),
    [results]
  );

  // The short columns shrink to their content, so the title and description get the room.
  const columns = React.useMemo(
    () => [
      {
        id: 'image',
        width: 1,
        title: '',
        Header: () => <span className="sr-only">{t('Image')}</span>,
        disableSortBy: true,
        Cell: ImageCell,
      },
      {
        title: t('Incident ID'),
        accessor: 'incident_id',
        width: 1,
        sortType: 'basic',
        Cell: ({ value }) => <Link to={`/cite/${value}`}>{value}</Link>,
      },
      {
        title: t('Date'),
        accessor: 'date',
        width: 1,
        Cell: ({ value }) => <span className="whitespace-nowrap">{formatDateField(value)}</span>,
      },
      { title: t('Title'), accessor: 'title', width: 180 },
      { title: t('Description'), accessor: 'description', width: 280, disableSortBy: true },
      {
        title: t('Score'),
        accessor: 'score',
        width: 1,
        // Compares numbers, since the default alphanumeric sort misorders decimals.
        sortType: 'basic',
        sortDescFirst: true,
        Header: ScoreHeader,
        Cell: ({ value }) => value.toFixed(3),
      },
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
