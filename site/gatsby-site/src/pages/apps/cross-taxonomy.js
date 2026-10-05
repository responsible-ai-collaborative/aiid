import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { graphql } from 'gatsby';
import { Button, Card, Badge } from 'flowbite-react';
import SearchableSelect from 'components/visualizations/SearchableSelect';
import { Trans, useTranslation } from 'react-i18next';
import HeadContent from 'components/HeadContent';
import CrossTaxonomyChart from 'components/visualizations/CrossTaxonomyChart';
import GuidedAnalysisTab from 'components/visualizations/GuidedAnalysisTab';
import {
  groupClassificationsByIncident,
  getAvailableFields,
  buildCrossData,
  buildIncidentEntityMap,
  getFieldValues,
  parseKey,
} from 'utils/crossTaxonomy';
import {
  transformTaxas,
  transformClassifications,
  transformIncidents,
  buildTimeTaxa,
  buildTimeClassifications,
} from 'utils/crossTaxonomyStatic';

// The 8 query params this page reads/writes. All are plain strings; '' means absent.
const QUERY_PARAM_KEYS = [
  'tab',
  'sel',
  'mode',
  'chartType',
  'x',
  'y',
  'filterField',
  'filterValue',
];

// URL param state via history.pushState instead of use-query-params.
// The site's QueryParamProvider goes through navigate(), which makes Gatsby
// re-fetch this page's (large) page-data.json on every param change. pushState
// keeps the same URLs and history behavior without touching the router.
function useUrlQueryState() {
  // Empty on first render so SSR and client markup match.
  const emptyQuery = useMemo(() => Object.fromEntries(QUERY_PARAM_KEYS.map((k) => [k, ''])), []);

  const [query, setQueryState] = useState(emptyQuery);

  // Latest value, readable synchronously from setQuery.
  const queryRef = useRef(emptyQuery);

  const readFromLocation = useCallback(() => {
    const params = new URLSearchParams(window.location.search);

    return Object.fromEntries(QUERY_PARAM_KEYS.map((k) => [k, params.get(k) || '']));
  }, []);

  useEffect(() => {
    const apply = () => {
      const q = readFromLocation();

      queryRef.current = q;
      setQueryState(q);
    };

    apply();

    // Re-read on back/forward.
    window.addEventListener('popstate', apply);
    return () => window.removeEventListener('popstate', apply);
  }, [readFromLocation]);

  // Partial merge; empty values drop the key. Keys sorted for stable URLs.
  const setQuery = useCallback((partial) => {
    const next = { ...queryRef.current };

    for (const [k, v] of Object.entries(partial)) next[k] = v || '';

    const pairs = QUERY_PARAM_KEYS.filter((k) => next[k])
      .sort()
      .map((k) => `${encodeURIComponent(k)}=${encodeURIComponent(next[k])}`);

    const url = window.location.pathname + (pairs.length ? `?${pairs.join('&')}` : '');

    if (url !== window.location.pathname + window.location.search) {
      window.history.pushState(window.history.state, '', url);
    }

    queryRef.current = next;
    setQueryState(next);
  }, []);

  return [query, setQuery];
}

const TABS = [
  { id: 'developer', label: 'By Developer' },
  { id: 'deployer', label: 'By Deployer' },
  { id: 'technology', label: 'By Technology' },
  { id: 'affected', label: 'By Affected' },
  { id: 'custom', label: 'Custom Explorer' },
];

// Shared chart lineup for the "By Affected" tab. Both the demographic-basis
// (classification path) and named-groups (entity path) modes count these same target
// fields, so the lineup is defined once and reused by each mode.
const AFFECTED_CHARTS = [
  {
    title: 'Sector of Deployment',
    subtitle: 'Sectors where this group was affected',
    namespace: 'CSETv1',
    field: 'Sector of Deployment',
    type: 'bar',
  },
  {
    title: 'AI Technologies Involved',
    subtitle: 'Technologies used in incidents affecting this group',
    namespace: 'GMF',
    field: 'Known AI Technology',
    type: 'bar',
  },
  {
    title: 'Failure Modes',
    subtitle: 'Technical failures causing harm to this group',
    namespace: 'GMF',
    field: 'Known AI Technical Failure',
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
    title: 'Risk Domains',
    subtitle: 'Risk categories from the MIT AI Risk Repository',
    namespace: 'MIT',
    field: 'Risk Domain',
    type: 'bar',
  },
  {
    title: 'Intent',
    subtitle: 'Whether harms to this group were intentional or unintentional',
    namespace: 'MIT',
    field: 'Intent',
    type: 'donut',
  },
  {
    title: 'Incidents Over Time',
    subtitle: 'Number of incidents per year',
    namespace: 'Time',
    field: 'Year',
    type: 'bar',
    sortBy: 'key',
  },
];

