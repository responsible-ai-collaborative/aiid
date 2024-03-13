import { useUserContext } from 'contexts/userContext';
import React, { useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { useTranslation } from 'react-i18next';
import { Button, ToggleSwitch } from 'flowbite-react';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  SelectColumnFilter,
  SelectDatePickerFilter,
} from 'components/ui/Table';
import ReportEditModal from './ReportEditModal';
import { format } from 'date-fns';

export default function ReportsTable({ data, isLiveData, setIsLiveData }) {
  const [reportNumberToEdit, setReportNumberToEdit] = useState(0);

  const { isLoggedIn, isRole } = useUserContext();

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
        Cell: ({ row: { values } }) => (
          <a className="flex" href={`/reports/${values.report_number}`}>
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
        className: 'min-w-[340px]',
        title: t('Description'),
        accessor: 'description',
      },
      {
        title: t('Date Submitted'),
        accessor: 'date_submitted',
        Cell: ({ value }) => format(new Date(value), 'yyyy-MM-dd'),
        Filter: SelectDatePickerFilter,
      },
      {
        title: t('Date Published'),
        accessor: 'date_published',
        Cell: ({ value }) => format(new Date(value), 'yyyy-MM-dd'),
        Filter: SelectDatePickerFilter,
      },
      {
        title: t('Date Modified'),
        accessor: 'date_modified',
        Cell: ({ value }) => format(new Date(value), 'yyyy-MM-dd'),
        Filter: SelectDatePickerFilter,
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
              color={'gray'}
              data-cy="edit-incident"
              variant="link"
              onClick={() => setReportNumberToEdit(values.report_number)}
            >
              Edit
            </Button>
          ),
        }
      );
    }

    return columns;
  }, [isLoggedIn]);

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

  return (
    <>
      <div className="flex justify-start ml-4 mb-2 pt-1">
        <ToggleSwitch
          checked={isLiveData}
          label={t('Show Live data')}
          onChange={(checked) => {
            setIsLiveData(checked);
          }}
          name="live-data-switch"
        />
      </div>

      <Table table={table} />
      {reportNumberToEdit !== 0 && (
        <ReportEditModal
          show={true}
          onClose={() => setReportNumberToEdit(0)}
          report_number={reportNumberToEdit}
        />
      )}
    </>
  );
}
