import { useUserContext } from 'contexts/userContext';
import React, { useState } from 'react';
import { Button, Form, Pagination } from 'react-bootstrap';
import { useBlockLayout, usePagination, useResizeColumns, useTable } from 'react-table';
import IncidentEditModal from './IncidentEditModal';
import styled from 'styled-components';

const Styles = styled.div`
  padding: 1rem;

  .react-table {
    display: inline-block;
    border-spacing: 0;
    border: 1px solid black;

    .tr {
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
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      position: relative;

      :last-child {
        border-right: 0;
      }

      .resizer {
        display: inline-block;
        background: blue;
        width: 10px;
        height: 100%;
        position: absolute;
        right: 0;
        top: 0;
        transform: translateX(50%);
        z-index: 1;
        touch-action: none;

        &.isResizing {
          background: red;
        }
      }
    }
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: start;
  align-items: center;
  gap: 12px;
  .pagination {
    margin-bottom: 0;
  }
  select {
    width: 120px;
  }
`;

export default function IncidentsTable({ data }) {
  const [incidentIdToEdit, setIncindentIdToEdit] = useState(0);

  const { isAdmin } = useUserContext();

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
    }),
    []
  );

  const columns = React.useMemo(
    () => [
      {
        Header: 'Incident ID',
        accessor: 'incident_id',
      },
      {
        Header: 'Title',
        accessor: 'title',
      },
      {
        Header: 'Description',
        accessor: 'description',
      },
      {
        Header: 'date',
        accessor: 'date',
      },
      {
        Header: 'Alleged Deployer of AI System',
        accessor: 'AllegedDeployerOfAISystem',
      },
      {
        Header: 'Alleged Developer of AISystem',
        accessor: 'Alleged Developer of AISystem',
      },
      {
        Header: 'Alleged Harmed or Nearly Harmed Parties',
        accessor: 'AllegedHarmedOrNearlyHarmedParties',
      },
      {
        Header: 'Actions',
        Cell: ({ row: { values } }) => (
          <>
            {isAdmin && (
              <Button
                data-cy="edit-incident"
                variant="link"
                disabled={!isAdmin}
                onClick={() => setIncindentIdToEdit(values.incident_id)}
              >
                Edit
              </Button>
            )}
          </>
        ),
      },
    ],
    [isAdmin]
  );

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
    },
    useBlockLayout,
    useResizeColumns,
    usePagination
  );

  return (
    <>
      <Styles>
        {/* eslint-disable react/jsx-key */}

        <div {...getTableProps()} className="react-table">
          <div>
            {headerGroups.map((headerGroup) => (
              <div {...headerGroup.getHeaderGroupProps()} className="tr">
                {headerGroup.headers.map((column) => (
                  <div {...column.getHeaderProps()} className="th">
                    {column.render('Header')}
                    <div
                      {...column.getResizerProps()}
                      className={`resizer ${column.isResizing ? 'isResizing' : ''}`}
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>

          <div {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <div {...row.getRowProps()} className="tr">
                  {row.cells.map((cell) => {
                    return (
                      <div {...cell.getCellProps()} className="td">
                        {cell.render('Cell')}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </Styles>

      <PaginationWrapper>
        <Pagination>
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
      </PaginationWrapper>

      <IncidentEditModal
        show={incidentIdToEdit !== 0}
        onClose={() => setIncindentIdToEdit(0)}
        incidentId={incidentIdToEdit}
      />
    </>
  );
}
