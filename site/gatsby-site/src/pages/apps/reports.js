import React, { useEffect, useState } from 'react';
import AiidHelmet from '../../components/AiidHelmet';
import { format } from 'date-fns';
import Link from '../../components/ui/Link';
import { StyledHeading } from '../../components/styles/Docs';
import styled from 'styled-components';
import { faLink } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import { Table, InputGroup, FormControl, Form, Button } from 'react-bootstrap';
import { gql, useQuery } from '@apollo/client';
import Layout from 'components/Layout';
import { useMenuContext } from 'contexts/MenuContext';
import ListSkeleton from 'elements/Skeletons/List';
import { Trans } from 'react-i18next';

const TableStyles = styled.div`
  padding: 1rem 1rem 1rem 0;

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
  min-width: 200px;
  margin: 0;
  padding: 0;
  overflow: auto;

  ${({ hasClick }) =>
    hasClick &&
    `
    cursor: pointer;

    :hover {
      background: white;
    }
  `};
`;

const Container = styled.div`
  max-width: calc(100vw - 298px);
  margin: 0 auto;
  overflow: auto;
  white-space: nowrap;
  padding: 0 0 0 1rem;

  ${({ isWide }) =>
    isWide &&
    `
    max-width: 100vw;
    padding: 0 0 0 3.5rem;
  `};

  @media (max-width: 767px) {
    padding: 0;
  }
`;

const HeaderCellContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Pagination = styled.div`
  margin: 2em 0 0 0;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

const PaginationNavButtons = styled.div``;

const PageNumber = styled.div`
  span {
    font-weight: bold;
  }
`;

const PerPageNumber = styled.div`
  span {
    font-weight: bold;
  }
`;

const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
  const count = preFilteredRows.length;

  return (
    <InputGroup>
      <FormControl
        value={filterValue || ''}
        onChange={(e) => {
          e.preventDefault();
          setFilter(e.target.value || undefined);
        }}
        placeholder={`Search ${count} records...`}
      />
    </InputGroup>
  );
};

const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  let options;

  const ARRAY_COLUMNS = ['submitters'];

  const filterOptionsFromArray = () => {
    return (options = React.useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach((row) => {
        if (Array.isArray(row.values[id])) {
          row.values[id].forEach((w) => {
            if (w !== '') {
              options.add(w);
            }
          });
        } else {
          if (row.values[id] !== '') {
            options.add(row.values[id]);
          }
        }
      });
      return [...options.values()];
    }, [id, preFilteredRows]));
  };

  if (ARRAY_COLUMNS.includes(id)) {
    options = filterOptionsFromArray();
  } else {
    options = React.useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach((row) => {
        if (row.values[id] !== '') {
          options.add(row.values[id]);
        }
      });
      return [...options.values()];
    }, [id, preFilteredRows]);
  }

  const filteredOptions = options.filter((o) => o !== '-');

  return (
    <Form.Select
      style={{ width: '100%' }}
      value={filterValue || 'All'}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">All</option>
      {filteredOptions.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Form.Select>
  );
};

const SelectDatePickerFilter = ({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}) => {
  const [min, max] = React.useMemo(() => {
    let min = new Date(preFilteredRows[0]?.values[id] ?? '1970-01-01').getTime();

    let max = new Date(preFilteredRows[0]?.values[id] ?? '1970-01-01').getTime();

    preFilteredRows.forEach((row) => {
      const currentDatetime = new Date(row.values[id]).getTime();

      min = currentDatetime <= min ? currentDatetime : min;
      max = currentDatetime >= max ? currentDatetime : max;
    });
    return [min, max];
  }, [id, preFilteredRows]);

  if (filterValue.length === 0) {
    setFilter;
  }

  const handleApply = (event, picker) => {
    picker.element.val(
      format(picker.startDate.toDate(), 'yyyy-MM-dd') +
        ' - ' +
        format(picker.endDate.toDate(), 'yyyy-MM-dd')
    );
    setFilter([picker.startDate.valueOf() / 1000, picker.endDate.valueOf() / 1000]);
  };

  const handleCancel = (event, picker) => {
    picker.element.val('');
    setFilter([min, max]);
  };

  return (
    <DateRangePicker
      className="custom-picker"
      onApply={handleApply}
      onCancel={handleCancel}
      initialSettings={{
        showDropdowns: true,
        autoUpdateInput: false,
        locale: {
          cancelLabel: 'Clear',
        },
      }}
    >
      <input style={{ width: 190 }} type="text" className="form-control col-4" defaultValue="" />
    </DateRangePicker>
  );
};

const query = gql`
  query ReportsQuery {
    incidents(sortBy: INCIDENT_ID_ASC, limit: 9999) {
      incident_id
      reports {
        title
        source_domain
        url
        authors
        submitters
        epoch_date_submitted
        epoch_date_modified
        epoch_date_downloaded
        report_number
        flag
      }
    }
  }
