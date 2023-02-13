import React, { useState, useEffect } from 'react';
import AiidHelmet from '../../components/AiidHelmet';
import styled from 'styled-components';
import { useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import { FIND_CLASSIFICATION } from '../../graphql/classifications';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import { Table, Form, InputGroup, FormControl, Button } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import Link from '../../components/ui/Link';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal, CustomModal } from '../../hooks/useModal';
import { useUserContext } from '../../contexts/userContext';
import DateRangePicker from 'react-bootstrap-daterangepicker';
import { format } from 'date-fns';
import Layout from 'components/Layout';
import ListSkeleton from 'elements/Skeletons/List';
import { Modal } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';

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

  const { t } = useTranslation();

  return (
    <InputGroup>
      <FormControl
        style={{ minWidth: 100 }}
        value={filterValue || ''}
        onChange={(e) => {
          e.preventDefault();
          setFilter(e.target.value || undefined);
        }}
        placeholder={t(`Search {{count}} records...`, { count: count })}
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
          let valuesCollection = Array.isArray(row.values[id])
            ? row.values[id]
            : row.values[id].split('; ');

          valuesCollection.forEach((s) => {
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

  const filteredOptions = [
    ...new Set(
      options
        .filter((o) => o && String(o).replace(/\s/g, '').length > 0 && o !== '-')
        .map((o) => String(o).trim())
    ),
  ].sort((a, b) => (String(a).toLowerCase() >= String(b).toLowerCase() ? 1 : -1));

  return (
    <Form.Select
      style={{ minWidth: 100 }}
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
    >
      <option value="">
        <Trans>All</Trans>
      </option>
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

const formatDateField = (s) => {
  const dateObj = new Date(s.props.cell.value);

  if (dateObj instanceof Date && !isNaN(dateObj)) {
    return <>{format(new Date(dateObj), 'yyyy-MM-dd')}</>;
  } else {
    return <>{s.props.cell.value}</>;
  }
};

function Row({ row, isAdmin, currentTaxonomy }) {
  const [show, setShow] = useState(null);

  const { t } = useTranslation();

  return (
    <tr key={row.id} {...row.getRowProps()}>
      {row.cells.map((cell) => {
        if (cell.column.Header.includes(t('Incident ID'))) {
          return (
            <td key={cell.id} {...cell.getCellProps()}>
              <ScrollCell>
                <Link to={`/cite/${cell.value}/#taxa-area`}>
                  <Trans>Incident</Trans> {cell.render('Cell')}
                </Link>
              </ScrollCell>
            </td>
          );
        } else if (cell.column.Header.includes(t('Actions'))) {
          return (
            <td key={cell.id} {...cell.getCellProps()}>
              <a
                target="_blank"
                href={
                  isAdmin
                    ? `/cite/${row.values.IncidentId}/?edit_taxonomy=${currentTaxonomy}`
                    : undefined
                }
                rel="noreferrer"
              >
                <Button
                  data-cy="edit-classification"
                  className="me-auto"
                  disabled={!isAdmin}
                  onClick={() => setShow('edit')}
                >
                  <FontAwesomeIcon icon={faEdit} className="fas fa-edit" />
                </Button>
              </a>
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
                  onClick={() => setShow(cell.value)}
                  icon={faExpandAlt}
                  className="fas fa-expand-arrows-alt"
                />

                <Modal
                  show={show === cell.value}
                  onClose={() => setShow(null)}
                  className="submission-modal"
                >
                  <Modal.Header>{cell.column.Header}</Modal.Header>
                  <Modal.Body>{cell.value}</Modal.Body>
                </Modal>
              </ModalCell>
            </td>
          );
        } else {
          return (
            <td key={cell.id} {...cell.getCellProps()}>
              <ScrollCell>
                {((value) => (Array.isArray(value) ? value.join(', ') : value))(
                  cell.render('Cell').props.cell.value
                )}
              </ScrollCell>
            </td>
          );
        }
      })}
    </tr>
  );
}

export default function ClassificationsDbView(props) {
  const { isAdmin } = useUserContext();

  const [loading, setLoading] = useState(false);

  const [collapse, setCollapse] = useState(true);

  const [allTaxonomies, setAllTaxonomies] = useState([]);

  const [allClassifications, setAllClassifications] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [columnData, setColumnData] = useState([]);

  const [currentTaxonomy, setCurrentTaxonomy] = useState('');

  const [currentFilters, setCurrentFilters] = useState([]);

  const [currentSorting, setCurrentSorting] = useState([]);

  const { t } = useTranslation();

  const client = useApolloClient();

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

  const fetchClassificationData = async (query) => {
    const classificationsData = await client.query({
      query: FIND_CLASSIFICATION,
      variables: query,
    });

    // For now we convert the list of attributes into a classifications object
    // to work with old code.
    const classifications = [];

    for (const c of classificationsData.data.classifications) {
      if (c.attributes && c.publish) {
        classifications.push({
          ...c,
          classifications: c.attributes.reduce((classifications, attribute) => {
            classifications[attribute.short_name] = JSON.parse(attribute.value_json);
            return classifications;
          }, {}),
        });
      }
    }
    return classifications;
  };

  const fetchTaxaData = async () => {
    const taxaData = await client.query({
      query: gql`
        query FindTaxa {
          taxas {
            namespace
            weight
            description
            field_list {
              field_number
              short_name
              long_name
              short_description
              long_description
              display_type
              mongo_type
              default
              placeholder
              permitted_values
              weight
              instant_facet
              required
              public
            }
          }
        }
      `,
    });

    return taxaData.data.taxas;
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

      tableData = classifications
        .map(classificationsToRowsMap) // should be first map function
        .map(classificationFormatBoolean)
        .map(replaceEmptyValuesMap);

      return tableData;
    };

    const fieldToColumnMap = (taxaField) => {
      const selectFilterTypes = ['multi', 'list', 'enum', 'bool'];

      const column = {
        Header: t(taxaField.short_name),
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
      Header: t('Incident ID'),
      accessor: 'IncidentId',
    };

    const actionsColumn = {
      Header: t('Actions'),
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
    state,
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 500,
        filters: currentFilters,
        sortBy: currentSorting,
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );

  const { pageIndex, pageSize, filters, sortBy } = state;

  useEffect(() => {
    setCurrentFilters(filters);
  }, [filters]);

  useEffect(() => {
    setCurrentSorting(sortBy);
  }, [sortBy]);

  const fullTextModal = useModal();

  return (
    <Layout
      {...props}
      menuCollapseCallback={(collapseFlag) => setCollapse(collapseFlag)}
      sidebarCollapsed={true}
    >
      <AiidHelmet path={props.location.pathname}>
        <title>Artificial Intelligence Incident Database</title>
      </AiidHelmet>
      <Container isWide={collapse}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <TaxonomySelectContainer className="gap-2">
            <Trans>Showing the</Trans>
            <Form.Select
              style={{ width: 120 }}
              onChange={(e) => setCurrentTaxonomy(e.target.value)}
              value={currentTaxonomy}
              data-cy="taxonomy"
            >
              {allTaxonomies.map((taxa) => (
                <option key={taxa.namespace} value={taxa.namespace}>
                  {taxa.namespace}
                </option>
              ))}
            </Form.Select>
            <Trans>taxonomy</Trans>
            {loading && <Spinner />}
          </TaxonomySelectContainer>
          <Link to={`/taxonomy/${currentTaxonomy.toLowerCase()}`} style={{ paddingBottom: '1em' }}>
            <Trans>{{ currentTaxonomy }} taxonomy page</Trans>
          </Link>
          <Button onClick={() => setAllFilters([])}>
            <Trans>Reset filters</Trans>
          </Button>
        </div>
        {loading && <ListSkeleton />}
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
                {page.map((row) => {
                  prepareRow(row);

                  return (
                    <Row
                      key={row.id}
                      row={row}
                      allClassifications={allClassifications}
                      allTaxonomies={allTaxonomies}
                      isAdmin={isAdmin}
                      currentTaxonomy={currentTaxonomy}
                    />
                  );
                })}

                {page.length === 0 && (
                  <tr>
                    <th colSpan={10}>
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
                <Trans
                  i18nKey="paginationKey"
                  defaults="Page <bold>{{currentPageIndex}} of {{pageOptionsLength}}</bold>"
                  values={{
                    currentPageIndex: pageIndex + 1,
                    pageOptionsLength: pageOptions.length,
                  }}
                  components={{ bold: <strong /> }}
                />
              </span>
              <span>
                | <Trans>Go to page:</Trans>{' '}
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
                    <Trans>Show {{ pageSize }}</Trans>
                  </option>
                ))}
              </select>
            </div>
          </TableStyles>
        )}
      </Container>
      <CustomModal {...fullTextModal} />
    </Layout>
  );
}
