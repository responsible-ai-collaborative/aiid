import React from 'react';
import { Trans, useTranslation } from 'react-i18next';
import DateLabel from './DateLabel';
import { Button, Dropdown, Pagination, Select, TextInput } from 'flowbite-react';
import { format } from 'date-fns';
import DateRangePicker from 'react-bootstrap-daterangepicker';

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
  column: { title, Header, canFilter, filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  const { t } = useTranslation();

  if (!canFilter) {
    return <h6 className="whitespace-nowrap overflow-hidden text-ellipsis">{Header}</h6>;
  }

  return (
    <div data-cy="filter">
      <h6 className="whitespace-nowrap overflow-hidden text-ellipsis">{Header}</h6>
      <TextInput
        data-cy={`input-filter-${title}`}
        className="w-100 font-normal"
        type="text"
        placeholder={t(`Search {{count}} records...`, { count })}
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
      />
    </div>
  );
}

export function DefaultColumnHeader({ column }) {
  return (
    <div className="h-full">
      <div className="flex justify-between items-center">
        <h6 className="whitespace-nowrap overflow-hidden text-ellipsis m-0">
          <Trans>{column.title}</Trans>
        </h6>
        {column.canSort && <SortButton column={column} {...column.getSortByToggleProps()} />}
      </div>
      {column.render('Filter')}
    </div>
  );
}

export function DefaultDateCell({ cell }) {
  return <DateLabel date={new Date(cell.value)} />;
}

export function SelectDatePickerFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
  startDate = null,
  endDate = null,
  setDates = null,
  ...props
}) {
  const [min, max] = React.useMemo(() => {
    let min = new Date(preFilteredRows[0]?.values[id] ?? '1970-01-01').getTime();

    let max = new Date(preFilteredRows[0]?.values[id] ?? '1970-01-01').getTime();

    preFilteredRows.forEach((row) => {
      const currentDatetime = new Date(row.values[id]).getTime();

      min = currentDatetime <= min ? currentDatetime : min;
      max = currentDatetime >= max ? currentDatetime : max;
    });
    return [min, max];
  }, [id, preFilteredRows]);

  if (filterValue.length === 0) {
    setFilter;
  }

  const handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY')
    );
    setFilter([picker.startDate.valueOf(), picker.endDate.valueOf()]);

    if (setDates) {
      setDates([picker.startDate.valueOf(), picker.endDate.valueOf()]);
    }
  };

  const handleCancel = (event, picker) => {
    picker.element.val('');
    setFilter([min, max]);
    if (setDates) {
      setDates([]);
    }
  };

  let initialSettings = {
    showDropdowns: true,
    autoUpdateInput: false,
    locale: {
      cancelLabel: 'Clear',
    },
  };

  let defaultValue = '';

  if (startDate && endDate) {
    const formatedStartDate = format(new Date(startDate), 'MM/dd/yyyy');

    const formatedEndDate = format(new Date(endDate), 'MM/dd/yyyy');

    defaultValue = `${formatedStartDate} - ${formatedEndDate}`;
    initialSettings = {
      ...initialSettings,
      startDate: formatedStartDate,
      endDate: formatedEndDate,
    };
  }

  return (
    <div className="flex font-normal mt-2">
      <DateRangePicker
        className="custom-picker"
        onApply={handleApply}
        onCancel={handleCancel}
        initialSettings={initialSettings}
      >
        <input
          style={{ width: 190 }}
          type="text"
          className="form-control col-4 p-2"
          defaultValue={defaultValue}
          {...props}
        />
      </DateRangePicker>
    </div>
  );
}

