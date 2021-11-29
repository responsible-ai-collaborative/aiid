import React, { useState, useEffect } from 'react';
import LayoutHideSidebar from 'components/LayoutHideSidebar';
import TaxonomyForm from 'components/TaxonomyForm';
import Helmet from 'react-helmet';
import styled from 'styled-components';
import { useMongo } from 'hooks/useMongo';
import config from '../../../config';

import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import { Table, Spinner, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import Link from 'components/Link';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal, CustomModal } from 'components/useModal';
import { useUserContext } from 'contexts/userContext';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { format } from 'date-fns';

const Container = styled.div`
  max-width: calc(100vw - 298px);
  margin: 0 auto;
  overflow: auto;
  white-space: nowrap;
  font-size: 0.8em;

  ${({ isWide }) =>
    isWide &&
    `
    max-width: 100vw;
    padding: 0 0 0 2.7rem;
  `};

  @media (max-width: 767px) {
    padding: 0;
  }
`;

const TableStyles = styled.div`
  padding-top: 1rem;

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
  margin: 0;
  padding: 0;
  overflow: auto;
`;

const ModalCell = styled.div`
  cursor: pointer;
  width: 10px;
  height: 10px;
`;

const HeaderCellContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const TaxonomySelectContainer = styled.div`
  padding: 1rem 1rem 1rem 0;
  font-size: 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const DEFAULT_EMPTY_CELL_DATA = '-';

const DefaultColumnFilter = ({ column: { filterValue, preFilteredRows, setFilter } }) => {
  const count = preFilteredRows.length;

  return (
    <InputGroup>
      <FormControl
        style={{ minWidth: 100 }}
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
        if (row.values[id]) {
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
        }
      });
      return [...options.values()];
    }, [id, preFilteredRows]));
  };

  const filterOptionsFromSemicolonString = () => {
    return React.useMemo(() => {
      const options = new Set();

      preFilteredRows.forEach((row) => {
        if (row.values[id]) {
          row.values[id].split('; ').forEach((s) => {
            if (s !== '') {
              options.add(s);
            }
          });
        }
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
        if (row.values[id]) {
          if (row.values[id] !== '') {
            options.add(row.values[id]);
          }
        }
      });
      return [...options.values()];
    }, [id, preFilteredRows]);
  }

  const filteredOptions = options.filter((o) => o !== '-');

  return (
    <Form.Select
      style={{ minWidth: 100 }}
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
      picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY')
    );
    setFilter([picker.startDate.valueOf(), picker.endDate.valueOf()]);
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

const getClassificationsArray = (classifications, taxonomy) => {
  if (!classifications) {
    return [];
  }

  const taxaFieldsArray = taxonomy.field_list.sort((a, b) => b.weight - a.weight);

  const array = [];

  const getStringForValue = (value) => {
    switch (typeof value) {
      case 'object':
        return value.join(', ');

      case 'boolean':
        return value ? 'Yes' : 'No';

      default:
        return value;
    }
  };

  taxaFieldsArray.forEach((field) => {
    const c = classifications[field.short_name];

    const value = getStringForValue(c);

    array.push({
      name: field.short_name,
      value: getStringForValue(value),
      weight: field.weight,
      shortDescription: field.short_description,
    });
  });

  return array;
};

export default function ClassificationsDbView(props) {
  const { isAdmin } = useUserContext();

  const [loading, setLoading] = useState(false);

  const [collapse, setCollapse] = useState(true);

  const [allTaxonomies, setAllTaxonomies] = useState([]);

  const [allClassifications, setAllClassifications] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [columnData, setColumnData] = useState([]);

  const [currentTaxonomy, setCurrentTaxonomy] = useState('');

  useEffect(() => {
    setLoading(true);
    const setupTaxonomiesSelect = async () => {
      const taxonomies = await fetchTaxaData();

      let filteredTaxa = [];

      if (!isAdmin) {
        taxonomies.forEach((t) => {
          filteredTaxa.push({
            ...t,
            field_list: t.field_list.filter((f) => f.public !== false),
          });
        });
      } else {
        filteredTaxa = [...taxonomies];
      }

      setAllTaxonomies([...filteredTaxa]);
      setCurrentTaxonomy(taxonomies[0].namespace);
      setLoading(false);
    };

    setupTaxonomiesSelect();
  }, [isAdmin]);

  const fetchClassificationData = (query) => {
    return new Promise((resolve, reject) => {
      const { runQuery } = useMongo();

      try {
        runQuery(
          query,
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
          {},
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

  const initSetup = async () => {
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

      if (taxaField.display_type === 'date') {
        column.Filter = SelectDatePickerFilter;
        column.filter = taxaField.short_name.split(' ').join('');
      }

      return column;
    };

    const taxaData = allTaxonomies.filter((taxa) => taxa.namespace === currentTaxonomy);

    if (taxaData.length === 0) {
      setLoading(false);
      return;
    }

    const incidentIdColumn = {
      Header: 'Incident ID',
      accessor: 'IncidentId',
    };

    const actionsColumn = {
      Header: 'Actions',
      accessor: 'actions',
    };

    setColumnData([
      actionsColumn,
      incidentIdColumn,
      ...taxaData[0].field_list.map(fieldToColumnMap),
    ]);

    let rowQuery = {
      namespace: currentTaxonomy,
    };

    // Fetch only classifications with "Annotation Status": "6. Complete and final"
    if (!isAdmin) {
      rowQuery['classifications.Annotation Status'] = '6. Complete and final';
    }
    const classificationData = await fetchClassificationData(rowQuery);

    if (classificationData.length > 0) {
      setAllClassifications(classificationData);
    }

    setTableData(formatClassificationData(taxaData[0].field_list, classificationData));

    setLoading(false);
  };

  useEffect(() => {
    if (allTaxonomies.length === 0) {
      return;
    }
    setLoading(true);

    try {
      initSetup();
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  }, [currentTaxonomy, allTaxonomies]);

  const editClassificationModal = useModal();

  const data = React.useMemo(() => tableData, [tableData]);

  const columns = React.useMemo(() => [...columnData], [columnData]);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const filterDateFunction = (rows, id, filterValue) => {
    const start = new Date(filterValue[0]).getTime();

    const end = new Date(filterValue[1]).getTime();

    return rows.filter(
      (val) =>
        new Date(val.original[id]).getTime() >= start && new Date(val.original[id]).getTime() <= end
    );
  };

  const formatDateField = (s) => {
    const dateObj = new Date(s.props.cell.value);

    if (dateObj instanceof Date && !isNaN(dateObj)) {
      return <>{format(new Date(dateObj), 'yyyy-MM-dd')}</>;
    } else {
      return <>{s.props.cell.value}</>;
    }
  };

  const getEditClassificationForm = (row) => {
    const taxonomyFormObj = {
      classificationsArray: [],
      namespace: '',
      taxonomyFields: [],
    };

    const taxaData = allTaxonomies.filter((taxa) => taxa.namespace === currentTaxonomy)[0];

    taxonomyFormObj.namespace = taxaData.namespace;
    taxonomyFormObj.taxonomyFields = taxaData.field_list.map((f) => {
      return {
        display_type: f.display_type,
        long_name: f.long_name,
        public: f.public,
        short_description: f.short_description,
        short_name: f.short_name,
        weight: f.weight,
      };
    });

    const classificationObj = allClassifications.filter(
      (report) => report.incident_id === row.values.IncidentId
    );

    taxonomyFormObj.classificationsArray = getClassificationsArray(
      classificationObj.length > 0 ? classificationObj[0].classifications : null,
      taxaData
    );

    return (
      <>
        <TaxonomyForm
          key={'CSET'}
          taxonomy={taxonomyFormObj}
          incidentId={row.values.IncidentId}
          doneSubmittingCallback={initSetup}
        />
      </>
    );
  };

  const filterTypes = {
    BeginningDate: filterDateFunction,
    EndingDate: filterDateFunction,
  };

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
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
    setAllFilters,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: { pageIndex: 0, pageSize: 500 },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const fullTextModal = useModal();

  const RenderRow = React.useCallback(
    (row) => {
      prepareRow(row);
      return (
        <tr key={row.id} {...row.getRowProps()}>
          {row.cells.map((cell) => {
            if (cell.column.Header.includes('Incident ID')) {
              return (
                <td key={cell.id} {...cell.getCellProps()}>
                  <ScrollCell>
                    <Link to={`/cite/${cell.value}#taxa-area`}>Incident {cell.render('Cell')}</Link>
                  </ScrollCell>
                </td>
              );
            } else if (cell.column.Header.includes('Actions')) {
              return (
                <td key={cell.id} {...cell.getCellProps()}>
                  <Button
                    className="me-auto"
                    disabled={!isAdmin}
                    onClick={() =>
                      editClassificationModal.openFor({
                        title: `Edit CSET classification for incident ${row.original.IncidentId}`,
                        body: function f() {
                          return getEditClassificationForm(row);
                        },
                      })
                    }
                  >
                    <FontAwesomeIcon icon={faEdit} className="fas fa-edit" />
                  </Button>
                </td>
              );
            } else if (cell.column.Header.includes('Date')) {
              return (
                <td key={cell.id} {...cell.getCellProps()}>
                  <ScrollCell>{formatDateField(cell.render('Cell'))}</ScrollCell>
                </td>
              );
            } else if (cell.value?.length > 130) {
              return (
                <td key={cell.id} {...cell.getCellProps()}>
                  <ScrollCell style={{ overflow: 'hidden' }}>
                    {cell.value.substring(0, 124)}...
                  </ScrollCell>
                  <ModalCell>
                    <FontAwesomeIcon
                      onClick={() =>
                        fullTextModal.openFor({
                          title: cell.column.Header,
                          body: function f() {
                            return cell.value;
                          },
                        })
                      }
                      icon={faExpandAlt}
                      className="fas fa-expand-arrows-alt"
                    />
                  </ModalCell>
                </td>
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
    },
    [prepareRow, page]
  );

  if (columnData.length === 0 || tableData.length === 0) {
    return (
      <LayoutHideSidebar {...props}>
        <Helmet>
          <title>Artificial Intelligence Incident Database</title>
        </Helmet>
        <Container>
          <TaxonomySelectContainer>
            {loading ? (
              <>
                <Form.Select
                  style={{ width: 100, margin: '0 10px' }}
                  aria-label="Default select example"
                  onChange={(e) => setCurrentTaxonomy(e.target.value)}
                >
                  {allTaxonomies.length > 0 &&
                    allTaxonomies.map((taxa) => (
                      <option key={taxa.namespace} value={taxa.namespace}>
                        {taxa.namespace}
                      </option>
                    ))}
                </Form.Select>
                <Spinner
                  animation="border"
                  role="status"
                  variant="primary"
                  style={{ marginLeft: 10 }}
                >
                  <span className="sr-only">Loading...</span>
                </Spinner>
              </>
            ) : (
              <span>Error. Please try again or contact support team.</span>
            )}
          </TaxonomySelectContainer>
        </Container>
      </LayoutHideSidebar>
    );
  }

  return (
    <LayoutHideSidebar
      {...props}
      menuCollapseCallback={(collapseFlag) => setCollapse(collapseFlag)}
    >
      <Helmet>
        <title>Artificial Intelligence Incident Database</title>
      </Helmet>
      <CustomModal style={{ maxWidth: '80%' }} {...editClassificationModal} />
      <Container isWide={collapse}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <TaxonomySelectContainer>
            Showing the
            <Form.Select
              style={{ width: 100, margin: '0 10px' }}
              aria-label="Default select example"
              onChange={(e) => setCurrentTaxonomy(e.target.value)}
            >
              {allTaxonomies.length > 0 &&
                allTaxonomies.map((taxa) => (
                  <option key={taxa.namespace} value={taxa.namespace}>
                    {taxa.namespace}
                  </option>
                ))}
            </Form.Select>
            taxonomy
            {loading && (
              <Spinner
                animation="border"
                role="status"
                variant="primary"
                style={{ marginLeft: 10 }}
              >
                <span className="sr-only">Loading...</span>
              </Spinner>
            )}
          </TaxonomySelectContainer>
          <Link to={`/taxonomy/${currentTaxonomy.toLowerCase()}`} style={{ paddingBottom: '1em' }}>
            {currentTaxonomy} taxonomy page
          </Link>
          <Button onClick={() => setAllFilters([])}>Reset filters</Button>
        </div>
        {!loading && (
          <TableStyles>
            <Table striped bordered hover {...getTableProps()}>
              <thead>
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th key={column.id} {...column.getHeaderProps()}>
                        <HeaderCellContainer
                          {...column.getHeaderProps(column.getSortByToggleProps())}
                          style={{ marginBottom: 5 }}
                        >
                          {column.render('Header')}
                          <span>
                            {column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}
                          </span>
                        </HeaderCellContainer>
                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map(RenderRow)}
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
                {[10, 20, 30, 40, 50, 100, 500].map((pageSize) => (
                  <option key={pageSize} value={pageSize}>
                    Show {pageSize}
                  </option>
                ))}
              </select>
            </div>
          </TableStyles>
        )}
      </Container>
      <CustomModal {...fullTextModal} />
    </LayoutHideSidebar>
  );
}
