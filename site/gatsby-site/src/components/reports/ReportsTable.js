import { useUserContext } from 'contexts/UserContext';
import React from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { Trans, useTranslation } from 'react-i18next';
import { Button, ToggleSwitch } from 'flowbite-react';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  SelectColumnFilter,
  SelectDatePickerFilter,
  filterDate,
  formatDateField,
  sortDateField,
} from 'components/ui/Table';

export default function ReportsTable({ data, isLiveData, setIsLiveData }) {
  const { loading, isRole } = useUserContext();

  const { t } = useTranslation();

  const defaultColumn = React.useMemo(
    () => ({
      className: 'min-w-[120px]',
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const columns = React.useMemo(() => {
    const columns = [
      {
        title: t('Report Number'),
        accessor: 'report_number',
        Cell: ({ row: { values, original } }) => (
          <a
            className="flex"
            href={
              original.incident_id
                ? `/cite/${original.incident_id}#r${values.report_number}`
                : `/reports/${values.report_number}`
            }
          >
            Report {values.report_number}
          </a>
        ),
      },
      {
        className: 'min-w-[340px]',
        title: t('Title'),
        accessor: 'title',
      },
      {
        title: t('Date Submitted'),
        accessor: 'date_submitted',
        Cell: ({ value }) => formatDateField(value),
        Filter: SelectDatePickerFilter,
        sortType: (rowA, rowB) => {
          return sortDateField(rowA, rowB, 'date_submitted');
        },
        filter: (rows, id, filterValue) => filterDate(rows, id, filterValue),
      },
      {
        title: t('Date Published'),
        accessor: 'date_published',
        Cell: ({ value }) => formatDateField(value),
        Filter: SelectDatePickerFilter,
        sortType: (rowA, rowB) => {
          return sortDateField(rowA, rowB, 'date_published');
        },
        filter: (rows, id, filterValue) => filterDate(rows, id, filterValue),
      },
      {
        title: t('Date Modified'),
        accessor: 'date_modified',
        Cell: ({ value }) => formatDateField(value),
        Filter: SelectDatePickerFilter,
        sortType: (rowA, rowB) => {
          return sortDateField(rowA, rowB, 'date_modified');
        },
        filter: (rows, id, filterValue) => filterDate(rows, id, filterValue),
      },
      {
        title: t('Language'),
        accessor: 'language',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Submitters'),
        accessor: 'submitters',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Authors'),
        id: 'authors',
        accessor: 'authors',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Tags'),
        id: 'tags',
        accessor: 'tags',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Flagged'),
        accessor: 'flag',
        Filter: SelectColumnFilter,
        Cell: ({ row: { values } }) => {
          return <>{values.flag}</>;
        },
      },
      {
        title: t('Is Issue Report?'),
        accessor: 'is_incident_report',
        Filter: SelectColumnFilter,
        Cell: ({ row: { values } }) => {
          return <>{values.is_incident_report}</>;
        },
      },
    ];

    if (isRole('incident_editor')) {
      columns.push(
        {
          title: t('Editor Notes'), //TODO: only show if user is editor
          accessor: 'editor_notes',
        },
        {
          title: t('Actions'),
          id: 'actions',
          className: 'min-w-[120px]',
          Cell: ({ row: { values } }) => (
            <Button
              data-cy="edit-report"
              color="gray"
              href={`/cite/edit?report_number=${values.report_number}`}
              className="hover:no-underline "
            >
              <Trans>Edit</Trans>
            </Button>
          ),
        }
      );
    }

    return columns;
  }, [loading]);

  const table = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const pageLength = table.page.length;

  const allResultsCount = data.length;

  return (
    <>
      <div className="flex items-center mb-2">
        <div className="flex justify-start ml-4 mb-2 pt-1 mr-2">
          <ToggleSwitch
            checked={isLiveData}
            label={t('Show Live data')}
            onChange={(checked) => {
              setIsLiveData(checked);
            }}
            name="live-data-switch"
          />
        </div>
        <Button color="light" onClick={() => table.setAllFilters([])}>
          Reset filters
        </Button>
      </div>
      <p>
        <Trans>
          Displaying {{ pageLength }} of {{ allResultsCount }} reports
        </Trans>
      </p>
      <Table table={table} />
    </>
  );
}