// In named-groups mode the demographic basis is no longer the selector, so surface it as
// an extra chart to show which demographics were affected within the selected group.
const AFFECTED_DEMOGRAPHICS_CHART = {
  title: 'Affected Demographics',
  subtitle: 'Demographic groups disproportionately affected within this group',
  namespace: 'CSETv1',
  field: 'Harm Distribution Basis',
  type: 'bar',
};

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
      {
        title: 'Incidents Over Time',
        subtitle: 'Number of incidents per year',
        namespace: 'Time',
        field: 'Year',
        type: 'bar',
        sortBy: 'key',
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
      {
        title: 'Incidents Over Time',
        subtitle: 'Number of incidents per year',
        namespace: 'Time',
        field: 'Year',
        type: 'bar',
        sortBy: 'key',
      },
    ],
  },
  // Single tab, two selector modes: CSETv1 demographic basis vs. named
  // harmed-party entities. Shared chart lineup.
  affected: {
    selectorLabel: 'By Affected',
    modes: [
      {
        modeLabel: 'Demographic basis',
        selectorField: { namespace: 'CSETv1', short_name: 'Harm Distribution Basis' },
        selectorLabel: 'Select a demographic basis',
      },
      {
        modeLabel: 'Named groups',
        selectorSource: 'entity',
        selectorEntityField: 'harmedParties',
        selectorLabel: 'Select a harmed party',
        charts: [AFFECTED_DEMOGRAPHICS_CHART, ...AFFECTED_CHARTS],
      },
    ],
    charts: AFFECTED_CHARTS,
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
      {
        title: 'Incidents Over Time',
        subtitle: 'Number of incidents per year',
        namespace: 'Time',
        field: 'Year',
        type: 'bar',
        sortBy: 'key',
      },
    ],
  },
};

const CHART_TYPES = [
  { value: 'bar', label: 'Bar Chart' },
  { value: 'histogram', label: 'Stacked Bar Chart' },
  { value: 'line', label: 'Line Chart' },
];

