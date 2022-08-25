import { useUserContext } from 'contexts/userContext';
import React, { useState } from 'react';
import { Button, Form, Pagination } from 'react-bootstrap';
import { useBlockLayout, useFilters, usePagination, useResizeColumns, useTable } from 'react-table';
import IncidentEditModal from './IncidentEditModal';
import styled from 'styled-components';

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

  if (!canFilter) {
    return <HeaderText>{Header}</HeaderText>;
  }

  return (
    <>
      <HeaderText>{Header}</HeaderText>
      <Form.Control
        data-cy={`input-filter-${Header}`}
        className="w-100"
        type="text"
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        placeholder={`Search ${count} records...`}
      />
    </>
  );
}

function ListCell({ cell }) {
  return <div>{cell.value?.join(', ')}</div>;
}

export default function IncidentsTable({ data }) {
  const [incidentIdToEdit, setIncindentIdToEdit] = useState(0);

  const { isLoggedIn, isRole } = useUserContext();

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 220,
      maxWidth: 640,
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const columns = React.useMemo(() => {
    const columns = [
      {
        Header: 'Incident ID',
        accessor: 'incident_id',
        Cell: ({ row: { values } }) => (
          <a className="flex" href={`/cite/${values.incident_id}`}>
            Incident {values.incident_id}
          </a>
        ),
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
        Cell: ListCell,
      },
      {
        Header: 'Alleged Developer of AISystem',
        accessor: 'AllegedDeveloperOfAISystem',
        Cell: ListCell,
      },
      {
        Header: 'Alleged Harmed or Nearly Harmed Parties',
        accessor: 'AllegedHarmedOrNearlyHarmedParties',
        Cell: ListCell,
      },
    ];

    if (isRole('incident_editor')) {
      columns.push({
        Header: 'Actions',
        Cell: ({ row: { values } }) => (
          <Button
            data-cy="edit-incident"
            variant="link"
            onClick={() => setIncindentIdToEdit(values.incident_id)}
          >
            Edit
          </Button>
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

      <div className="flex gap-2 justify-start items-center mt-3">
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
