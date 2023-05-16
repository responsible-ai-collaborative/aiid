import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Badge, Button } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import ProgressCircle from 'elements/ProgessCircle';

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
        title: '',
        accessor: 'completionStatus',
        disableFilters: true,
        disableSortBy: true,
        Cell: () => (
          <div className="flex items-center justify-center">
            <ProgressCircle percentage={70} />
          </div>
        ),
      },
      {
        className: 'min-w-[120px]',
        title: t('Title'),
        accessor: 'title',
      },
      {
        className: 'min-w-[240px]',
        title: t('Authors'),
        accessor: 'authors',
        // Cell: ({ row: { values } }) => {
        //   return <div className="flex justify-center">
        //     {values.authors.map((author, index) => {
        //       return <Badge key={`author-${index}`} className="mr-2">{author}</Badge>
        //     })}
        //   </div>
        // },

        Cell: ({ row: { values } }) => {
          return (
            <div className="">
              {values.authors.map((author, index) => {
                // return <Badge key={`author-${index}`} className="">{author}</Badge>
                return (
                  <Badge key={`author-${index}`} className="w-fit">
                    {author}
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
            // <div className="flex justify-center">
            <Badge key={`incident_date`} className="mr-2 w-fit">
              {values.incident_date}
            </Badge>
            // </div>
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
    <Table table={table} data-cy="submissions" className="mb-5" />
  );
};

export default SubmissionList;
