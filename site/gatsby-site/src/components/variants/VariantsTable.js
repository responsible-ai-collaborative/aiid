import { useUserContext } from 'contexts/userContext';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { Button, Form, Pagination } from 'react-bootstrap';
import { format, getUnixTime } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client';
import { useBlockLayout, useFilters, usePagination, useResizeColumns, useTable } from 'react-table';
import VariantEditModal from './VariantEditModal';
import styled from 'styled-components';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';
import { VariantStatusBadge } from './VariantList';
import { getVariantStatus, VARIANT_STATUS } from 'utils/variants';
import { DELETE_VARIANT, UPDATE_VARIANT } from '../../graphql/variants';
import { LINK_REPORTS_TO_INCIDENTS } from '../../graphql/reports';

const Table = styled.div`
  display: inline-block;
  border-spacing: 0;

  .tr {
    &:nth-child(even) {
      background-color: #f2f2f2;
    }
    :last-child {
      .td {
        border-bottom: 0;
      }
    }
  }

  .th,
  .td {
    margin: 0;
    padding: 0.5rem;
    position: relative;

    :last-child {
      border-right: 0;
    }
  }
`;

const Header = styled.div`
  background: #fff;
  position: sticky;
  z-index: 1;
  width: fit-content;
  top: 0;
  box-shadow: 0px 3px 3px #ccc;
`;

const HeaderText = styled.h6`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ResizeHandle = styled.div`
  display: inline-block;
  background: ${({ isResizing }) => (isResizing ? 'var(--bs-primary)' : 'var(--bs-secondary)')};
  width: 6px;
  height: 100%;
  position: absolute;
  right: 0;
  top: 0;
  transform: translateX(50%);
  z-index: 1;
  touch-action: none;
`;

function DefaultColumnFilter({
  column: { Header, canFilter, filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  const { t } = useTranslation();

  if (!canFilter) {
    return <HeaderText>{Header}</HeaderText>;
  }

  return (
    <div className="bootstrap">
      <HeaderText>{Header}</HeaderText>
      <Form.Control
        data-cy={`input-filter-${Header}`}
        className="w-100"
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

  const { t } = useTranslation();

  const addToast = useToastContext();

  const [variantIdToEdit, setVariantIdToEdit] = useState(0);

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
          message: t('Variant successfully deleted.'),
          severity: SEVERITY.success,
        });

        await refetch();
      } catch (e) {
        addToast({
          message: (
            <label className="capitalize">{t(e.error || 'An unknown error has ocurred')}</label>
          ),
          severity: SEVERITY.danger,
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
        message: t('Variant successfully updated.'),
        severity: SEVERITY.success,
      });

      await refetch();
    } catch (e) {
      addToast({
        message: (
          <label className="capitalize">{t(e.error || 'An unknown error has ocurred')}</label>
        ),
        severity: SEVERITY.danger,
      });
    }
  };

  const columns = React.useMemo(() => {
    const columns = [
      {
        Header: 'Incident ID',
        accessor: 'incident_id',
        width: 150,
        Cell: ({ row: { values } }) => (
          <a className="flex" href={`/cite/${values.incident_id}`}>
            Incident {values.incident_id}
          </a>
        ),
      },
      {
        Header: <Trans>Incident Title</Trans>,
        accessor: 'title',
      },
      {
        Header: 'Status',
        accessor: 'tags',
        width: 150,
        Cell: ({ row: { values } }) => (
          <div className="flex justify-center">
            <VariantStatusBadge status={getVariantStatus(values)} />
          </div>
        ),
      },
      {
        Header: 'Input and circumstances',
        accessor: 'text_inputs',
        disableFilters: false,
        Cell: ({ row: { values } }) => <Markdown>{values.text_inputs}</Markdown>,
      },
      {
        Header: 'Output and outcomes',
        accessor: 'text_outputs',
        disableFilters: false,
        Cell: ({ row: { values } }) => <Markdown>{values.text_outputs}</Markdown>,
      },
    ];

    if (isRole('incident_editor')) {
      // @ts-ignore
      columns.push({
        Header: 'Actions',
        accessor: 'report_number',
        disableFilters: true,
        width: 300,
        Cell: ({ row: { values } }) => (
          <div className="flex gap-2 bootstrap">
            <Button
              variant="danger"
              onClick={() => handleDelete({ report_number: values.report_number })}
              data-cy="delete-variant-btn"
            >
              <FontAwesomeIcon icon={faTrash} />
            </Button>

            <Button
              variant="danger"
              onClick={() =>
                handleSubmit({
                  report_number: values.report_number,
                  tags: values.tags,
                  status: VARIANT_STATUS.rejected,
                })
              }
              className="bootstrap flex gap-2 disabled:opacity-50"
              data-cy="reject-variant-btn"
            >
              <Trans>Reject</Trans>
            </Button>
            <Button
              variant="primary"
              onClick={() =>
                handleSubmit({
                  report_number: values.report_number,
                  tags: values.tags,
                  status: VARIANT_STATUS.approved,
                })
              }
              className="bootstrap flex gap-2 disabled:opacity-50"
              data-cy="approve-variant-btn"
            >
              <Trans>Approve</Trans>
            </Button>
            <Button
              data-cy="edit-variant"
              variant="primary"
              onClick={() => setVariantIdToEdit(values.report_number)}
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
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
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
            id: 'tags',
            value: 'Unreviewed',
          },
        ],
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

      <Table {...getTableProps()}>
        <Header>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <div
                  {...column.getHeaderProps()}
                  className="td border-bottom border-right px-3 py-2"
                >
                  {column.render('Filter')}
                  <ResizeHandle {...column.getResizerProps()} isResizing={column.isResizing} />
                </div>
              ))}
            </div>
          ))}
        </Header>

        <div {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr" data-cy="row">
                {row.cells.map((cell) => {
                  return (
                    <div
                      {...cell.getCellProps()}
                      className="td border-end border-bottom"
                      data-cy="cell"
                    >
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Table>

      <div className="flex gap-2 justify-start items-center mt-3 bootstrap">
        <Pagination className="mb-0">
          <Pagination.First onClick={() => gotoPage(0)} disabled={!canPreviousPage} />
          <Pagination.Prev onClick={() => previousPage()} disabled={!canPreviousPage} />

          <Pagination.Next onClick={() => nextPage()} disabled={!canNextPage} />
          <Pagination.Last onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage} />
        </Pagination>

        <span>
          Page{' '}
          <strong>
            {pageIndex + 1} of {pageOptions.length}
          </strong>{' '}
        </span>

        <Form.Select
          style={{ width: 120 }}
          size="sm"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
        >
          {[10, 50, 100, 'all'].map((pageSize) => (
            <option key={pageSize} value={pageSize == 'all' ? 99999 : pageSize}>
              Show {pageSize}
            </option>
          ))}
        </Form.Select>
      </div>

      <VariantEditModal
        show={variantIdToEdit !== 0}
        onClose={() => setVariantIdToEdit(0)}
        reportNumber={variantIdToEdit}
        refetch={refetch}
      />
    </>
  );
}
