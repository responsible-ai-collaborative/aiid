import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useApolloClient } from '@apollo/client';
import gql from 'graphql-tag';
import { FIND_CLASSIFICATION } from '../../graphql/classifications';
import { Button, Select, Spinner, Card, Badge } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { useUserContext } from 'contexts/UserContext';
import HeadContent from 'components/HeadContent';
import CrossTaxonomyChart from 'components/visualizations/CrossTaxonomyChart';
import GuidedAnalysisTab from 'components/visualizations/GuidedAnalysisTab';
import {
  groupClassificationsByIncident,
  getAvailableFields,
  buildCrossData,
  buildIncidentEntityMap,
} from 'utils/crossTaxonomy';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';

const TABS = [
  { id: 'developer', label: 'By Developer' },
  { id: 'deployer', label: 'By Deployer' },
  { id: 'affected', label: 'By Affected Group' },
  { id: 'technology', label: 'By Technology' },
  { id: 'custom', label: 'Custom Explorer' },
];

const GUIDED_TAB_CONFIGS = {
  developer: {
    selectorSource: 'entity',
    selectorEntityField: 'developers',
    selectorLabel: 'Select a Developer',
    charts: [
      {
        title: 'Sector of Deployment',
        subtitle: "Sectors where this developer's AI is deployed",
        namespace: 'CSETv1',
        field: 'Sector of Deployment',
        type: 'bar',
      },
      {
        title: 'Failure Modes',
        subtitle: 'Known technical failures in incidents',
        namespace: 'GMF',
        field: 'Known AI Technical Failure',
        type: 'bar',
      },
      {
        title: 'Affected Demographics',
        subtitle: 'Demographic groups disproportionately affected',
        namespace: 'CSETv1',
        field: 'Harm Distribution Basis',
        type: 'bar',
      },
      {
        title: 'Intent',
        subtitle: 'Whether harms were intentional or unintentional',
        namespace: 'MIT',
        field: 'Intent',
        type: 'donut',
      },
      {
        title: 'Risk Domains',
        subtitle: 'Risk categories from the MIT AI Risk Repository',
        namespace: 'MIT',
        field: 'Risk Domain',
        type: 'bar',
      },
    ],
  },
  deployer: {
    selectorSource: 'entity',
    selectorEntityField: 'deployers',
    selectorLabel: 'Select a Deployer',
    charts: [
      {
        title: 'AI Technologies Used',
        subtitle: 'Known AI technologies involved in incidents',
        namespace: 'GMF',
        field: 'Known AI Technology',
        type: 'bar',
      },
      {
        title: 'What Goes Wrong',
        subtitle: 'Technical failures in incidents involving this deployer',
        namespace: 'GMF',
        field: 'Known AI Technical Failure',
        type: 'bar',
      },
      {
        title: 'Who Is Affected',
        subtitle: 'Demographic groups impacted',
        namespace: 'CSETv1',
        field: 'Harm Distribution Basis',
        type: 'bar',
      },
      {
        title: 'Sector of Deployment',
        subtitle: 'Deployment sectors where incidents occurred',
        namespace: 'CSETv1',
        field: 'Sector of Deployment',
        type: 'bar',
      },
      {
        title: 'Risk Domains',
        subtitle: 'Risk categories from the MIT AI Risk Repository',
        namespace: 'MIT',
        field: 'Risk Domain',
        type: 'bar',
      },
    ],
  },
  affected: {
    selectorField: { namespace: 'CSETv1', short_name: 'Harm Distribution Basis' },
    selectorLabel: 'Select an Affected Group',
    charts: [
      {
        title: 'Which Sectors',
        subtitle: 'Deployment sectors associated with harm to this group',
        namespace: 'CSETv1',
        field: 'Sector of Deployment',
        type: 'bar',
      },
      {
        title: 'Which Technologies',
        subtitle: 'AI technologies involved in harm to this group',
        namespace: 'GMF',
        field: 'Known AI Technology',
        type: 'bar',
      },
      {
        title: 'Harm Domain',
        subtitle: 'Categories of harm experienced',
        namespace: 'CSETv1',
        field: 'Harm Domain',
        type: 'bar',
      },
      {
        title: 'Failure Modes',
        subtitle: 'Technical failures involved',
        namespace: 'GMF',
        field: 'Known AI Technical Failure',
        type: 'bar',
      },
      {
        title: 'Intentional vs Unintentional',
        subtitle: 'Whether harms were intentional',
        namespace: 'MIT',
        field: 'Intent',
        type: 'donut',
      },
    ],
  },
  technology: {
    selectorField: { namespace: 'GMF', short_name: 'Known AI Technology' },
    selectorLabel: 'Select a Technology',
    charts: [
      {
        title: 'Deployment Sectors',
        subtitle: 'Where this technology is deployed',
        namespace: 'CSETv1',
        field: 'Sector of Deployment',
        type: 'bar',
      },
      {
        title: 'Failure Modes',
        subtitle: 'Technical failures associated with this technology',
        namespace: 'GMF',
        field: 'Known AI Technical Failure',
        type: 'bar',
      },
      {
        title: 'Who Is Harmed',
        subtitle: 'Demographic groups affected',
        namespace: 'CSETv1',
        field: 'Harm Distribution Basis',
        type: 'bar',
      },
      {
        title: 'Risk Domains',
        subtitle: 'Risk categories from the MIT AI Risk Repository',
        namespace: 'MIT',
        field: 'Risk Domain',
        type: 'bar',
      },
      {
        title: 'Harm Domain',
        subtitle: 'Types of harm caused by this technology',
        namespace: 'CSETv1',
        field: 'Harm Domain',
        type: 'bar',
      },
    ],
  },
};

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'histogram', label: 'Stacked Bar Chart' },
  { value: 'line', label: 'Line Chart' },
  { value: 'scatter', label: 'Scatter Plot' },
];

