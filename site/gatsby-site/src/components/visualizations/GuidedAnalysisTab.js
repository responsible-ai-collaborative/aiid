import React, { useMemo, useState, useEffect, useCallback } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Card, Button } from 'flowbite-react';
import ChartCard from './ChartCard';
import SearchableSelect from './SearchableSelect';
import {
  buildFilteredCounts,
  getFieldValues,
  countFilteredIncidents,
  getEntityValues,
  countEntityIncidents,
  buildEntityFilteredCounts,
  parseKey,
} from 'utils/crossTaxonomy';

// ---------------------------------------------------------------------------
// AdHocChartPanel: a user-added visualization below the hardcoded charts.
// Mirrors the Custom Explorer's ExplorerPanel layout: a controls card (field to
// visualize + optional filter) followed by the chart. Keeping the selectors at
// the top of a tall card gives the dropdown room to open instead of being
// clipped against the bottom of the page.
// ---------------------------------------------------------------------------
function AdHocChartPanel({
  panel,
  graphNumber,
  onUpdate,
  onRemove,
  isEntitySource,
  config,
  selectedValue,
  groupedClassifications,
  allClassifications,
  incidentEntityMap,
  fieldSelectOptions,
}) {
  const { t } = useTranslation();

  const field = useMemo(() => parseKey(panel.fieldKey), [panel.fieldKey]);

  const filter = useMemo(() => parseKey(panel.filterKey), [panel.filterKey]);

  const result = useMemo(() => {
    if (!field.namespace || !field.field || !selectedValue) return null;

    if (isEntitySource) {
      return buildEntityFilteredCounts(
        groupedClassifications,
        incidentEntityMap,
        config.selectorEntityField,
        selectedValue,
        field.namespace,
        field.field,
        filter.namespace || null,
        filter.field || null,
        panel.filterValue || null
      );
    }

    return buildFilteredCounts(
      groupedClassifications,
      config.selectorField.namespace,
      config.selectorField.short_name,
      selectedValue,
      field.namespace,
      field.field,
      filter.namespace || null,
      filter.field || null,
      panel.filterValue || null
    );
  }, [
    field,
    filter,
    panel.filterValue,
    selectedValue,
    isEntitySource,
    groupedClassifications,
    incidentEntityMap,
    config,
  ]);

  const filterOptions = useMemo(() => {
    if (!filter.namespace || !filter.field) return [];
    return getFieldValues(allClassifications, filter.namespace, filter.field).map(
      ({ value }) => value
    );
  }, [allClassifications, filter]);

  return (
    <div className="flex flex-col gap-4">
      <Card>
        {/* Remove button */}
        <div className="flex justify-end -mt-1 -mb-2">
          <button
            type="button"
            onClick={() => onRemove(panel.id)}
            className="text-xs text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trans>Remove visualization</Trans>
          </button>
        </div>

        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex flex-col gap-1">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="text-sm font-medium text-gray-700">
              <Trans>Field to Visualize</Trans>
            </label>
            <SearchableSelect
              options={fieldSelectOptions}
              value={panel.fieldKey}
              onChange={(v) => onUpdate(panel.id, 'fieldKey', v)}
              placeholder={`— ${t('Search or select a field')} —`}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4 items-end mt-4 pt-4 border-t border-gray-200">
          <div className="text-sm font-medium text-gray-700 self-center">
            <Trans>Optional Filter:</Trans>
          </div>
          <div className="flex flex-col gap-1">
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
            <label className="text-sm font-medium text-gray-700">
              <Trans>Filter Field</Trans>
            </label>
            <SearchableSelect
              options={fieldSelectOptions}
              value={panel.filterKey}
              onChange={(v) => {
                onUpdate(panel.id, 'filterKey', v);
                onUpdate(panel.id, 'filterValue', '');
              }}
              placeholder={`— ${t('Search or select')} —`}
            />
          </div>

          {panel.filterKey && (
            <div className="flex flex-col gap-1">
              {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
              <label className="text-sm font-medium text-gray-700">
                <Trans>Filter Value</Trans>
              </label>
              <SearchableSelect
                options={filterOptions.map((v) => ({ value: v, label: v }))}
                value={panel.filterValue}
                onChange={(v) => onUpdate(panel.id, 'filterValue', v)}
                placeholder={`— ${t('All')} —`}
              />
            </div>
          )}

          {(panel.filterKey || panel.filterValue) && (
            <Button
              color="gray"
              size="sm"
              onClick={() => {
                onUpdate(panel.id, 'filterKey', '');
                onUpdate(panel.id, 'filterValue', '');
              }}
            >
              <Trans>Clear Filter</Trans>
            </Button>
          )}
        </div>
      </Card>

      {panel.fieldKey ? (
        <ChartCard
          key={`${panel.fieldKey}-${panel.filterKey}-${panel.filterValue}`}
          title={field.field}
          subtitle={field.namespace}
          counts={result ? result.counts : null}
          chartType="bar"
          incidentCount={result ? result.incidentCount : 0}
          incidentIdsByValue={result ? result.incidentIdsByValue : null}
        />
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          <Trans>Select a field above to generate visualization {{ number: graphNumber }}.</Trans>
        </div>
      )}
    </div>
  );
}

/**
 * A generic guided analysis tab. Given a config object describing:
 * - which field the user selects from (selectorField or entity-based)
 * - which charts to generate (charts array)
 *
 * It renders a searchable combobox populated from real data, and a grid of
 * charts filtered by the user's selection.
 *
 * Config shape (classification-based):
 * {
 *   selectorField: { namespace: string, short_name: string },
 *   selectorLabel: string,
 *   charts: [{ title, subtitle?, namespace, field, type }]
 * }
 *
 * Config shape (entity-based: for By Developer / By Deployer):
 * {
 *   selectorSource: 'entity',
 *   selectorEntityField: 'developers' | 'deployers' | 'harmedParties',
 *   selectorLabel: string,
 *   charts: [{ title, subtitle?, namespace, field, type }]
 * }
 *
 * Config shape (mode toggle: for "Who It Affected"):
 * {
 *   selectorLabel: string,
 *   modes: [{ modeLabel, ...selector fields (either shape above), charts? }],
 *   charts: [...]   // default lineup; a mode may override with its own charts
 * }
 * The active mode is merged over the base config to form the effective config used by
 * every data hook, so each mode behaves exactly like a standalone classification/entity tab.
 */
export default function GuidedAnalysisTab({
  config,
  selectedValue,
  onSelectValue,
  activeModeIdx = 0,
  onSelectMode = () => {},
  groupedClassifications,
  allClassifications,
  incidentEntityMap,
  totalIncidents,
  fieldSelectOptions,
}) {
  const { t } = useTranslation();

  // A mode (if the tab defines any) is merged over the base config, so each
  // mode behaves like a standalone tab config.
  const modes = config.modes;

  // Mode index comes from the URL; guard against out-of-range values.
  const modeIdx = modes && activeModeIdx >= 0 && activeModeIdx < modes.length ? activeModeIdx : 0;

  const effectiveConfig = useMemo(
    () => (modes ? { ...config, ...modes[modeIdx] } : config),
    [config, modes, modeIdx]
  );

  const isEntitySource = effectiveConfig.selectorSource === 'entity';

  // Ad-hoc visualizations added by the user beyond the hardcoded config.charts.
  // Each panel: { id, fieldKey, filterKey, filterValue }. The data for each panel
  // is computed inside AdHocChartPanel so changing its field/filter only re-renders
  // that one panel.
  const [adHocCharts, setAdHocCharts] = useState([]);

  // Clear ad-hoc visualizations when the selected value or active mode changes
  useEffect(() => {
    setAdHocCharts([]);
  }, [selectedValue, config, modeIdx]);

  // Get available values for the selector dropdown, sorted by frequency
  const selectorOptions = useMemo(() => {
    if (isEntitySource) {
      return getEntityValues(incidentEntityMap, effectiveConfig.selectorEntityField);
    }

    return getFieldValues(
      allClassifications,
      effectiveConfig.selectorField.namespace,
      effectiveConfig.selectorField.short_name
    );
  }, [allClassifications, incidentEntityMap, effectiveConfig, isEntitySource]);

  // Count total incidents for the selected value
  const incidentCount = useMemo(() => {
    if (!selectedValue) return 0;
    if (isEntitySource) {
      return countEntityIncidents(
        incidentEntityMap,
        effectiveConfig.selectorEntityField,
        selectedValue
      );
    }

    return countFilteredIncidents(
      groupedClassifications,
      effectiveConfig.selectorField.namespace,
      effectiveConfig.selectorField.short_name,
      selectedValue
    );
  }, [groupedClassifications, incidentEntityMap, effectiveConfig, selectedValue, isEntitySource]);

  // Build chart data for each chart in the config
  const chartData = useMemo(() => {
    if (!selectedValue) return [];

    return effectiveConfig.charts.map((chart) => {
      let result;

      if (isEntitySource) {
        result = buildEntityFilteredCounts(
          groupedClassifications,
          incidentEntityMap,
          effectiveConfig.selectorEntityField,
          selectedValue,
          chart.namespace,
          chart.field
        );
      } else {
        result = buildFilteredCounts(
          groupedClassifications,
          effectiveConfig.selectorField.namespace,
          effectiveConfig.selectorField.short_name,
          selectedValue,
          chart.namespace,
          chart.field
        );
      }

      return {
        ...chart,
        counts: result.counts,
        incidentCount: result.incidentCount,
        incidentIdsByValue: result.incidentIdsByValue,
      };
    });
  }, [groupedClassifications, incidentEntityMap, effectiveConfig, selectedValue, isEntitySource]);

  const addAdHocChart = useCallback(() => {
    setAdHocCharts((prev) => [
      ...prev,
      { id: Date.now(), fieldKey: '', filterKey: '', filterValue: '' },
    ]);
  }, []);

  const updateAdHocChart = useCallback((id, key, value) => {
    setAdHocCharts((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  }, []);

  const removeAdHocChart = useCallback((id) => {
    setAdHocCharts((prev) => prev.filter((c) => c.id !== id));
  }, []);

  return (
    <div className="flex flex-col gap-6">
      {/* Mode toggle: only on tabs that define multiple selector modes */}
      {modes && (
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-gray-700">
            <Trans>View by</Trans>
          </span>
          <div className="inline-flex rounded-lg border border-gray-200 p-0.5 self-start">
            {modes.map((mode, i) => (
              <button
                key={mode.modeLabel}
                type="button"
                onClick={() => onSelectMode(i)}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  modeIdx === i ? 'bg-blue-500 text-white' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {t(mode.modeLabel)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Selector */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="guided-selector" className="text-sm font-medium text-gray-700">
            {t(effectiveConfig.selectorLabel)}
          </label>
          <SearchableSelect
            id="guided-selector"
            options={selectorOptions.map(({ value, count }) => ({
              value,
              label: value,
              sublabel: `${count} ${count === 1 ? t('incident') : t('incidents')}`,
            }))}
            value={selectedValue}
            onChange={onSelectValue}
            placeholder={`— ${t('Search or select')} —`}
          />
        </div>
      </div>

      {/* Results */}
      {selectedValue && (
        <>
          {/* Sample size header */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-lg text-gray-900">N = {incidentCount}</span>{' '}
            {isEntitySource ? (
              <Trans>total incidents involving</Trans>
            ) : (
              <Trans>classified incidents involving</Trans>
            )}{' '}
            <span className="font-medium">&quot;{selectedValue}&quot;</span>
            {!isEntitySource && totalIncidents > 0 && (
              <span className="text-gray-400 ml-1">
                (<Trans>out of {{ total: totalIncidents }} total in database</Trans>)
              </span>
            )}
          </div>

          {incidentCount < 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
              <Trans>
                Too few classified incidents ({{ incidents: incidentCount }}) to generate meaningful
                visualizations. Try selecting a more commonly represented option.
              </Trans>
            </div>
          )}

          {incidentCount >= 3 && (
            <>
              {incidentCount < 10 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-xs">
                  <Trans>
                    Small sample size ({{ incidents: incidentCount }} incidents). Results may not be
                    representative.
                  </Trans>
                </div>
              )}

              {/* Chart grid: hardcoded config charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {chartData.map((chart, i) => (
                  <ChartCard
                    key={`${selectedValue}-${i}`}
                    title={chart.title}
                    subtitle={chart.subtitle}
                    counts={chart.counts}
                    chartType={chart.type}
                    incidentCount={chart.incidentCount}
                    incidentIdsByValue={chart.incidentIdsByValue}
                    sortBy={chart.sortBy || 'count'}
                  />
                ))}
              </div>

              {/* Ad-hoc visualizations added by the user, stacked full-width */}
              {adHocCharts.map((panel, i) => (
                <div key={panel.id} className="flex flex-col gap-0">
                  {/* Divider connecting panels visually */}
                  <div className="flex items-center gap-3 py-2">
                    <div className="flex-1 border-t border-dashed border-gray-300" />
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                      <Trans>Visualization {{ number: i + 1 }}</Trans>
                    </span>
                    <div className="flex-1 border-t border-dashed border-gray-300" />
                  </div>
                  <AdHocChartPanel
                    panel={panel}
                    graphNumber={i + 1}
                    onUpdate={updateAdHocChart}
                    onRemove={removeAdHocChart}
                    isEntitySource={isEntitySource}
                    config={effectiveConfig}
                    selectedValue={selectedValue}
                    groupedClassifications={groupedClassifications}
                    allClassifications={allClassifications}
                    incidentEntityMap={incidentEntityMap}
                    fieldSelectOptions={fieldSelectOptions}
                  />
                </div>
              ))}

              {/* Add a new visualization */}
              {fieldSelectOptions && fieldSelectOptions.length > 0 && (
                <div className="flex justify-center pt-2">
                  <Button color="light" onClick={addAdHocChart}>
                    + <Trans>New Visualization</Trans>
                  </Button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {!selectedValue && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center text-gray-500">
          <Trans>Select an option above to generate visualizations.</Trans>
        </div>
      )}
    </div>
  );
}