`;

export default function Incidents(props) {
  const [tableData, setTableData] = useState([]);

  const [columnData, setColumnData] = useState([]);

  const { data, loading } = useQuery(query);

  useEffect(() => {
    if (!data) return;

    const replaceKeys = {
      epoch_date_submitted: 'date_submitted',
      epoch_date_modified: 'date_modified',
      epoch_date_downloaded: 'date_downloaded',
      report_number: 'report_id',
      flag: 'flagged',
    };

    const tableKeys = [
      'incident_id',
      'title',
      'source_domain',
      'url',
      'authors',
      'submitters',
      'epoch_date_submitted',
      'epoch_date_modified',
      'epoch_date_downloaded',
      'report_number',
      'flag',
    ];

    const omitKeys = ['id', 'url'];

    const formatHeaderName = (key) => {
      return key
        .split('_')
        .map((word) => word.toUpperCase())
        .join(' ');
    };

    const fieldToColumnMap = (tableKeys) => {
      const SELECT_FILTER_COLUMN = ['submitters', 'flag', 'incident_id'];

      const DATE_RANGE_FILTER_COLUMN = [
        'epoch_date_submitted',
        'epoch_date_modified',
        'epoch_date_downloaded',
      ];

      const columnData = [];

      tableKeys.forEach((k) => {
        const newColumn = {
          Header: formatHeaderName(k),
          accessor: k,
        };

        if (!omitKeys.includes(k)) {
          if (replaceKeys[k]) {
            newColumn.Header = formatHeaderName(replaceKeys[k]);
          }

          if (SELECT_FILTER_COLUMN.includes(k)) {
            newColumn.Filter = SelectColumnFilter;
            // newColumn.filter = 'includes';
          }

          if (DATE_RANGE_FILTER_COLUMN.includes(k)) {
            newColumn.Filter = SelectDatePickerFilter;
            newColumn.filter = k;
          }

          columnData.push(newColumn);
        }
      });

      return columnData;
    };

    const incidentDataToCellMap = (data) => {
      const tableData = data.incidents.reduce((accumulator, incident) => {
        for (const report of incident.reports) {
          accumulator.push({
            ...report,
            incident_id: incident.incident_id,
            flag: report.flag === true ? 'Yes' : 'No',
            authors: report.authors.join(', '),
            __typename: undefined,
          });
        }
        return accumulator;
      }, []);

      return tableData;
    };

    setColumnData(fieldToColumnMap(tableKeys));
    setTableData(incidentDataToCellMap(data));
  }, [data]);

  const formatDateField = (s) => {
    return <>{format(new Date(s.props.cell.value * 1000), 'yyyy-MM-dd')}</>;
  };

  const formatIncidentIdField = (i) => {
    return (
      <Link to={`/cite/${i.props.cell.value}`}>
        {`Incident ${i.props.cell.value} `}
        <FontAwesomeIcon icon={faLink} className="fas fa-link" />
      </Link>
    );
  };

  const cellData = React.useMemo(() => tableData, [tableData]);

  const columns = React.useMemo(() => [...columnData], [columnData]);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const filterDateFunction = (rows, id, filterValue) => {
    const start = filterValue[0];

    const end = filterValue[1];

    return rows.filter((val) => {
      return val.original[id] >= start && val.original[id] <= end;
    });
  };

  const filterTypes = {
    epoch_date_submitted: filterDateFunction,
    epoch_date_modified: filterDateFunction,
    epoch_date_downloaded: filterDateFunction,
  };

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
    setFilter,
    setAllFilters,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data: cellData,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 100 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const filterOnClick = (cell, customHeader) => {
    const header =
      customHeader?.toLowerCase().split(' ').join('_') ??
      cell.column.Header.toLowerCase().split(' ').join('_');

    const cellClickedValue = cell.render('Cell').props.cell.value + '';

    const currentFilter = cell.column.filterValue + '';

    if (currentFilter?.includes(cellClickedValue)) {
      setFilter(header, undefined);
    } else {
      setFilter(header, cellClickedValue);
    }
  };

  const { isCollapsed } = useMenuContext();

  return (
    <Layout {...props} sidebarCollapsed={true}>
      <AiidHelmet path={props.location.pathname}>
        <title>Incident List</title>
      </AiidHelmet>

      {loading && <ListSkeleton />}

      {!loading && (
        <Container isWide={isCollapsed} className="bootstrap">
          <StyledHeading>Incident Report Table</StyledHeading>
          <Button onClick={() => setAllFilters([])}>Reset filters</Button>
          <TableStyles>
            <Table striped bordered hover {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th key={column.id} {...column.getHeaderProps()}>
                        <HeaderCellContainer
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                        >
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </HeaderCellContainer>
                        <div data-cy="filter">
                          {column.canFilter ? column.render('Filter') : null}
                        </div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr key={row.id} {...row.getRowProps()} data-cy="row">
                      {row.cells.map((cell) => {
                        if (cell.column.Header === 'TITLE') {
                          return (
                            <td key={cell.id} {...cell.getCellProps()}>
                              <ScrollCell hasClick={true} onClick={() => filterOnClick(cell)}>
                                <Link to={row.original.url}>{cell.render('Cell')}</Link>
                              </ScrollCell>
                            </td>
                          );
                        } else if (cell.column.Header === 'INCIDENT ID') {
                          return (
                            <td key={cell.id} {...cell.getCellProps()}>
                              <ScrollCell hasClick={true} onClick={() => filterOnClick(cell)}>
                                {formatIncidentIdField(cell.render('Cell'))}
                              </ScrollCell>
                            </td>
                          );
                        } else if (cell.column.Header.includes('DATE')) {
                          return (
                            <td key={cell.id} {...cell.getCellProps()}>
                              <ScrollCell>{formatDateField(cell.render('Cell'))}</ScrollCell>
                            </td>
                          );
                        } else if (cell.column.Header === 'AUTHORS') {
                          return (
                            <td key={cell.id} {...cell.getCellProps()}>
                              <ScrollCell style={{ width: 200 }}>{cell.render('Cell')}</ScrollCell>
                            </td>
                          );
                        } else {
                          return (
                            <td key={cell.id} {...cell.getCellProps()}>
                              <ScrollCell hasClick={true} onClick={() => filterOnClick(cell)}>
                                {cell.render('Cell')}
                              </ScrollCell>
                            </td>
                          );
                        }
                      })}
                    </tr>
                  );
                })}
                {page.length === 0 && (
                  <tr>
                    <th colSpan={11}>
                      <div>
                        <span>
                          <Trans>No results found</Trans>
                        </span>
                      </div>
                    </th>
                  </tr>
                )}
              </tbody>
            </Table>

            <Pagination>
              <PaginationNavButtons>
                <Button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                  {'<<'}
                </Button>{' '}
                <Button onClick={() => previousPage()} disabled={!canPreviousPage}>
                  {'<'}
                </Button>{' '}
                <Button onClick={() => nextPage()} disabled={!canNextPage}>
                  {'>'}
                </Button>{' '}
                <Button onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                  {'>>'}
                </Button>{' '}
              </PaginationNavButtons>

              <PageNumber>
                <span>
                  Page{' '}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{' '}
                </span>
              </PageNumber>

              <PerPageNumber>
                <span>
                  Go to page:{' '}
                  <input
                    type="number"
                    defaultValue={pageIndex + 1}
                    onChange={(e) => {
                      const page = e.target.value ? Number(e.target.value) - 1 : 0;

                      gotoPage(page);
                    }}
                    style={{ width: '100px', minWidth: 0 }}
                  />
                </span>{' '}
                <select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50, 200].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </PerPageNumber>
            </Pagination>
          </TableStyles>
        </Container>
      )}
    </Layout>
  );
}
