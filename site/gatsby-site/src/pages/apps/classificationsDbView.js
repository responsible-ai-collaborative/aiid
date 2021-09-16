import React, { useState, useEffect } from 'react';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { useMongo } from 'hooks/useMongo';
import config from '../../../config';

import { useTable, useFilters, usePagination } from 'react-table';
import { Table } from 'react-bootstrap';

const Container = styled.div`
  width: 100vw;
  margin: 0 auto;
  padding: 0 2rem;
  overflow: auto;
  font-size: 0.8em;

  @media (max-width: 767px) {
    padding: 0;
  }
`;

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

const DEFAULT_EMPTY_CELL_DATA = '-';

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

const SelectColumnFilter = ({ column: { filterValue, setFilter, preFilteredRows, id } }) => {
  // TODO: add search for large lists
  let options;

  const columnsArrayValues = [
    'NamedEntities',
    'TechnologyPurveyor',
    'HarmType',
    'HarmDistributionBasis',
    'InfrastructureSectors',
    'LawsImplicated',
    'RelevantAIfunctions',
    'AIApplications',
    'PhysicalSystem',
    'ProblemNature',
  ];

  const columnSemicolonValues = ['DataInputs', 'SystemDeveloper', 'AITechniques'];

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

  const filterOptionsFromSemicolonString = () => {
    return React.useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach((row) => {
        row.values[id].split('; ').forEach((s) => {
          if (s !== '') {
            options.add(s);
          }
        });
      });

      return [...options.values()];
    }, [id, preFilteredRows]);
  };

  if (columnsArrayValues.includes(id)) {
    options = filterOptionsFromArray();
  } else if (columnSemicolonValues.includes(id)) {
    options = filterOptionsFromSemicolonString();
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
    <select
      style={{ maxWidth: 100 }}
      value={filterValue}
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
    </select>
  );
};

export default function ClassificationsDbView(props) {
  const [loading, setLoading] = useState(false);

  const [tableData, setTableData] = useState([]);

  const [columnData, setColumnData] = useState([]);

  // data fetch method - paginated
  const fetchClassificationData = () => {
    return new Promise((resolve, reject) => {
      const { runQuery } = useMongo();

      try {
        runQuery(
          {
            namespace: 'CSET',
          },
          (res) => {
            resolve(res);
          },
          config.realm.production_db.db_service,
          config.realm.production_db.db_name,
          'classifications'
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  const fetchTaxaData = () => {
    return new Promise((resolve, reject) => {
      const { runQuery } = useMongo();

      try {
        runQuery(
          {
            namespace: 'CSET',
          },
          (res) => {
            resolve(res);
          },
          config.realm.production_db.db_service,
          config.realm.production_db.db_name,
          'taxa'
        );
      } catch (error) {
        reject(error);
      }
    });
  };

  useEffect(() => {
    const fieldToColumnMap = (taxaField) => {
      const selectFilterTypes = ['multi', 'list', 'enum', 'bool'];

      const column = {
        Header: taxaField.short_name,
        accessor: taxaField.short_name.split(' ').join(''),
      };

      if (selectFilterTypes.includes(taxaField.display_type)) {
        column.Filter = SelectColumnFilter;
        column.filter = 'includes';
      }

      return column;
    };

    const formatClassificationData = (taxonomyFields, classifications) => {
      let tableData = [];

      const booleanValueFields = taxonomyFields
        .filter((f) => f.display_type === 'bool')
        .map((f) => {
          return f.short_name.split(' ').join('');
        });

      const classificationsToRowsMap = (cObj) => {
        const row = {};

        row['IncidentId'] = cObj.incident_id;
        for (const key in cObj.classifications) {
          row[key.split(' ').join('')] = cObj.classifications[key];
        }

        return row;
      };

      const classificationFormatBoolean = (c) => {
        const row = {};

        for (const key in c) {
          if (booleanValueFields.includes(key)) {
            const value = c[key];

            if (value === true) {
              row[key] = 'Yes';
            }
            if (value === false) {
              row[key] = 'No';
            }
            if (value === null || value === undefined) {
              row[key] = DEFAULT_EMPTY_CELL_DATA;
            }
          } else {
            row[key] = c[key];
          }
        }

        return row;
      };

      const replaceEmptyValuesMap = (c) => {
        const row = {};

        for (const key in c) {
          if (c[key] === '' || c[key] === null || c[key] === undefined) {
            row[key] = DEFAULT_EMPTY_CELL_DATA;
          } else {
            row[key] = c[key];
          }
        }

        return row;
      };

      const formatArrayFields = (c) => {
        const row = {};

        for (const key in c) {
          if (Array.isArray(c[key])) {
            row[key] = c[key].toString();
            if (c[key].toString() === '') {
              row[key] = DEFAULT_EMPTY_CELL_DATA;
            }
          } else {
            row[key] = c[key];
          }
        }

        return row;
      };

      tableData = classifications
        .map(classificationsToRowsMap) // should be first map function
        .map(classificationFormatBoolean)
        .map(replaceEmptyValuesMap)
        .map(formatArrayFields);

      return tableData;
    };

    setLoading(true);
    const initSetup = async () => {
      const taxaData = await fetchTaxaData();

      const incidentIdColumn = {
        Header: 'Incident ID',
        accessor: 'IncidentId',
      };

      setColumnData([incidentIdColumn, ...taxaData[0].field_list.map(fieldToColumnMap)]);

      const classificationData = await fetchClassificationData();

      setTableData(formatClassificationData(taxaData[0].field_list, classificationData));

      setLoading(false);
    };

    initSetup();
  }, []);

  // loading state
  // table setup
  /**
   * Characteristisc:
   *
   * virtualized rows
   * sorting
   * filtering
   * paginated - with fetch + loading
   * column resizing
   * full width
   * bootstrap
   */

  const data = React.useMemo(() => tableData, [tableData]);

  const columns = React.useMemo(() => [...columnData], [columnData]);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  // const filterTypes = {
  //   postDate: (rows, id, filterValue) => {
  //     const start = format(filterValue[0]).subtract(1, 'day');

  //     const end = format(filterValue[1]).add(1, 'day');

  //     return rows.filter(val => format(val.original[id], 'YYYY-MM-DD').isBetween(start, end));
  //   },
  // };

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
      data,
      defaultColumn,
      initialState: { pageIndex: 0 },
      // manualPagination: true,
    },
    useFilters,
    usePagination
  );

  if (loading) {
    return (
      <LayoutHideSidebar {...props}>
        <Helmet>
          <title>Artifical Intelligence Incident Database</title>
        </Helmet>
        <Container>
          <div>loading...</div>
        </Container>
      </LayoutHideSidebar>
    );
  }

  if (!columnData || !tableData) {
    return (
      <LayoutHideSidebar {...props}>
        <Helmet>
          <title>Artifical Intelligence Incident Database</title>
        </Helmet>
        <Container>
          <div>Error</div>
        </Container>
      </LayoutHideSidebar>
    );
  }

  return (
    <LayoutHideSidebar {...props}>
      <Helmet>
        <title>Artifical Intelligence Incident Database</title>
      </Helmet>
      <Container>
        <TableStyles>
          <Table striped bordered hover {...getTableProps()}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th key={column.id} {...column.getHeaderProps()}>
                      {column.render('Header')}
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
                      return (
                        <td key={cell.id} {...cell.getCellProps()}>
                          <ScrollCell>{cell.render('Cell')}</ScrollCell>
                        </td>
                      );
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
      </Container>
    </LayoutHideSidebar>
  );
}
