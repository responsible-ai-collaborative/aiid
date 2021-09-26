import React, { useEffect, useState } from 'react';
import Helmet from 'react-helmet';
import { graphql, navigate } from 'gatsby';

import Layout from 'components/Layout';
import Link from 'components/Link';
import { StyledHeading } from 'components/styles/Docs';
import styled from 'styled-components';

import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import { Table } from 'react-bootstrap';

const TableStyles = styled.div`
  padding: 1rem;

  table {
    border-spacing: 0;

    tr {
      :last-child {
        td {
          border-bottom: 0;
        }
      }
    }

    th,
    td {
      margin: 0;
      padding: 0.5rem;

      :last-child {
        border-right: 0;
      }
    }
  }
`;

const ScrollCell = styled.div`
  width: 100%;
  height: 100px;
  margin: 0;
  padding: 0;
  overflow: auto;
`;

const HeaderCellContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LinkTableCell = styled.td`
  cursor: pointer;
`;

const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
  const count = preFilteredRows.length;

  return (
    <input
      value={filterValue || ''}
      onChange={(e) => {
        e.preventDefault();
        setFilter(e.target.value || undefined);
      }}
      placeholder={`Search ${count} records...`}
    />
  );
};

export default function Incidents(props) {
  const [tableData, setTableData] = useState([]);

  const [columnData, setColumnData] = useState([]);

  const { data } = props;

  useEffect(() => {
    if (!data) return;

    const tableKeys = Object.keys(data.allMongodbAiidprodIncidents.group[0].edges[0].node);

    const formatHeaderName = (key) => {
      return key
        .split('_')
        .map((word) => word.toUpperCase())
        .join(' ');
    };

    const fieldToColumnMap = (tableKeys) => {
      const columnData = [];

      const omitKeys = ['id', 'url'];

      tableKeys.forEach((k) => {
        if (!omitKeys.includes(k)) {
          columnData.push({
            Header: formatHeaderName(k),
            accessor: k,
          });
        }
      });

      return columnData;
    };

    const incidentDataToCellMap = (data) => {
      let tableData = [];

      const {
        allMongodbAiidprodIncidents: { group },
      } = data;

      group.forEach((incidentReports) => {
        incidentReports.edges.forEach((incident) => {
          tableData.push(incident.node);
        });
      });

      return tableData;
    };

    setColumnData(fieldToColumnMap(tableKeys));
    setTableData(incidentDataToCellMap(data));
  }, [data]);

  const cellData = React.useMemo(() => tableData, [tableData]);

  const columns = React.useMemo(() => [...columnData], [columnData]);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    // rows,
    page,
    prepareRow,
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
      data: cellData,
      defaultColumn,
      initialState: { pageIndex: 0 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  if (!data) {
    return null;
  }
  const {
    allMongodbAiidprodIncidents: { group },
  } = data;

  // sort by value
  group.sort(function (a, b) {
    return a['edges'][0]['node']['incident_id'] - b['edges'][0]['node']['incident_id'];
  });

  return (
    <Layout {...props}>
      <Helmet>
        <title>Incident List</title>
      </Helmet>
      <div className={'titleWrapper'}>
        <StyledHeading>Incident Table View</StyledHeading>
      </div>
      <TableStyles>
        <Table striped bordered hover {...getTableProps()}>
          <thead>
            {headerGroups.map((headerGroup) => (
              <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th key={column.id} {...column.getHeaderProps()}>
                    <HeaderCellContainer {...column.getHeaderProps(column.getSortByToggleProps())}>
                      {column.render('Header')}
                      <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                    </HeaderCellContainer>
                    <div>{column.canFilter ? column.render('Filter') : null}</div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr key={row.id} {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    if (cell.column.Header === 'TITLE') {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          <ScrollCell>
                            <Link to={row.original.url}>{cell.render('Cell')}</Link>
                          </ScrollCell>
                        </td>
                      );
                    } else if (cell.column.Header === 'INCIDENT ID') {
                      return (
                        <LinkTableCell
                          onClick={() => navigate(`/cite/${row.original.incident_id}`)}
                          key={cell.id}
                          {...cell.getCellProps()}
                        >
                          <ScrollCell>{cell.render('Cell')}</ScrollCell>
                        </LinkTableCell>
                      );
                    } else {
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          <ScrollCell>{cell.render('Cell')}</ScrollCell>
                        </td>
                      );
                    }
                  })}
                </tr>
              );
            })}
            {page.length === 0 && (
              <tr>
                <th colSpan={10}>
                  <div>
                    <span>No results found</span>
                  </div>
                </th>
              </tr>
            )}
          </tbody>
        </Table>

        <div className="pagination">
          <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
            {'<<'}
          </button>{' '}
          <button onClick={() => previousPage()} disabled={!canPreviousPage}>
            {'<'}
          </button>{' '}
          <button onClick={() => nextPage()} disabled={!canNextPage}>
            {'>'}
          </button>{' '}
          <button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
            {'>>'}
          </button>{' '}
          <span>
            Page{' '}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>{' '}
          </span>
          <span>
            | Go to page:{' '}
            <input
              type="number"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;

                gotoPage(page);
              }}
              style={{ width: '100px' }}
            />
          </span>{' '}
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>
      </TableStyles>
    </Layout>
  );
}

export const pageQuery = graphql`
  query AllIncidentsForTableView {
    allMongodbAiidprodIncidents(
      filter: { flag: { eq: null } }
      sort: { order: ASC, fields: incident_id }
    ) {
      group(field: incident_id) {
        edges {
          node {
            id
            incident_id
            report_number
            title
            url
            incident_date
          }
        }
      }
    }
  }
`;
