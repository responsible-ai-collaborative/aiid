import React from 'react';
import { Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import DateLabel from './DateLabel';

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

export function DefaultColumnFilter({
  column: { title, filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  const { t } = useTranslation(['entities']);

  return (
    <Form.Control
      data-cy={`input-filter-${title}`}
      className="w-100 mt-4"
      type="text"
      value={filterValue || ''}
      onChange={(e) => {
        setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
      }}
      placeholder={t(`Search {{count}} records...`, { count })}
    />
  );
}

export function DefaultColumnHeader({ column, ...props }) {
  return (
    <div>
      <div className="flex justify-between items-center">
        <h6 className="whitespace-nowrap overflow-hidden text-ellipsis m-0" {...props}>
          <Trans ns="entities">{column.title}</Trans>
        </h6>
        <SortButton column={column} {...column.getSortByToggleProps()} />
      </div>
      {column.render('Filter')}
    </div>
  );
}

export function DefaultActionsColumnHeader({ column, ...props }) {
  return (
    <div className="flex justify-between items-start h-full">
      <h6 className="whitespace-nowrap overflow-hidden text-ellipsis m-0" {...props}>
        <Trans ns="entities">{column.title}</Trans>
      </h6>
    </div>
  );
}

export function DefaultDateCell({ cell }) {
  return cell.value ? <DateLabel date={new Date(cell.value)} /> : null;
}

export default function Table({ table, className = '', ...props }) {
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows } = table;

  return (
    <div className={`max-w-full ${className}`} {...props}>
      {/* eslint-disable react/jsx-key */}

      <div className="max-w-full overflow-x-scroll">
        <table
          {...getTableProps()}
          className="w-full text-sm text-left text-gray-900 dark:text-gray-400 border-none overflow-hidden h-[1px]"
        >
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps()}
                    className={`${column.width} py-3 px-4 border-none`}
                    data-cy={`header-${column.id}`}
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
                  data-cy={`row-${row.values.id}`}
                >
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps()}
                        className={`${cell.column.width} py-3 px-4 border-none align-top h-full`}
                        data-cy={`cell-${cell.column.id}`}
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
