import React, { useState, useEffect } from 'react';
import AiidHelmet from '../../components/AiidHelmet';
import { useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import { FIND_CLASSIFICATION } from '../../graphql/classifications';
import { useTable, useFilters, usePagination, useSortBy } from 'react-table';
import { Button, Dropdown, Pagination, Select, Spinner } from 'flowbite-react';
import Link from '../../components/ui/Link';
import { useModal, CustomModal } from '../../hooks/useModal';
import { useUserContext } from '../../contexts/userContext';
import Layout from 'components/Layout';
import ListSkeleton from 'elements/Skeletons/List';
import { Trans, useTranslation } from 'react-i18next';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  formatDateField,
  SelectColumnFilter,
  SelectDatePickerFilter,
} from 'components/ui/Table';

const DEFAULT_EMPTY_CELL_DATA = '-';

export default function ClassificationsDbView(props) {
  const { isAdmin } = useUserContext();

  const [loading, setLoading] = useState(false);

  const [collapse, setCollapse] = useState(true);

  const [allTaxonomies, setAllTaxonomies] = useState([]);

  const [tableData, setTableData] = useState([]);

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

    const taxaData = allTaxonomies.filter((taxa) => taxa.namespace === currentTaxonomy);

    if (taxaData.length === 0) {
      setLoading(false);
      return;
    }

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

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const columns = React.useMemo(() => {
    const columns = [
      {
        title: t('Incident ID'),
        accessor: 'IncidentId',
        Cell: ({ row: { values } }) => (
          <a className="flex" href={`/cite/${values.IncidentId}`}>
            Incident {values.IncidentId}
          </a>
        ),
      },
      {
        className: 'min-w-[240px]',
        title: t('Annotator'),
        accessor: 'Annotator',
        Filter: SelectColumnFilter,
      },
      {
        className: 'min-w-[240px]',
        title: t('Annotation Status'),
        accessor: 'AnnotationStatus',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Reviewer'),
        accessor: 'Reviewer',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Quality Control'),
        accessor: 'QualityControl',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Full Description'),
        accessor: 'FullDescription',
        className: 'min-w-[400px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.FullDescription}
          </div>
        ),
      },
      {
        title: t('Short Description'),
        accessor: 'ShortDescription',
        className: 'min-w-[400px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.ShortDescription}
          </div>
        ),
      },
      {
        title: t('Beginning Date'),
        accessor: 'BeginningDate',
        Filter: SelectDatePickerFilter,
        Cell: ({ row: { values } }) => {
          return <>{formatDateField(values.BeginningDate)}</>;
        },
      },
      {
        title: t('Ending Date'),
        accessor: 'EndingDate',
        Filter: SelectDatePickerFilter,
        Cell: ({ row: { values } }) => {
          return <>{formatDateField(values.EndingDate)}</>;
        },
      },
      {
        title: t('Location'),
        accessor: 'Location',
        className: 'min-w-[200px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">{values.Location}</div>
        ),
      },
      {
        title: t('Near Miss'),
        accessor: 'NearMiss',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Named Entities'),
        accessor: 'NamedEntities',
        Filter: SelectColumnFilter,
        className: 'min-w-[200px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.NamedEntities}
          </div>
        ),
      },
      {
        title: t('Technology Purveyor'),
        accessor: 'TechnologyPurveyor',
        Filter: SelectColumnFilter,
        className: 'min-w-[200px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.TechnologyPurveyor}
          </div>
        ),
      },
      {
        title: t('Intent'),
        accessor: 'Intent',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Severity'),
        accessor: 'Severity',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Harm Type'),
        accessor: 'HarmType',
        Filter: SelectColumnFilter,
        className: 'min-w-[200px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">{values.HarmType}</div>
        ),
      },
      {
        title: t('Lives Lost'),
        accessor: 'LivesLost',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Harm Distribution Basis'),
        accessor: 'HarmDistributionBasis',
        Filter: SelectColumnFilter,
        className: 'min-w-[200px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.HarmDistributionBasis}
          </div>
        ),
      },
      {
        title: t('Infrastructure Sectors'),
        accessor: 'InfrastructureSectors',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Financial Cost'),
        accessor: 'FinancialCost',
        className: 'min-w-[200px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.FinancialCost}
          </div>
        ),
      },
      {
        title: t('Laws Implicated'),
        accessor: 'LawsImplicated',
        Filter: SelectColumnFilter,
        className: 'min-w-[200px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.LawsImplicated}
          </div>
        ),
      },
      {
        title: t('AI Sytem Description'),
        accessor: 'AISystemDescription',
        className: 'min-w-[400px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.AISystemDescription}
          </div>
        ),
      },
      {
        title: t('Data Inputs'),
        accessor: 'DataInputs',
        Filter: SelectColumnFilter,
        className: 'min-w-[200px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">{values.DataInputs}</div>
        ),
      },
      {
        title: t('System Developer'),
        accessor: 'SystemDeveloper',
        Filter: SelectColumnFilter,
        className: 'min-w-[100px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.SystemDeveloper}
          </div>
        ),
      },
      {
        title: t('Sector Of Deployment'),
        accessor: 'SectorofDeployment',
        Filter: SelectColumnFilter,
        className: 'min-w-[100px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.SectorofDeployment}
          </div>
        ),
      },
      {
        title: t('Public Sector Deployment'),
        accessor: 'PublicSectorDeployment',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Nature of End User'),
        accessor: 'NatureofEndUser',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Level of Autonomy'),
        accessor: 'LevelofAutonomy',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Relevant AI Functions'),
        accessor: 'RelevantAIFunctions',
        Filter: SelectColumnFilter,
      },
      {
        title: t('AI Techniques'),
        accessor: 'AITechniques',
        Filter: SelectColumnFilter,
        className: 'min-w-[300px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.AITechniques}
          </div>
        ),
      },
      {
        title: t('AI Applications'),
        accessor: 'AIApplications',
        Filter: SelectColumnFilter,
        className: 'min-w-[300px]',
        Cell: ({ row: { values } }) => (
          <div className="overflow-hidden whitespace-pre-wrap break-words">
            {values.AIApplications}
          </div>
        ),
      },
      {
        title: t('Physical System'),
        accessor: 'PhysicalSystem',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Problem Nature'),
        accessor: 'ProblemNature',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Publish'),
        accessor: 'Publish',
        Filter: SelectColumnFilter,
      },
      {
        title: t('Actions'),
        id: 'actions',
        className: 'min-w-[120px]',
        Cell: () => (
          <Button
            color={'gray'}
            data-cy="edit-classification"
            // onClick={() => setShow('edit')}
            // onClick={() => {() => setClassificationIdToEdit(values.id)}}
          >
            <Trans>Edit</Trans>
          </Button>
        ),
      },
    ];

    return columns;
  }, []);

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

  const { pageOptions, pageCount, gotoPage, setPageSize, setAllFilters, state } = useTable(
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

  const table = useTable(
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
          <Button onClick={() => setAllFilters([])}>
            <Trans>Reset filters</Trans>
          </Button>
        </div>
        {loading && <ListSkeleton />}
        {!loading && (
          <div>
            <Table table={table} />

            <div className="flex items-center gap-2">
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
            </div>
          </div>
        )}
      </div>
      <CustomModal {...fullTextModal} />
    </Layout>
  );
}