const FIND_TAXA = gql`
  query FindTaxa {
    taxas {
      namespace
      weight
      description
      field_list {
        field_number
        short_name
        long_name
        display_type
        mongo_type
        permitted_values
        instant_facet
        public
      }
    }
  }
`;

const FIND_INCIDENTS_ENTITIES = gql`
  query FindIncidentsEntities {
    incidents(pagination: { limit: 9999, skip: 0 }) {
      incident_id
      AllegedDeveloperOfAISystem {
        entity_id
        name
      }
      AllegedDeployerOfAISystem {
        entity_id
        name
      }
      AllegedHarmedOrNearlyHarmedParties {
        entity_id
        name
      }
    }
  }
`;

export default function CrossTaxonomyPage(props) {
  const { isAdmin } = useUserContext();

  const { t } = useTranslation();

  const client = useApolloClient();

  const [loading, setLoading] = useState(true);

  const [allTaxas, setAllTaxas] = useState([]);

  const [allClassifications, setAllClassifications] = useState([]);

  const [incidentEntityMap, setIncidentEntityMap] = useState(new Map());

  // URL query params for all state
  const [query, setQuery] = useQueryParams({
    tab: withDefault(StringParam, ''),
    sel: withDefault(StringParam, ''),
    chartType: withDefault(StringParam, ''),
    x: withDefault(StringParam, ''),
    y: withDefault(StringParam, ''),
    filterField: withDefault(StringParam, ''),
    filterValue: withDefault(StringParam, ''),
  });

  const activeTab = query.tab || 'developer';

  const guidedSelection = query.sel || '';

  const chartType = query.chartType || 'bar';

  const xAxisKey = query.x || '';

  const yAxisKey = query.y || '';

  const filterKey = query.filterField || '';

  const filterValue = query.filterValue || '';

  const setActiveTab = useCallback(
    (tab) => setQuery({ tab: tab || undefined, sel: undefined }),
    [setQuery]
  );

  const setGuidedSelection = useCallback((v) => setQuery({ sel: v || undefined }), [setQuery]);

  const setChartType = useCallback((v) => setQuery({ chartType: v || undefined }), [setQuery]);

  const setXAxisKey = useCallback((v) => setQuery({ x: v || undefined }), [setQuery]);

  const setYAxisKey = useCallback((v) => setQuery({ y: v || undefined }), [setQuery]);

  const setFilterKey = useCallback(
    (v) => setQuery({ filterField: v || undefined, filterValue: undefined }),
    [setQuery]
  );

  const setFilterValue = useCallback((v) => setQuery({ filterValue: v || undefined }), [setQuery]);

  const copyShareLink = useCallback(() => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
  }, [query]);

  // Fetch all taxa and classifications on mount
  useEffect(() => {
    let cancelled = false;

    async function fetchData() {
      setLoading(true);
      try {
        const [taxaResult, classResult, incidentsResult] = await Promise.all([
          client.query({ query: FIND_TAXA }),
          client.query({ query: FIND_CLASSIFICATION, variables: { filter: {} } }),
          client.query({ query: FIND_INCIDENTS_ENTITIES }),
        ]);

        if (cancelled) return;

        let taxas = taxaResult.data.taxas;

        if (!isAdmin) {
          taxas = taxas.map((taxa) => ({
            ...taxa,
            field_list: taxa.field_list.filter((f) => f.public !== false),
          }));
        }

        const classifications = classResult.data.classifications.filter(
          (c) => c.attributes && (c.publish || isAdmin)
        );

        setAllTaxas(taxas);
        setAllClassifications(classifications);
        setIncidentEntityMap(buildIncidentEntityMap(incidentsResult.data.incidents || []));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchData();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  // Shared computed data
  const groupedClassifications = useMemo(
    () => groupClassificationsByIncident(allClassifications),
    [allClassifications]
  );

  const availableFields = useMemo(() => getAvailableFields(allTaxas), [allTaxas]);

  const fieldsByNamespace = useMemo(() => {
    const grouped = {};

    for (const f of availableFields) {
      if (!grouped[f.namespace]) grouped[f.namespace] = [];
      grouped[f.namespace].push(f);
    }
    return grouped;
  }, [availableFields]);

  // Custom explorer logic
  const parseKey = useCallback((key) => {
    if (!key) return { namespace: '', field: '' };
    const [namespace, ...rest] = key.split('::');

    return { namespace, field: rest.join('::') };
  }, []);

  const xAxis = parseKey(xAxisKey);

  const yAxis = parseKey(yAxisKey);

  const filter = parseKey(filterKey);

  const crossData = useMemo(() => {
    if (!xAxis.namespace || !yAxis.namespace) return null;
    return buildCrossData(
      groupedClassifications,
      xAxis.namespace,
      xAxis.field,
      yAxis.namespace,
      yAxis.field,
      filter.namespace || null,
      filter.field || null,
      filterValue || null
    );
  }, [groupedClassifications, xAxis, yAxis, filter, filterValue]);

  const filterOptions = useMemo(() => {
    if (!filter.namespace || !filter.field) return [];
    const values = new Set();

    for (const c of allClassifications) {
      if (c.namespace !== filter.namespace) continue;
      const attr = c.attributes?.find((a) => a.short_name === filter.field);

      if (!attr) continue;
      try {
        const parsed = JSON.parse(attr.value_json);

        if (Array.isArray(parsed)) {
          parsed.forEach((v) => v && values.add(String(v)));
        } else if (parsed !== null && parsed !== undefined && parsed !== '') {
          values.add(typeof parsed === 'boolean' ? (parsed ? 'Yes' : 'No') : String(parsed));
        }
      } catch {
        // skip unparseable
      }
    }
    return Array.from(values).sort();
  }, [allClassifications, filter]);

  const renderFieldSelect = (value, onChange, label) => (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Select value={value} onChange={(e) => onChange(e.target.value)} className="min-w-[220px]">
        <option value="">— {t('Select a field')} —</option>
        {Object.entries(fieldsByNamespace).map(([namespace, fields]) => (
          <optgroup key={namespace} label={namespace}>
            {fields.map((f) => (
              <option key={`${namespace}::${f.short_name}`} value={`${namespace}::${f.short_name}`}>
                {f.short_name}
              </option>
            ))}
          </optgroup>
        ))}
      </Select>
    </div>
  );

  const hasSelection = activeTab === 'custom' ? xAxisKey && yAxisKey : guidedSelection;

  return (
    <div {...props}>
      <div className="flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              <Trans>Cross-Taxonomy Visualizations</Trans>
            </h1>
            <p className="text-gray-600 mt-1">
              <Trans>
                Explore patterns in AI incidents across taxonomies. Pick a lens below or build a
                custom chart.
              </Trans>
            </p>
          </div>
          {hasSelection && (
            <Button color="light" size="sm" onClick={copyShareLink}>
              <Trans>Copy Share Link</Trans>
            </Button>
          )}
        </div>

        {loading && (
          <div className="flex items-center gap-2 py-8 justify-center">
            <Spinner size="lg" />
            <Trans>Loading taxonomy data...</Trans>
          </div>
        )}

        {!loading && (
          <>
            {/* Tab bar */}
            <div className="border-b border-gray-200">
              <nav className="flex flex-wrap -mb-px gap-0">
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {t(tab.label)}
                  </button>
                ))}
              </nav>
            </div>

            {/* Guided tabs */}
            {activeTab !== 'custom' && GUIDED_TAB_CONFIGS[activeTab] && (
              <GuidedAnalysisTab
                config={GUIDED_TAB_CONFIGS[activeTab]}
                selectedValue={guidedSelection}
                onSelectValue={setGuidedSelection}
                groupedClassifications={groupedClassifications}
                allClassifications={allClassifications}
                incidentEntityMap={incidentEntityMap}
              />
            )}

            {/* Custom explorer tab */}
            {activeTab === 'custom' && (
              <>
                <Card>
                  <div className="flex flex-wrap gap-4 items-end">
                    <div className="flex flex-col gap-1">
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label className="text-sm font-medium text-gray-700">
                        <Trans>Chart Type</Trans>
                      </label>
                      <Select
                        value={chartType}
                        onChange={(e) => setChartType(e.target.value)}
                        className="min-w-[180px]"
                      >
                        {CHART_TYPES.map((ct) => (
                          <option key={ct.value} value={ct.value}>
                            {t(ct.label)}
                          </option>
                        ))}
                      </Select>
                    </div>

                    {renderFieldSelect(xAxisKey, setXAxisKey, t('X-Axis Field'))}
                    {renderFieldSelect(yAxisKey, setYAxisKey, t('Y-Axis Field'))}
                  </div>

                  <div className="flex flex-wrap gap-4 items-end mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 self-center">
                      <Trans>Optional Filter:</Trans>
                    </div>
                    {renderFieldSelect(filterKey, setFilterKey, t('Filter Field'))}

                    {filterKey && (
                      <div className="flex flex-col gap-1">
                        {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                        <label className="text-sm font-medium text-gray-700">
                          <Trans>Filter Value</Trans>
                        </label>
                        <Select
                          value={filterValue}
                          onChange={(e) => setFilterValue(e.target.value)}
                          className="min-w-[200px]"
                        >
                          <option value="">— {t('All')} —</option>
                          {filterOptions.map((v) => (
                            <option key={v} value={v}>
                              {v}
                            </option>
                          ))}
                        </Select>
                      </div>
                    )}

                    {(filterKey || filterValue) && (
                      <Button
                        color="gray"
                        size="sm"
                        onClick={() => {
                          setFilterKey('');
                          setFilterValue('');
                        }}
                      >
                        <Trans>Clear Filter</Trans>
                      </Button>
                    )}
                  </div>
                </Card>

                {crossData && (
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="font-semibold text-lg text-gray-900">
                        N = {crossData.incidentCount}
                      </span>
                      <Trans>incidents with data for both selected fields</Trans>
                      {filterValue && (
                        <Badge color="info">
                          {filter.field} = &quot;{filterValue}&quot;
                        </Badge>
                      )}
                    </div>

                    {crossData.incidentCount < 5 && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
                        <Trans>
                          Warning: Only {{ count: crossData.incidentCount }} incidents have
                          classifications for both selected fields. Results may not be
                          representative.
                        </Trans>
                      </div>
                    )}

                    {crossData.incidentCount === 0 ? (
                      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                        <Trans>
                          No incidents found with classifications in both selected fields. Try
                          selecting fields from the same taxonomy or more commonly used fields.
                        </Trans>
                      </div>
                    ) : (
                      <Card>
                        <CrossTaxonomyChart
                          chartType={chartType}
                          crossData={crossData}
                          xLabel={xAxis.field}
                          yLabel={yAxis.field}
                        />
                      </Card>
                    )}
                  </div>
                )}

                {!crossData && !xAxisKey && !yAxisKey && (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
                    <Trans>Select fields for both axes above to generate a visualization.</Trans>
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  return (
    <HeadContent
      path={pathname}
      metaTitle="Cross-Taxonomy Visualizations"
      metaDescription="Visualize relationships between AI incident classification fields across different taxonomies."
    />
  );
};
