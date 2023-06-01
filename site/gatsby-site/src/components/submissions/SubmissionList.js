import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Badge, Button } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import ProgressCircle from 'elements/ProgessCircle';
import isEmpty from 'lodash/isEmpty';
import filter from 'lodash/filter';

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

  const getRowCompletionStatus = (row) => {
    const properties = Object.values(row.original);

    const nonEmptyCount = filter(properties, (value) => !isEmpty(value)).length;

    return Math.ceil((nonEmptyCount / properties.length) * 100);
  };

  const columns = React.useMemo(() => {
    const columns = [
      {
        className: 'min-w-[60px]',
        title: t('Completion'),
        accessor: 'completionStatus',
        disableFilters: true,
        Cell: ({ row }) => {
          const completionStatus = getRowCompletionStatus(row);

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
          const completionStatusA = getRowCompletionStatus(rowA);

          const completionStatusB = getRowCompletionStatus(rowB);

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
        accessor: 'assignee',
        Cell: () => {
          return (
            <div className="flex justify-center">
              <div
                className="!rounded-full w-10 h-10 relative overflow-hidden bg-blue-100 text-blue-800 dark:bg-gray-600 flex justify-center items-center"
                data-testid="flowbite-avatar-img"
              >
                KL
              </div>
            </div>
          );
        },
      },
      {
        title: t('Status'),
        accessor: 'status',
        Cell: () => {
          return (
            <div className="flex justify-center">
              <Badge color="success" className="mr-2">
                In Review
              </Badge>
            </div>
          );
        },
      },
    ];

    if (isRole('incident_editor')) {
      columns.push({
        title: t('Actions'),
        id: 'actions',
        className: 'min-w-[120px]',
        Cell: () => (
          <Button
            color={'gray'}
            data-cy="edit-incident"
            // onClick={() => setIncindentIdToEdit(values.incident_id)}
          >
            <Trans>Review</Trans>
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

  console.log(tableData);

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