// ---------------------------------------------------------------------------
// ExplorerPanel: one self-contained controls + chart unit.
// The first panel on the page wires its callbacks to URL params so the chart
// state is shareable. Extra panels use plain local state passed in from the
// parent via the same prop interface.
// ---------------------------------------------------------------------------
function ExplorerPanel({
  chartType,
  onChartTypeChange,
  xAxisKey,
  onXAxisChange,
  yAxisKey,
  onYAxisChange,
  filterKey,
  onFilterKeyChange,
  filterValue,
  onFilterValueChange,
  onRemove,
  groupedClassifications,
  allClassifications,
  fieldSelectOptions,
  totalIncidents,
}) {
  const { t } = useTranslation();

  // parseKey returns a new object each call; memoize so the crossData /
  // filterOptions memos below keep stable deps.
  const xAxis = useMemo(() => parseKey(xAxisKey), [xAxisKey]);

  const yAxis = useMemo(() => parseKey(yAxisKey), [yAxisKey]);

  const filter = useMemo(() => parseKey(filterKey), [filterKey]);

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
    return getFieldValues(allClassifications, filter.namespace, filter.field).map(
      ({ value }) => value
    );
  }, [allClassifications, filter]);

  const handleXAxisChange = useCallback(
    (v) => {
      onXAxisChange(v);
      if (parseKey(v).namespace === 'Time') onChartTypeChange('line');
    },
    [onXAxisChange, onChartTypeChange]
  );

  const renderFieldSelect = (value, onChange, label) => (
    <div className="flex flex-col gap-1">
      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <SearchableSelect
        options={fieldSelectOptions}
        value={value}
        onChange={onChange}
        placeholder={`— ${t('Search or select')} —`}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      <Card>
        {/* Remove button: only shown on extra panels */}
        {onRemove && (
          <div className="flex justify-end -mt-1 -mb-2">
            <button
              type="button"
              onClick={onRemove}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trans>Remove graph</Trans>
            </button>
          </div>
        )}

        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="text-sm font-medium text-gray-700">
              <Trans>Chart Type</Trans>
            </label>
            <SearchableSelect
              options={CHART_TYPES.map((ct) => ({ value: ct.value, label: t(ct.label) }))}
              value={chartType}
              onChange={onChartTypeChange}
              placeholder={`— ${t('Select type')} —`}
            />
          </div>

          {renderFieldSelect(xAxisKey, handleXAxisChange, t('X-Axis Field'))}
          {renderFieldSelect(yAxisKey, onYAxisChange, t('Y-Axis Field'))}
        </div>

        <div className="flex flex-wrap gap-4 items-end mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 self-center">
            <Trans>Optional Filter:</Trans>
          </div>
          {renderFieldSelect(filterKey, onFilterKeyChange, t('Filter Field'))}

          {filterKey && (
            <div className="flex flex-col gap-1">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-sm font-medium text-gray-700">
                <Trans>Filter Value</Trans>
              </label>
              <SearchableSelect
                options={filterOptions.map((v) => ({ value: v, label: v }))}
                value={filterValue}
                onChange={onFilterValueChange}
                placeholder={`— ${t('All')} —`}
              />
            </div>
          )}

          {(filterKey || filterValue) && (
            <Button
              color="gray"
              size="sm"
              onClick={() => {
                onFilterKeyChange('');
                onFilterValueChange('');
              }}
            >
              <Trans>Clear Filter</Trans>
            </Button>
          )}
        </div>
      </Card>

      {crossData && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 flex-wrap">
            <span className="font-semibold text-lg text-gray-900">
              N = {crossData.incidentCount}
            </span>
            <Trans>incidents with data for both selected fields</Trans>
            {totalIncidents > 0 && (
              <span className="text-gray-400">
                (<Trans>out of {{ total: totalIncidents }} total in database</Trans>)
              </span>
            )}
            {filterValue && (
              <Badge color="info">
                {filter.field} = &quot;{filterValue}&quot;
              </Badge>
            )}
          </div>

          {crossData.incidentCount < 5 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
              <Trans>
                Warning: Only {{ incidents: crossData.incidentCount }} incidents have
                classifications for both selected fields. Results may not be representative.
              </Trans>
            </div>
          )}

          {crossData.incidentCount === 0 ? (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
              <Trans>
                No incidents found with classifications in both selected fields. Try selecting
                fields from the same taxonomy or more commonly used fields.
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

      {!crossData && (!xAxisKey || !yAxisKey) && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          <Trans>Select fields for both axes above to generate a visualization.</Trans>
        </div>
      )}
    </div>
  );
}
// ---------------------------------------------------------------------------

