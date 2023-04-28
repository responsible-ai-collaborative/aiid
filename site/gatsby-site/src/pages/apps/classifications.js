import React, { useState, useEffect } from 'react';
import AiidHelmet from '../../components/AiidHelmet';
import { useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import { FIND_CLASSIFICATION } from '../../graphql/classifications';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import { Button, Select, Spinner } from 'flowbite-react';
import Link from '../../components/ui/Link';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useModal, CustomModal } from '../../hooks/useModal';
import { useUserContext } from '../../contexts/userContext';
import Layout from 'components/Layout';
import ListSkeleton from 'elements/Skeletons/List';
import { Modal } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  formatDateField,
  SelectDatePickerFilter,
} from 'components/ui/Table';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_EMPTY_CELL_DATA = '-';

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
    <Select
      style={{ minWidth: 100 }}
      value={filterValue}
      onChange={(e) => {
        setFilter(e.target.value || undefined);
      }}
      className="mt-2"
    >
      <option
        value=""
        onClick={() => {
          setFilter('');
        }}
      >
        <Trans>All</Trans>
      </option>
      {filteredOptions.map((option, i) => (
        <option key={i} value={option}>
          {option}
        </option>
      ))}
    </Select>
  );
};

export default function ClassificationsDbView(props) {
  const { isAdmin } = useUserContext();

  const [loading, setLoading] = useState(false);

  const [collapse, setCollapse] = useState(true);

  const [allTaxonomies, setAllTaxonomies] = useState([]);

  const [tableData, setTableData] = useState([]);

  const [columnData, setColumnData] = useState([]);

  const [currentTaxonomy, setCurrentTaxonomy] = useState('');

  const [showModal, setShowModal] = useState(false);

  const [modalContent, setModalContent] = useState({ title: '', content: '' });

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
        id: uuidv4(),
        title: t(taxaField.short_name),
        accessor: taxaField.short_name.split(' ').join(''),
      };

      if (selectFilterTypes.includes(taxaField.display_type)) {
        column.Filter = SelectColumnFilter;
        column.filter = 'includes';
      }

      if (taxaField.display_type === 'date') {
        column.Filter = SelectDatePickerFilter;
        column.filter = taxaField.short_name.split(' ').join('');
        column.Cell = function DateCell({ column: { id }, row: { values } }) {
          return <>{formatDateField(values[id])}</>;
        };
      }

      if (taxaField.display_type === 'string') {
        column.className = 'min-w-[400px]';
        column.Cell = function StringCell({ column: { id }, row: { values } }) {
          return (
            <div className="max-w-[400px] flex flex-col items-start">
              <div className="line-clamp-4 text-ellipsis" style={{ whiteSpace: 'break-spaces' }}>
                {values[id]}
              </div>
              {values[id]?.length > 130 && (
                <FontAwesomeIcon
                  onClick={() => {
                    setShowModal(true);
                    setModalContent({
                      title: column.title,
                      content: values[id],
                    });
                  }}
                  icon={faExpandAlt}
                  className="fas fa-expand-arrows-alt cursor-pointer"
                />
              )}
            </div>
          );
        };
      }

      return column;
    };

    const taxaData = allTaxonomies.filter((taxa) => taxa.namespace === currentTaxonomy);

    if (taxaData.length === 0) {
      setLoading(false);
      return;
    }

    const incidentIdColumn = {
      title: t('Incident ID'),
      accessor: 'IncidentId',
      Cell: ({ row: { values } }) => (
        <a className="flex" href={`/cite/${values.IncidentId}`}>
          Incident {values.IncidentId}
        </a>
      ),
    };

    const actionsColumn = {
      title: t('Actions'),
      accessor: 'actions',
      disableFilters: true,
      disableSortBy: true,
      Cell: ({ row: { values } }) => (
        <a
          target="_blank"
          href={
            isAdmin ? `/cite/${values.IncidentId}/?edit_taxonomy=${currentTaxonomy}` : undefined
          }
          rel="noreferrer"
        >
          <Button
            color={'gray'}
            data-cy="edit-classification"
            className="me-auto"
            disabled={!isAdmin}
          >
            <Trans>Edit</Trans>
          </Button>
        </a>
      ),
    };

    setColumnData([
      incidentIdColumn,
      ...taxaData[0].field_list.map(fieldToColumnMap),
      actionsColumn,
    ]);

    let rowQuery = {
      namespace: currentTaxonomy,
    };

    const classificationData = await fetchClassificationData(rowQuery);

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
      Header: DefaultColumnHeader,
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

  const table = useTable(
    {
      columns,
      data,
      defaultColumn,
      filterTypes,
      initialState: {
        pageIndex: 0,
        pageSize: 500,
      },
    },
    useFilters,
    useSortBy,
    usePagination
  );

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
      <div
        className={`p-0 md:p-[auto] my-0 mx-[auto] overflow-auto whitespace-nowrap text=[0.8em] ${
          collapse ? 'max-w-[100vw] py-0 pr-0 pl-11' : 'max-w-[calc(100vw-298px)]'
        }`}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div className="py-4 pr-4 pl-0 text-base flex flex-row items-center gap-2">
            <Trans>Showing the</Trans>
            <Select
              style={{ width: 120 }}
              onChange={(e) => setCurrentTaxonomy(e.target.value)}
              value={currentTaxonomy}
              data-cy="taxonomy"
            >
              {allTaxonomies.map((taxa) => {
                return (
                  <option key={taxa.namespace} value={taxa.namespace}>
                    {taxa.namespace}
                  </option>
                );
              })}
            </Select>
            <Trans>taxonomy</Trans>
            {loading && <Spinner />}
          </div>
          <Link to={`/taxonomy/${currentTaxonomy.toLowerCase()}`} style={{ paddingBottom: '1em' }}>
            <Trans>{{ currentTaxonomy }} taxonomy page</Trans>
          </Link>
          <Button onClick={() => table.setAllFilters([])}>
            <Trans>Reset filters</Trans>
          </Button>
        </div>
        {loading && <ListSkeleton />}
        {!loading && (
          <div>
            <Table table={table} />
            {/* <Table striped={true} hoverable={true} {...getTableProps()}>
              {headerGroups.map((headerGroup) => (
                <Table.Head key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <Table.HeadCell key={column.id} {...column.getHeaderProps()}>
                      <div
                        className="flex flex-col"
                        {...column.getHeaderProps(column.getSortByToggleProps())}
                        style={{ marginBottom: 5 }}
                      >
                        {column.render('Header')}
                        <span>{column.isSorted ? (column.isSortedDesc ? ' 🔽' : ' 🔼') : ''}</span>
                      </div>
                      <div>{column.canFilter ? column.render('Filter') : null}</div>
                    </Table.HeadCell>
                  ))}
                </Table.Head>
              ))}
              <Table.Body {...getTableBodyProps()}>
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
                  <Table.Row>
                    <Table.Cell colSpan={10}>
                      <div>
                        <span>
                          <Trans>No results found</Trans>
                        </span>
                      </div>
                    </Table.Cell>
                  </Table.Row>
                )}
              </Table.Body>
            </Table> */}

            {/* <div className="flex items-center gap-2">
              {pageCount > 1 && (
                <>
                  <Pagination
                    className="incidents-pagination mb-0"
                    onPageChange={(page) => {
                      gotoPage(page - 1);
                    }}
                    currentPage={pageIndex + 1}
                    showIcons={true}
                    totalPages={pageCount}
                  />
                  <div className="mt-2">
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
                  </div>
                </>
              )}
              <div className="mt-2">
                <Dropdown
                  color={'gray'}
                  label={t(pageSize === 9999 ? 'Show all' : `Show ${pageSize}`)}
                  style={{ width: 120 }}
                  size="sm"
                  value={pageSize}
                >
                  {[10, 20, 30, 40, 50, 100, 500, 9999].map((pageSize) => (
                    <Dropdown.Item
                      key={pageSize}
                      onClick={() => {
                        setPageSize(Number(pageSize));
                      }}
                    >
                      {pageSize === 9999 ? (
                        <Trans>Show all</Trans>
                      ) : (
                        <Trans>Show {{ pageSize }}</Trans>
                      )}
                    </Dropdown.Item>
                  ))}
                </Dropdown>
              </div>
            </div> */}
          </div>
        )}
      </div>
      <CustomModal {...fullTextModal} />

      {showModal && (
        <Modal
          show={showModal}
          onClose={() => {
            setShowModal(false);
            setModalContent({ title: '', content: '' });
          }}
        >
          <Modal.Header>{modalContent.title}</Modal.Header>
          <Modal.Body>{modalContent.content}</Modal.Body>
        </Modal>
      )}
    </Layout>
  );
}
