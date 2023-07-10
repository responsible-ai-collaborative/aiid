import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Badge, Button } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';
import ProgressCircle from 'elements/ProgessCircle';
import { STATUS, getRowCompletionStatus } from 'utils/submissions';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useMutation } from '@apollo/client';
import { UPDATE_SUBMISSION } from '../../graphql/submissions';
import useToastContext, { SEVERITY } from 'hooks/useToast';

const SubmissionList = ({ data }) => {
  const { t } = useTranslation();

  const { isLoggedIn, isRole, user } = useUserContext();

  const [tableData, setTableData] = useState([]);

  const [claiming, setClaiming] = useState(false);

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const addToast = useToastContext();

  useEffect(() => {
    if (data) {
      setTableData(data.submissions);
    }
  }, [data]);

  const claimSubmission = async (submissionId) => {
    setClaiming(true);
    try {
      await updateSubmission({
        variables: {
          query: {
            _id: submissionId,
          },
          set: { editor: { link: user.id } },
        },
      });

      setClaiming(false);
    } catch (error) {
      addToast({
        message: t(`There was an error claiming this submission. Please try again.`),
        severity: SEVERITY.danger,
      });

      setClaiming(false);
    }
  };

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
        title: t('Editors'),
        accessor: 'incident_editors',
        Cell: ({ row: { values } }) => {
          const editors = values.incident_editors;

          if (!editors || editors.length <= 0) return <></>;

          return (
            <div className="flex justify-center gap-1">
              {editors.map((editor) => {
                const firstName = editor.first_name || '';

                const lastName = editor.last_name || '';

                const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`;

                return (
                  <div
                    className="!rounded-full w-10 h-10 relative overflow-hidden bg-blue-100 text-blue-800 dark:bg-gray-600 flex justify-center items-center"
                    data-testid="flowbite-avatar-img"
                    key={`editor-${editor.userId}`}
                  >
                    {initials}
                  </div>
                );
              })}
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
          <div className="flex gap-2">
            <Button color={'gray'} data-cy="review-submission">
              <LocalizedLink to={`?editSubmission=${values._id}`}>
                <Trans>Review</Trans>
              </LocalizedLink>
            </Button>
            {!values.editor && (
              <Button
                color={'gray'}
                data-cy="claim-submission"
                onClick={() => claimSubmission(values._id)}
                disabled={claiming}
              >
                {claiming ? <Trans>Claiming...</Trans> : <Trans>Claim</Trans>}
              </Button>
            )}
          </div>
        ),
      });
    }

    return columns;
  }, [isLoggedIn, claiming]);

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
    <div className="rounded-lg border">
      <Table table={table} data-cy="submissions" className="mb-5" />
    </div>
  );
};

export default SubmissionList;