export default function CrossTaxonomyPage({ data }) {
  const { t } = useTranslation();

  const [coverageDismissed, setCoverageDismissed] = useState(false);

  // Read the dismissal after mount; localStorage doesn't exist at build time
  // and the first client render must match the built HTML.
  useEffect(() => {
    try {
      if (localStorage.getItem('aiid-coverage-notice-dismissed') === '1') {
        setCoverageDismissed(true);
      }
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const dismissCoverage = () => {
    try {
      localStorage.setItem('aiid-coverage-notice-dismissed', '1');
    } catch {
      /* localStorage unavailable */
    }
    setCoverageDismissed(true);
  };

  // Data comes from the build-time page query below; no runtime requests.
  // The synthetic Time taxa lets incident years act as a normal taxonomy field.
  const allTaxas = useMemo(() => [buildTimeTaxa(), ...transformTaxas(data?.taxas?.nodes)], [data]);

  const incidentsData = useMemo(
    () => transformIncidents(data?.incidents?.nodes, data?.entities?.nodes),
    [data]
  );

  const allClassifications = useMemo(
    () => [
      ...transformClassifications(data?.classifications?.nodes),
      ...buildTimeClassifications(incidentsData),
    ],
    [data, incidentsData]
  );

  const incidentEntityMap = useMemo(() => buildIncidentEntityMap(incidentsData), [incidentsData]);

  // Extra graph panels (first panel uses URL params below)
  const [extraPanels, setExtraPanels] = useState([]);

  // Tab + first-panel state, kept in the URL (see useUrlQueryState)
  const [query, setQuery] = useUrlQueryState();

  // Apply URL params only after mount; the built HTML has none, and the first
  // client render has to match it (hydration).
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Unknown tab ids (e.g. stale shared links) fall back to the default tab.
  const tabParamValid = TABS.some((t) => t.id === query.tab);

  const activeTab = mounted && tabParamValid ? query.tab : 'developer';

  // A sel from a stale tab belongs to that tab's value space; drop it too.
  const guidedSelection = (mounted && (tabParamValid || !query.tab) && query.sel) || '';

  // Mode index for tabs with a mode toggle; in the URL so links restore it.
  const guidedModeIdx = mounted && /^\d+$/.test(query.mode) ? parseInt(query.mode, 10) : 0;

  const chartTypeParam = (mounted && query.chartType) || 'bar';

  // Ignore chart types the selector doesn't offer.
  const chartType = CHART_TYPES.some((ct) => ct.value === chartTypeParam) ? chartTypeParam : 'bar';

  const xAxisKey = (mounted && query.x) || '';

  const yAxisKey = (mounted && query.y) || '';

  const filterKey = (mounted && query.filterField) || '';

  const filterValue = (mounted && query.filterValue) || '';

  const setActiveTab = useCallback(
    (tab) => setQuery({ tab: tab || undefined, sel: undefined, mode: undefined }),
    [setQuery]
  );

  const setGuidedSelection = useCallback((v) => setQuery({ sel: v || undefined }), [setQuery]);

  // Mode switch clears the selection; values don't carry across modes.
  const setGuidedModeIdx = useCallback(
    (i) => setQuery({ mode: i ? String(i) : undefined, sel: undefined }),
    [setQuery]
  );

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

  // Extra panel management
  const addPanel = useCallback(() => {
    setExtraPanels((prev) => [
      ...prev,
      {
        id: Date.now(),
        chartType: 'bar',
        xAxisKey: '',
        yAxisKey: '',
        filterKey: '',
        filterValue: '',
      },
    ]);
  }, []);

  const removePanel = useCallback((id) => {
    setExtraPanels((prev) => prev.filter((p) => p.id !== id));
  }, []);

  const updatePanel = useCallback((id, field, value) => {
    setExtraPanels((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  }, []);

  // Shared computed data
  const groupedClassifications = useMemo(
    () => groupClassificationsByIncident(allClassifications),
    [allClassifications]
  );

  const availableFields = useMemo(
    () => getAvailableFields(allTaxas.filter((t) => !t.namespace.includes('_Annotator'))),
    [allTaxas]
  );

  const fieldsByNamespace = useMemo(() => {
    const grouped = {};

    for (const f of availableFields) {
      if (!grouped[f.namespace]) grouped[f.namespace] = [];
      grouped[f.namespace].push(f);
    }
    return grouped;
  }, [availableFields]);

  // Options for the field selector: label = field name, sublabel = namespace.
  const fieldSelectOptions = useMemo(
    () =>
      Object.entries(fieldsByNamespace).flatMap(([namespace, fields]) =>
        fields.map((f) => ({
          value: `${namespace}::${f.short_name}`,
          label: f.short_name,
          sublabel: namespace,
        }))
      ),
    [fieldsByNamespace]
  );

  const hasSelection = activeTab === 'custom' ? xAxisKey && yAxisKey : guidedSelection;

  return (
    <div>
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

        {/* Coverage notice */}
        {!coverageDismissed && (
          <div className="flex items-start justify-between gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-600">
            <span>
              <Trans>
                ⓘ Coverage is partial: charts reflect only incidents annotated by taxonomy
                reviewers, not all {{ total: incidentEntityMap.size }} incidents in the database.
              </Trans>
            </span>
            <button
              type="button"
              onClick={dismissCoverage}
              className="text-gray-400 hover:text-gray-600 shrink-0 leading-none text-base"
              aria-label={t('Dismiss')}
            >
              ×
            </button>
          </div>
        )}

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
            activeModeIdx={guidedModeIdx}
            onSelectMode={setGuidedModeIdx}
            groupedClassifications={groupedClassifications}
            allClassifications={allClassifications}
            incidentEntityMap={incidentEntityMap}
            totalIncidents={incidentEntityMap.size}
            fieldSelectOptions={fieldSelectOptions}
          />
        )}

        {/* Custom explorer tab */}
        {activeTab === 'custom' && (
          <div className="flex flex-col gap-8">
            {/* First panel: axes stored in URL params for shareability */}
            <ExplorerPanel
              chartType={chartType}
              onChartTypeChange={setChartType}
              xAxisKey={xAxisKey}
              onXAxisChange={setXAxisKey}
              yAxisKey={yAxisKey}
              onYAxisChange={setYAxisKey}
              filterKey={filterKey}
              onFilterKeyChange={setFilterKey}
              filterValue={filterValue}
              onFilterValueChange={setFilterValue}
              onRemove={null}
              groupedClassifications={groupedClassifications}
              allClassifications={allClassifications}
              fieldSelectOptions={fieldSelectOptions}
              totalIncidents={incidentEntityMap.size}
            />

            {/* Extra panels */}
            {extraPanels.map((panel, i) => (
              <div key={panel.id} className="flex flex-col gap-0">
                {/* Divider connecting panels visually */}
                <div className="flex items-center gap-3 py-2">
                  <div className="flex-1 border-t border-dashed border-gray-300" />
                  <span className="text-xs text-gray-400 uppercase tracking-wide">
                    <Trans>Graph {{ number: i + 2 }}</Trans>
                  </span>
                  <div className="flex-1 border-t border-dashed border-gray-300" />
                </div>
                <ExplorerPanel
                  chartType={panel.chartType}
                  onChartTypeChange={(v) => updatePanel(panel.id, 'chartType', v)}
                  xAxisKey={panel.xAxisKey}
                  onXAxisChange={(v) => updatePanel(panel.id, 'xAxisKey', v)}
                  yAxisKey={panel.yAxisKey}
                  onYAxisChange={(v) => updatePanel(panel.id, 'yAxisKey', v)}
                  filterKey={panel.filterKey}
                  onFilterKeyChange={(v) => {
                    updatePanel(panel.id, 'filterKey', v);
                    updatePanel(panel.id, 'filterValue', '');
                  }}
                  filterValue={panel.filterValue}
                  onFilterValueChange={(v) => updatePanel(panel.id, 'filterValue', v)}
                  onRemove={() => removePanel(panel.id)}
                  groupedClassifications={groupedClassifications}
                  allClassifications={allClassifications}
                  fieldSelectOptions={fieldSelectOptions}
                  totalIncidents={incidentEntityMap.size}
                />
              </div>
            ))}

            {/* Add Graph button */}
            <div className="flex justify-center pt-2">
              <Button color="light" onClick={addPanel}>
                + <Trans>New Graph</Trans>
              </Button>
            </div>
          </div>
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

// Build-time page query; the page makes no runtime API calls. Unpublished
// classifications and *_Annotator namespaces are excluded here (never
// chartable, and they dominate the payload). Non-public taxa fields are
// filtered in transformTaxas.
export const query = graphql`
  query CrossTaxonomyPageQuery {
    taxas: allMongodbAiidprodTaxa {
      nodes {
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
    classifications: allMongodbAiidprodClassifications(
      filter: { publish: { eq: true }, namespace: { regex: "/^(?!.*_Annotator)/" } }
    ) {
      nodes {
        namespace
        incidents {
          incident_id
        }
        attributes {
          short_name
          value_json
        }
      }
    }
    incidents: allMongodbAiidprodIncidents {
      nodes {
        incident_id
        date
        Alleged_deployer_of_AI_system
        Alleged_developer_of_AI_system
        Alleged_harmed_or_nearly_harmed_parties
      }
    }
    entities: allMongodbAiidprodEntities {
      nodes {
        entity_id
        name
      }
    }
  }
`;
