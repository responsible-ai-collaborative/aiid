import { useUserContext } from 'contexts/userContext';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { format, getUnixTime } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client';
import { useBlockLayout, useFilters, usePagination, useResizeColumns, useTable } from 'react-table';
import VariantEditModal from './VariantEditModal';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';
import { VariantStatusBadge } from './VariantList';
import { VARIANT_STATUS } from 'utils/variants';
import { DELETE_VARIANT, UPDATE_VARIANT } from '../../graphql/variants';
import { LINK_REPORTS_TO_INCIDENTS } from '../../graphql/reports';
import { Button, Dropdown, Pagination, TextInput } from 'flowbite-react';

function DefaultColumnFilter({
  column: { Header, canFilter, filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  const { t } = useTranslation(['translation', 'variants']);

  if (!canFilter) {
    return <h6>{Header}</h6>;
  }

  return (
    <div>
      <h6>{Header}</h6>
      <TextInput
        data-cy={`input-filter-${Header}`}
        className="w-100 font-normal"
        type="text"
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={t(`Search {{count}} records...`, { count })}
      />
    </div>
  );
}

export default function VariantsTable({ data, refetch, setLoading }) {
  const { isLoggedIn, isRole } = useUserContext();

  const { t } = useTranslation(['variants']);

  const addToast = useToastContext();

  const [variantIdToEdit, setVariantIdToEdit] = useState(0);

  const [incidentId, setIncidentId] = useState(0);

  const [currentPage, setCurrentPage] = useState(1);

  const [deleteVariant] = useMutation(DELETE_VARIANT);

  const [linkReportsToIncidents] = useMutation(LINK_REPORTS_TO_INCIDENTS);

  const [updateVariant] = useMutation(UPDATE_VARIANT);

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 220,
      maxWidth: 640,
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const handleDelete = async ({ report_number }) => {
    if (confirm(t('Do you want to delete this variant?'))) {
      try {
        setLoading(true);

        await deleteVariant({
          variables: {
            query: {
              report_number,
            },
          },
        });

        await linkReportsToIncidents({
          variables: {
            input: {
              incident_ids: [],
              report_numbers: [report_number],
            },
          },
        });

        addToast({
          message: t('Variant successfully deleted. Your changes will be live within 24 hours.'),
          severity: SEVERITY.success,
        });

        await refetch();
      } catch (e) {
        addToast({
          message: (
            <label className="capitalize">{t(e.error || 'An unknown error has ocurred')}</label>
          ),
          severity: SEVERITY.danger,
          error: e,
        });
      }
    }
  };

  const handleSubmit = async ({ report_number, tags, status }) => {
    try {
      setLoading(true);

      let newTags = tags.filter((tag) => !tag.startsWith('variant:'));

      newTags.push(status);

      const updated = {
        tags: newTags,
      };

      updated.date_modified = format(new Date(), 'yyyy-MM-dd');
      updated.epoch_date_modified = getUnixTime(new Date(updated.date_modified));

      await updateVariant({
        variables: {
          query: {
            report_number,
          },
          set: {
            ...updated,
          },
        },
      });

      addToast({
        message: t('Variant successfully updated. Your edits will be live within 24 hours.'),
        severity: SEVERITY.success,
      });

      await refetch();
    } catch (e) {
      addToast({
        message: (
          <label className="capitalize">{t(e.error || 'An unknown error has ocurred')}</label>
        ),
        severity: SEVERITY.danger,
        error: e,
      });
    }
  };

  const columns = React.useMemo(() => {
    const columns = [
      {
        Header: t('Incident ID'),
        accessor: 'incident_id',
        width: 150,
        Cell: ({ row: { values } }) => (
          <a className="flex" href={`/cite/${values.incident_id}`}>
            Incident {values.incident_id}
          </a>
        ),
      },
      {
        Header: t('Incident Title'),
        accessor: 'title',
      },
      {
        Header: 'Tags',
        accessor: 'tags',
        show: false,
      },
      {
        Header: t('Status'),
        accessor: 'status',
        width: 150,
        Cell: ({ row: { values } }) => (
          <div className="flex justify-center">
            <VariantStatusBadge status={values.status} />
          </div>
        ),
      },
      {
        Header: t('Description of Incident Circumstances'),
        accessor: 'text',
        width: 450,
        disableFilters: false,
        Cell: ({ row: { values } }) => (
          <div>
            <Markdown className="variants-markdown">{values.text}</Markdown>
          </div>
        ),
      },
      {
        Header: t('Inputs / Outputs'),
        accessor: 'inputs_outputs',
        width: 450,
        disableFilters: false,
        Cell: ({ row: { values } }) => (
          <div className="flex flex-col gap-2 w-full">
            {values.inputs_outputs?.map((input_output, index) => (
              <div
                className={`border-1 rounded-lg px-3 ${index % 2 == 1 ? 'bg-gray-200' : ''}`}
                key={`inputs_outputs.${index}`}
                data-cy="variant-inputs-outputs"
              >
                <Markdown>{input_output}</Markdown>
              </div>
            ))}
          </div>
        ),
      },
    ];

    if (isRole('incident_editor')) {
      // @ts-ignore
      columns.push({
        Header: t('Actions'),
        accessor: 'report_number',
        disableFilters: true,
        width: 400,
        Cell: ({ row: { values } }) => (
          <div className="flex gap-2 items-center">
            <Button
              color="failure"
              onClick={() => handleDelete({ report_number: values.report_number })}
              data-cy="delete-variant-btn"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>

            <Button
              color="failure"
              onClick={() =>
                handleSubmit({
                  report_number: values.report_number,
                  tags: values.tags,
                  status: VARIANT_STATUS.rejected,
                })
              }
              className="flex gap-2 disabled:opacity-50"
              data-cy="reject-variant-btn"
            >
              <Trans ns="variants">Reject</Trans>
            </Button>
            <Button
              onClick={() =>
                handleSubmit({
                  report_number: values.report_number,
                  tags: values.tags,
                  status: VARIANT_STATUS.approved,
                })
              }
              className="flex gap-2 disabled:opacity-50"
              data-cy="approve-variant-btn"
            >
              <Trans ns="variants">Approve</Trans>
            </Button>
            <Button
              data-cy="edit-variant-btn"
              onClick={() => {
                setVariantIdToEdit(values.report_number);
                setIncidentId(values.incident_id);
              }}
            >
              <FontAwesomeIcon icon={faEdit} />
            </Button>
          </div>
        ),
      });
    }

    return columns;
  }, [isLoggedIn]);

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
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      initialState: {
        filters: [
          {
            id: 'status',
            value: 'Unreviewed',
          },
        ],
        hiddenColumns: ['tags'],
      },
    },
    useFilters,
    useBlockLayout,
    useResizeColumns,
    usePagination
  );

  return (
    <>
      {/* eslint-disable react/jsx-key */}

      <table
        {...getTableProps()}
        className="w-full text-sm text-left text-gray-500 dark:text-gray-400 border-none overflow-hidden h-[1px]"
      >
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          {headerGroups.map((headerGroup) => (
            <tr key={`thead-tr-${headerGroup.id}`} {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps()}
                  className={`${column.width} py-3 px-4 border-none`}
                  data-cy={`header-${column.id}`}
                  key={`th-${column.id}`}
                >
                  {column.render('Filter')}
                  <div
                    {...column.getResizerProps()}
                    className="inline-block w-2 h-full absolute translate-x-1/2 right-0 top-0 z-2 touch-none"
                  ></div>
                </th>
              ))}
            </tr>
          ))}
        </thead>

        <tbody {...getTableBodyProps()}>
          {page.map((row, i) => {
            prepareRow(row);
            return (
              <tr
                {...row.getRowProps()}
                className={`text-gray-900 border-b dark:bg-gray-800 dark:border-gray-700") + ${
                  i % 2 == 0
                    ? 'bg-white dark:bg-gray-900 dark:border-gray-700'
                    : 'bg-gray-50 dark:bg-gray-800 dark:border-gray-700'
                }`}
                data-cy="row"
              >
                {row.cells.map((cell) => {
                  return (
                    <td
                      {...cell.getCellProps()}
                      className={`${cell.column.width} py-2 px-4 border-none align-top h-full flex`}
                      data-cy="cell"
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

      <div className="flex gap-2 justify-start items-center mt-3">
        <Pagination
          className="pagination mb-0"
          onPageChange={(page) => {
            gotoPage(page - 1);
            setCurrentPage(page);
          }}
          currentPage={currentPage}
          showIcons={true}
          totalPages={pageCount}
        />

        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
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
                setCurrentPage(1);
              }}
            >
              {pageSize === 9999 ? <Trans>Show all</Trans> : <Trans>Show {{ pageSize }}</Trans>}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      <VariantEditModal
        show={variantIdToEdit !== 0}
        onClose={() => setVariantIdToEdit(0)}
        reportNumber={variantIdToEdit}
        refetch={refetch}
        incidentId={incidentId}
      />
    </>
  );
}
