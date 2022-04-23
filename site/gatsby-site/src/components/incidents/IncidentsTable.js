import { useUserContext } from 'contexts/userContext';
import React, { useState } from 'react';
import { Button, Form, OverlayTrigger, Pagination, Popover } from 'react-bootstrap';
import { useBlockLayout, useFilters, usePagination, useResizeColumns, useTable } from 'react-table';
import IncidentEditModal from './IncidentEditModal';
import styled from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';

const Table = styled.div`
  display: inline-block;
  border-spacing: 0;

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
    position: relative;

    :last-child {
      border-right: 0;
    }
  }
`;

const FilterButton = styled.button`
  border: none;
  background: transparent;
  font-size: 12px;
  margin: 0 6px;
  color: ${({ color }) => color};
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

  if (!canFilter) {
    return null;
  }

  const isActive = !!filterValue;

  return (
    <OverlayTrigger
      trigger="click"
      placement="bottom"
      rootClose
      overlay={
        <Popover id="popover-basic">
          <Popover.Body>
            <Form.Control
              data-cy={`input-filter-${Header}`}
              type="text"
              value={filterValue || ''}
              onChange={(e) => {
                setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
              }}
              placeholder={`Search ${count} records...`}
            />
          </Popover.Body>
        </Popover>
      }
    >
      <FilterButton
        color={isActive ? 'var(--bs-primary)' : 'var(--bs-secondary)'}
        data-cy={`filter-${Header}`}
      >
        <FontAwesomeIcon icon={faFilter} />
      </FilterButton>
    </OverlayTrigger>
  );
}

export default function IncidentsTable({ data }) {
  const [incidentIdToEdit, setIncindentIdToEdit] = useState(0);

  const { isAdmin } = useUserContext();

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 150,
      maxWidth: 400,
      Filter: DefaultColumnFilter,
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
    useFilters,
    useBlockLayout,
    useResizeColumns,
    usePagination
  );

  return (
    <>
      {/* eslint-disable react/jsx-key */}

      <Table {...getTableProps()}>
        <div>
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <div {...column.getHeaderProps()} className="td border-bottom border-right">
                  <HeaderText>
                    {column.render('Filter')}
                    {column.render('Header')}
                  </HeaderText>
                  <ResizeHandle {...column.getResizerProps()} isResizing={column.isResizing} />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr" data-cy="row">
                {row.cells.map((cell) => {
                  return (
                    <div {...cell.getCellProps()} className="td border-end border-bottom">
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </Table>

      <div className="d-flex gap-2 justify-content-start align-items-center mt-3">
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

      <IncidentEditModal
        show={incidentIdToEdit !== 0}
        onClose={() => setIncindentIdToEdit(0)}
        incidentId={incidentIdToEdit}
      />
    </>
  );
}
