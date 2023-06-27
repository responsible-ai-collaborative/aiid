import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Badge, Button } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import ProgressCircle from 'elements/ProgessCircle';
import { STATUS, getRowCompletionStatus } from 'utils/submissions';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';

const SubmissionList = ({ data }) => {
  const { t } = useTranslation();

  const { isLoggedIn, isRole } = useUserContext();

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data) {
      setTableData(data.submissions);
    }
  }, [data]);

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
        className: 'min-w-[60px]',
        title: t('Completion'),
        accessor: 'completionStatus',
        disableFilters: true,
        Cell: ({ row }) => {
          const completionStatus = getRowCompletionStatus(Object.values(row.original));

          return (
            <div className="flex items-center justify-center">
              <ProgressCircle
                percentage={completionStatus}
                color={completionStatus > 60 ? '#22c55e' : completionStatus > 0 ? '#eab308' : null}
              />
            </div>
          );
        },
        sortType: (rowA, rowB) => {
          const completionStatusA = getRowCompletionStatus(Object.values(rowA.original));

          const completionStatusB = getRowCompletionStatus(Object.values(rowB.original));

          return completionStatusA - completionStatusB;
        },
      },
      {
        className: 'min-w-[120px]',
        title: t('Title'),
        accessor: 'title',
      },
      {
        className: 'min-w-[240px]',
        title: t('Submitters'),
        accessor: 'submitters',
        Cell: ({ row: { values } }) => {
          return (
            <div className="flex justify-center">
              {values.submitters.map((submitter, index) => {
                return (
                  <Badge key={`submitter-${index}`} className="w-fit">
                    {submitter}
                  </Badge>
                );
              })}
            </div>
          );
        },
      },
      {
        className: 'min-w-[120px]',
        title: t('Incident Date'),
        accessor: 'incident_date',
        Cell: ({ row: { values } }) => {
          return (
            <div className="flex justify-center">
              {values.incident_date && (
                <Badge key={`incident_date`} className="mr-2 w-fit">
                  {values.incident_date}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        title: t('Assignee'),
        accessor: 'editor',
        Cell: ({ row: { values } }) => {
          const editor = values.editor;

          if (!editor) return <></>;

          const firstName = editor.first_name || '';

          const lastName = editor.last_name || '';

          console.log('editor', editor);

          const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

          return (
            <div className="flex justify-center">
              <div
                className="!rounded-full w-10 h-10 relative overflow-hidden bg-blue-100 text-blue-800 dark:bg-gray-600 flex justify-center items-center"
                data-testid="flowbite-avatar-img"
              >
                {initials}
              </div>
            </div>
          );
        },
      },
      {
        title: t('Status'),
        className: 'min-w-[200px]',
        accessor: 'status',
        filter: (rows, [field], value) =>
          rows.filter((row) => {
            let rowValue = row.values[field];

            if (!rowValue) {
              rowValue = 'pending review';
            }
            return rowValue.toString().toLowerCase().includes(value.toLowerCase());
          }),
        Cell: ({ row: { values } }) => {
          let color = STATUS[values.status]?.color || 'warning';

          return (
            <div className="flex justify-center">
              <Badge color={color} className="mr-2">
                <Trans>{STATUS[values.status]?.text || 'Pending Review'}</Trans>
              </Badge>
            </div>
          );
        },
      },
    ];

    if (isRole('incident_editor')) {
      columns.push({
        title: t('Actions'),
        accessor: '_id',
        className: 'min-w-[120px]',
        disableFilters: true,
        disableSortBy: true,
        Cell: ({ row: { values } }) => (
          <Button color={'gray'} data-cy="review-submission">
            <LocalizedLink to={`?editSubmission=${values._id}`}>
              <Trans>Review</Trans>
            </LocalizedLink>
          </Button>
        ),
      });
    }

    return columns;
  }, [isLoggedIn]);

  const table = useTable(
    {
      columns,
      data: tableData,
      defaultColumn,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    // <ListGroup className="mb-5" data-cy="submissions">
    //   {data?.submissions
    //     .map((submission) => ({ ...submission, __typename: undefined }))
    //     .sort(
    //       (a, b) => new Date(a.date_submitted).getTime() - new Date(b.date_submitted).getTime()
    //     )
    //     .map((submission) => (
    //       <div
    //         key={submission._id}
    //         className="m-0 py-3 border-b last:border-none"
    //         data-cy="submission"
    //       >
    //         <SubmissionReview submission={submission} />
    //       </div>
    //     ))}
    // </ListGroup>
    <div className="rounded-lg border">
      <Table table={table} data-cy="submissions" className="mb-5" />
    </div>
  );
};

export default SubmissionList;
