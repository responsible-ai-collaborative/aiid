import React, { useMemo } from 'react';
import { Select } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import ChartCard from './ChartCard';
import {
  buildFilteredCounts,
  getFieldValues,
  countFilteredIncidents,
  getEntityValues,
  countEntityIncidents,
  buildEntityFilteredCounts,
} from 'utils/crossTaxonomy';

/**
 * A generic guided analysis tab. Given a config object describing:
 * - which field the user selects from (selectorField or entity-based)
 * - which charts to generate (charts array)
 *
 * It renders a dropdown populated from real data, and a grid of charts
 * filtered by the user's selection.
 *
 * Config shape (classification-based):
 * {
 *   selectorField: { namespace: string, short_name: string },
 *   selectorLabel: string,
 *   charts: [{ title, subtitle?, namespace, field, type }]
 * }
 *
 * Config shape (entity-based — for By Developer / By Deployer):
 * {
 *   selectorSource: 'entity',
 *   selectorEntityField: 'developers' | 'deployers' | 'harmedParties',
 *   selectorLabel: string,
 *   charts: [{ title, subtitle?, namespace, field, type }]
 * }
 */
export default function GuidedAnalysisTab({
  config,
  selectedValue,
  onSelectValue,
  groupedClassifications,
  allClassifications,
  incidentEntityMap,
}) {
  const { t } = useTranslation();

  const isEntitySource = config.selectorSource === 'entity';

  // Get available values for the selector dropdown, sorted by frequency
  const selectorOptions = useMemo(() => {
    if (isEntitySource) {
      return getEntityValues(incidentEntityMap, config.selectorEntityField);
    }

    return getFieldValues(
      allClassifications,
      config.selectorField.namespace,
      config.selectorField.short_name
    );
  }, [allClassifications, incidentEntityMap, config, isEntitySource]);

  // Count total incidents for the selected value
  const incidentCount = useMemo(() => {
    if (!selectedValue) return 0;
    if (isEntitySource) {
      return countEntityIncidents(incidentEntityMap, config.selectorEntityField, selectedValue);
    }

    return countFilteredIncidents(
      groupedClassifications,
      config.selectorField.namespace,
      config.selectorField.short_name,
      selectedValue
    );
  }, [groupedClassifications, incidentEntityMap, config, selectedValue, isEntitySource]);

  // Build chart data for each chart in the config
  const chartData = useMemo(() => {
    if (!selectedValue) return [];

    return config.charts.map((chart) => {
      let result;

      if (isEntitySource) {
        result = buildEntityFilteredCounts(
          groupedClassifications,
          incidentEntityMap,
          config.selectorEntityField,
          selectedValue,
          chart.namespace,
          chart.field
        );
      } else {
        result = buildFilteredCounts(
          groupedClassifications,
          config.selectorField.namespace,
          config.selectorField.short_name,
          selectedValue,
          chart.namespace,
          chart.field
        );
      }

      return { ...chart, counts: result.counts, incidentCount: result.incidentCount };
    });
  }, [groupedClassifications, incidentEntityMap, config, selectedValue, isEntitySource]);

  return (
    <div className="flex flex-col gap-6">
      {/* Selector */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="text-sm font-medium text-gray-700">{t(config.selectorLabel)}</label>
          <Select
            value={selectedValue}
            onChange={(e) => onSelectValue(e.target.value)}
            className="min-w-[280px]"
          >
            <option value="">— {t('Select')} —</option>
            {selectorOptions.map(({ value, count }) => (
              <option key={value} value={value}>
                {value} ({count} {t('incidents')})
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Results */}
      {selectedValue && (
        <>
          {/* Sample size header */}
          <div className="text-sm text-gray-600">
            <span className="font-semibold text-lg text-gray-900">N = {incidentCount}</span>{' '}
            <Trans>classified incidents involving</Trans>{' '}
            <span className="font-medium">&quot;{selectedValue}&quot;</span>
          </div>

          {incidentCount < 3 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-800 text-sm">
              <Trans>
                Too few classified incidents ({{ count: incidentCount }}) to generate meaningful
                visualizations. Try selecting a more commonly represented option.
              </Trans>
            </div>
          )}

          {incidentCount >= 3 && (
            <>
              {incidentCount < 10 && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-yellow-800 text-xs">
                  <Trans>
                    Small sample size ({{ count: incidentCount }} incidents). Results may not be
                    representative.
                  </Trans>
                </div>
              )}

              {/* Chart grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {chartData.map((chart, i) => (
                  <ChartCard
                    key={`${selectedValue}-${i}`}
                    title={chart.title}
                    subtitle={chart.subtitle}
                    counts={chart.counts}
                    chartType={chart.type}
                  />
                ))}
              </div>
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