export function SelectColumnFilter({
  column: { filterValue = [], setFilter, preFilteredRows, id },
}) {
  let options;

  const ARRAY_COLUMNS = ['submitters'];

  const filterOptionsFromArray = () => {
    return (options = React.useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach((row) => {
        if (Array.isArray(row.values[id])) {
          row.values[id].forEach((w) => {
            if (w !== '') {
              options.add(w);
            }
          });
        } else {
          if (row.values[id] !== '') {
            options.add(row.values[id]);
          }
        }
      });
      return [...options.values()];
    }, [id, preFilteredRows]));
  };

  if (ARRAY_COLUMNS.includes(id)) {
    options = filterOptionsFromArray();
  } else {
    options = React.useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach((row) => {
        if (row.values[id] !== '') {
          options.add(row.values[id]);
        }
      });
      return [...options.values()];
    }, [id, preFilteredRows]);
  }

  const filteredOptions = options.filter((o) => o !== '-');

  return (
    <Select
      style={{ width: '100%' }}
      className="mt-2"
      value={filterValue || 'All'}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {filteredOptions.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
}

export function formatDateField(date) {
  const dateObj = new Date(`${date}T00:00:00`); // Fix date to avoid timezone issues

  if (dateObj instanceof Date && !isNaN(dateObj)) {
    return <>{format(new Date(dateObj), 'yyyy-MM-dd')}</>;
  } else {
    return <>{date}</>;
  }
}

export function sortDateField(rowA, rowB, fieldName) {
  if (
    rowA.original[fieldName] &&
    rowA.original[fieldName] !== '' &&
    rowB.original[fieldName] &&
    rowB.original[fieldName] !== ''
  ) {
    const dateRowA = new Date(rowA.original[fieldName]);

    const dateRowB = new Date(rowB.original[fieldName]);

    if (dateRowA > dateRowB) {
      return 1;
    }

    if (dateRowA < dateRowB) {
      return -1;
    }

    return 0;
  }
}

export function filterDate(rows, id, filterValue) {
  return rows.filter((row) => {
    const rowValue = row.values[id];

    if (!rowValue) return false;
    const filterValueDate = new Date(rowValue).getTime();

    return filterValueDate >= filterValue[0] && filterValueDate <= filterValue[1];
  });
}

export default function Table({
  table,
  showPagination = true,
  className = '',
  tableClassName = '',
  ...props
}) {
  const { t } = useTranslation(['entities']);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = table;

  return (
    <div className={`max-w-full ${className || ''}`} {...props}>
      {/* eslint-disable react/jsx-key */}
      <div className="max-w-full overflow-x-scroll">
        <table {...getTableProps()} className={`${tableClassName} w-full`}>
          <thead className="bg-gray-50 text-xs uppercase text-gray-700 dark:bg-gray-700 dark:text-gray-400 ">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => {
                  let headerProps = column.getHeaderProps();

                  const style = { ...headerProps.style };

                  if (column.width) {
                    style.width = Number.isInteger(column.width)
                      ? `${column.width}px`
                      : column.width; // Allows auto value
                  }
                  headerProps = { ...headerProps, style };
                  return (
                    <th
                      {...headerProps}
                      className={`${column.className || ''} py-3 px-4 border-none align-top`}
                      data-cy={`header-${column.id}`}
                    >
                      {column.render('Header')}
                      {column.getResizerProps && (
                        <div
                          {...column.getResizerProps()}
                          className="inline-block bg-gray-400 w-1 h-full absolute right-0 top-0 translate-x-1/2 z-2 hover:bg-gray-500"
                        />
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="divide-y">
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
                  data-cy={`row`}
                >
                  {row.cells.map((cell) => {
                    const cellOriginalWidth = cell.column?.originalWidth;

                    let cellProps = cell.getCellProps();

                    if (cellOriginalWidth) {
                      cellProps = {
                        ...cellProps,
                        style: {
                          ...cellProps.style,
                          minWidth: `${cellOriginalWidth}px`, //Doesn't allow resizing under the min-width
                        },
                      };
                    }
                    return (
                      <td
                        {...cellProps}
                        className={`py-3 px-4 border-none align-top h-full text-gray-700`}
                        data-cy={`cell`}
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
        {showPagination && (
          <div className="flex gap-2 justify-start items-center my-3 pl-1 pagination">
            {pageSize < 9999 && (
              <>
                <Button onClick={() => gotoPage(0)} size={'sm'} color="light" data-cy="first-page">
                  <Trans>First</Trans>
                </Button>

                <Pagination
                  className="pagination mb-0 text-gray-800"
                  onPageChange={(page) => {
                    gotoPage(page - 1);
                  }}
                  currentPage={pageIndex + 1}
                  showIcons={true}
                  totalPages={pageCount}
                />

                <Button
                  onClick={() => gotoPage(pageCount - 1)}
                  size={'sm'}
                  color="light"
                  data-cy="last-page"
                >
                  <Trans>Last</Trans>
                </Button>
              </>
            )}

            <span>
              Page{' '}
              <strong>
                <span data-cy="current-page">{pageIndex + 1}</span> of{' '}
                <span data-cy="total-pages">{pageOptions.length}</span>
              </strong>{' '}
            </span>
            <Dropdown
              color={'gray'}
              label={t(pageSize === 9999 ? 'Show all' : `Show ${pageSize}`)}
              style={{ width: 120 }}
              size="sm"
              value={pageSize}
            >
              {[10, 50, 100, 9999].map((pageSize) => (
                <Dropdown.Item
                  key={pageSize}
                  onClick={() => {
                    setPageSize(Number(pageSize));
                  }}
                >
                  {pageSize === 9999 ? <Trans>Show all</Trans> : <Trans>Show {{ pageSize }}</Trans>}
                </Dropdown.Item>
              ))}
            </Dropdown>
          </div>
        )}
      </div>
    </div>
  );
}
