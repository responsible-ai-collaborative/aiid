import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Badge, Button, Select } from 'flowbite-react';
import { useUserContext } from 'contexts/userContext';
import {
  useBlockLayout,
  useFilters,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from 'react-table';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  SelectColumnFilter,
  SelectDatePickerFilter,
} from 'components/ui/Table';
import { STATUS } from 'utils/submissions';
import { useMutation } from '@apollo/client';
import { UPDATE_SUBMISSION } from '../../graphql/submissions';
import useToastContext, { SEVERITY } from 'hooks/useToast';

const SubmissionList = ({ data }) => {
  const { t } = useTranslation();

  const { isLoggedIn, isRole, user } = useUserContext();

  const [tableData, setTableData] = useState([]);

  const [claiming, setClaiming] = useState({ submissionId: null, value: false });

  const [reviewing, setReviewing] = useState({ submissionId: null, value: false });

  const [updateSubmission] = useMutation(UPDATE_SUBMISSION);

  const addToast = useToastContext();

  useEffect(() => {
    if (data) {
      setTableData(data.submissions);
    }
  }, [data]);

  const claimSubmission = async (submissionId) => {
    setClaiming({ submissionId, value: true });
    try {
      const submission = data.submissions.find((submission) => submission._id === submissionId);

      const incidentEditors = [...submission.incident_editors];

      const isAlreadyEditor = submission.incident_editors.find(
        (editor) => editor.userId === user.customData.userId
      );

      if (!isAlreadyEditor) {
        incidentEditors.push(user.customData.userId);

        await updateSubmission({
          variables: {
            query: {
              _id: submissionId,
            },
            set: { incident_editors: { link: incidentEditors } },
          },
        });
      }

      setClaiming({ submissionId: null, value: false });
    } catch (error) {
      addToast({
        message: t(`There was an error claiming this submission. Please try again.`),
        severity: SEVERITY.danger,
      });

      setClaiming({ submissionId: null, value: false });
    }
  };

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  function SelectEditorsColumnFilter({
    column: { filterValue = [], setFilter, preFilteredRows, id },
  }) {
    let options;

    options = React.useMemo(() => {
      let options = [];

      preFilteredRows.forEach((row) => {
        if (row.values[id]) {
          let editors = row.values[id]
            .filter((editor) => {
              return editor.first_name && editor.last_name;
            })
            .reduce((acc, editor) => {
              const name = `${editor.first_name} ${editor.last_name}`;

              if (!options.find((e) => e === name)) {
                acc.push(name);
              }
              return acc;
            }, []);

          options = options.concat(editors);
        }
      });
      return options;
    }, [id, preFilteredRows]);

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
        <option value="unassigned">Unassigned</option>
        {options.map((option, i) => (
          <option key={i} value={option}>
            {option}
          </option>
        ))}
      </Select>
    );
  }

  function SelectStatusFilter({ column: { filterValue = [], setFilter, preFilteredRows, id } }) {
    let options;

    options = React.useMemo(() => {
      const options = [];

      Object.values(STATUS).forEach((status) => {
        options.push(status);
      });
      return options;
    }, [id, preFilteredRows]);

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
        {options.map((option, i) => (
          <option key={i} value={option.name}>
            {option.text}
          </option>
        ))}
      </Select>
    );
  }

  const [dateFilter, setDateFilter] = useState('incident_date');

  const [dateValues, setDateValues] = useState([]);

  function SelectDatesColumnFilter({ column }) {
    return (
      <div className="flex flex-col">
        <Select
          className="mt-2 max-w-[190px]"
          value={dateFilter}
          onChange={(e) => {
            setDateFilter(e.target.value || undefined);
          }}
        >
          <option value="incident_date">Incident date</option>
          <option value="date_published">Date published</option>
          <option value="date_submitted">Date submitted</option>
        </Select>
        <div className="w-1/2 max-w-[190px]">
          {
            <SelectDatePickerFilter
              column={column}
              startDate={dateValues.length > 0 ? dateValues[0] : null}
              endDate={dateValues.length > 1 ? dateValues[1] : null}
              setDates={(vals) => {
                setDateValues(vals);
              }}
            />
          }
        </div>
      </div>
    );
  }

  const columns = React.useMemo(() => {
    const columns = [
      {
        className: 'min-w-[300px]',
        title: t('Title'),
        accessor: 'title',
        width: 300,
      },
      {
        className: 'min-w-[150px]',
        title: t('Submitters'),
        accessor: 'submitters',
        width: 150,
        Filter: SelectColumnFilter,
        Cell: ({ row: { values } }) => {
          return (
            <div className="flex justify-center flex-wrap gap-1">
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
        className: 'min-w-[220px]',
        width: 220,
        title: t('Dates'),
        accessor: 'incident_date',
        Filter: SelectDatesColumnFilter,
        sortType: (rowA, rowB) => {
          if (
            rowA.original[dateFilter] &&
            rowA.original[dateFilter] !== '' &&
            rowB.original[dateFilter] &&
            rowB.original[dateFilter] !== ''
          ) {
            const dateRowA = new Date(rowA.original[dateFilter]);

            const dateRowB = new Date(rowB.original[dateFilter]);

            if (dateRowA > dateRowB) {
              return 1;
            }

            if (dateRowA < dateRowB) {
              return -1;
            }

            return 0;
          }
        },
        filter: (rows, _field, value) =>
          rows.filter((row) => {
            let fields = [dateFilter];

            const matchingFields = fields.filter((field) => {
              const rowDate = Date.parse(row.original[field]);

              return value[0] <= rowDate && rowDate <= value[1];
            });

            return matchingFields.length > 0;
          }),
        Cell: ({ row }) => {
          const values = row.values;

          const dateSubmitted = row.original.date_submitted;

          const datePublished = row.original.date_published;

          return (
            <div className="flex justify-center flex-wrap gap-1">
              {values.incident_date && (
                <Badge key={`incident_date`} className="mr-2 w-fit">
                  {`Inc: ${values.incident_date}`}
                </Badge>
              )}
              {dateSubmitted && (
                <Badge key={`dateSubmitted`} className="mr-2 w-fit">
                  {`Sub: ${dateSubmitted}`}
                </Badge>
              )}
              {datePublished && (
                <Badge key={`datePublished`} className="mr-2 w-fit">
                  {`Pub: ${datePublished}`}
                </Badge>
              )}
            </div>
          );
        },
      },
      {
        title: t('Editors'),
        accessor: 'incident_editors',
        className: 'min-w-[150px]',
        width: 150,
        Filter: SelectEditorsColumnFilter,
        filter: (rows, [field], value) =>
          rows.filter((row) => {
            let rowValue = row.values[field];

            if (value === 'unassigned') return rowValue.length === 0;

            const results = rowValue.filter((editor) => {
              const fullName = `${editor.first_name} ${editor.last_name}`;

              return fullName.toLowerCase().includes(value.toLowerCase());
            });

            return results.length > 0;
          }),
        Cell: ({ row: { values } }) => {
          const editors = values.incident_editors;

          if (!editors || editors.length <= 0) return <></>;

          return (
            <div className="flex justify-center gap-1 flex-wrap">
              {editors.map((editor) => {
                const firstName = editor.first_name || '';

                const lastName = editor.last_name || '';

                const fullName = `${firstName} ${lastName}`;

                return (
                  <div className="flex justify-center" key={`editor-${firstName}-${lastName}`}>
                    <Badge className="mr-2 w-fit">{fullName}</Badge>
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
        width: 200,
        Filter: SelectStatusFilter,
        filter: (rows, [field], value) =>
          rows.filter((row) => {
            let rowValue = row.values[field];

            if (!rowValue) {
              rowValue = STATUS.pendingReview.name;
            }
            return rowValue === value;
          }),
        Cell: ({ row: { values } }) => {
          let color =
            STATUS[values.status]?.color ||
            'bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900';

          return (
            <div className="flex justify-center">
              <Badge className={`mr-2 ${color}`}>
                <Trans>{STATUS[values.status]?.text || STATUS.pendingReview.text}</Trans>
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
        className: 'min-w-[200px]',
        width: 'auto',
        disableFilters: true,
        disableSortBy: true,
        disableResizing: true,
        Cell: ({ row: { values } }) => (
          <div className="flex gap-2">
            <Button
              color={'gray'}
              data-cy="review-submission"
              onClick={async (event) => {
                event.preventDefault();
                await setSubmissionStatus(values);
                window.location.href = `?editSubmission=${values._id}`;
              }}
              disabled={reviewing.value}
            >
              {reviewing.value && values._id === reviewing.submissionId ? (
                <Trans>Reviewing...</Trans>
              ) : (
                <Trans>Review</Trans>
              )}
            </Button>
            {!values.editor && (
              <Button
                color={'gray'}
                data-cy="claim-submission"
                onClick={() => claimSubmission(values._id)}
                disabled={claiming.value}
              >
                {claiming.value && values._id === claiming.submissionId ? (
                  <Trans>Claiming...</Trans>
                ) : (
                  <Trans>Claim</Trans>
                )}
              </Button>
            )}
          </div>
        ),
      });
    }

    return columns;
  }, [isLoggedIn, claiming, reviewing, dateFilter]);

  const table = useTable(
    {
      columns,
      data: tableData,
      defaultColumn,
    },
    useFilters,
    useSortBy,
    usePagination,
    useBlockLayout,
    useResizeColumns
  );

  const setSubmissionStatus = async (submission) => {
    if (submission.status !== STATUS.inReview.name) {
      setReviewing({ submissionId: submission._id, value: true });
      try {
        await updateSubmission({
          variables: {
            query: {
              _id: submission._id,
            },
            set: { status: STATUS.inReview.name },
          },
        });
        setReviewing({ submissionId: submission._id, value: false });
      } catch (error) {
        addToast({
          message: t(`There was an error updating this submission. Please try again.`),
          severity: SEVERITY.danger,
        });
        setReviewing({ submissionId: submission._id, value: false });
      }
    }
  };

  return (
    <div className="">
      <Table
        table={table}
        data-cy="submissions"
        className="mb-5 w-fit"
        tableClassName="rounded-lg border"
      />
    </div>
  );
};

export default SubmissionList;
