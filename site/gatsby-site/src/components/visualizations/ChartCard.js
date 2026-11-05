import React, { useMemo, useState, useLayoutEffect, useRef } from 'react';
import { Card } from 'flowbite-react';
import bb, { bar, line, donut } from 'billboard.js';
import { Trans, useTranslation } from 'react-i18next';

// Color palette matching the AIID taxonomy page style
const COLORS = [
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#6b7280', // gray
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#a855f7', // purple
  '#78716c', // stone
  '#e11d48', // rose
  '#0ea5e9', // sky
  '#d946ef', // fuchsia
  '#eab308', // yellow
  '#22c55e', // green
  '#64748b', // slate
  '#dc2626', // red-dark
];

// Thin wrapper instead of @billboard.js/react, whose destroy() can run against
// a DOM node React already removed (Strict Mode) and throw. Regenerates only
// when chartKey changes.
export function BillboardChart({ options, chartKey }) {
  const elRef = useRef(null);

  useLayoutEffect(() => {
    const el = elRef.current;

    if (!el) return;
    const instance = bb.generate({ bindto: el, ...options });

    return () => {
      try {
        instance.destroy();
      } catch (_) {
        /* node already detached by React; nothing to clean up */
      }
    };
  }, [chartKey]); // options are stable within a given key

  return <div ref={elRef} />;
}

const TYPE_OPTIONS = [
  { value: 'bar', label: 'Bar' },
  { value: 'line', label: 'Line' },
  { value: 'donut', label: 'Donut' },
];

export default function ChartCard({
  title,
  subtitle,
  counts,
  chartType = 'bar',
  maxItems = 15,
  incidentCount,
  sortBy = 'count',
  incidentIdsByValue,
}) {
  const { t } = useTranslation();

  const [activeType, setActiveType] = useState(chartType);

  const [showPct, setShowPct] = useState(false);

  // When true, the chart is replaced by a list of the contributing incidents,
  // grouped by the same values shown on the chart.
  const [showIds, setShowIds] = useState(false);

  const hasData = !!counts && counts.size > 0;

  const canNormalize = activeType !== 'donut' && incidentCount > 0 && !showIds;

  const hasIds = incidentIdsByValue && incidentIdsByValue.size > 0;

  const sortedEntries = useMemo(() => {
    if (!counts) return [];
    const entries = Array.from(counts.entries());

    if (sortBy === 'key') {
      entries.sort((a, b) => a[0].localeCompare(b[0]));
      // Keep the end of the ascending sort so the most recent years survive
      // the cap.
      return entries.slice(-maxItems);
    }
    entries.sort((a, b) => b[1] - a[1]);
    return entries.slice(0, maxItems);
  }, [counts, maxItems, sortBy]);

  const typeToggle = (
    <div className="flex gap-1 shrink-0 flex-wrap justify-end">
      {TYPE_OPTIONS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          disabled={!hasData}
          onClick={() => {
            setActiveType(value);
            setShowIds(false);
            if (value === 'donut') setShowPct(false);
          }}
          className={`text-xs px-2 py-0.5 rounded border transition-colors ${
            !hasData
              ? 'border-gray-100 text-gray-300 cursor-not-allowed'
              : activeType === value && !showIds
              ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
              : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
          }`}
        >
          {t(label)}
        </button>
      ))}
      <button
        type="button"
        onClick={() => canNormalize && setShowPct((p) => !p)}
        className={`text-xs px-2 py-0.5 rounded border transition-colors ${
          !canNormalize
            ? 'border-gray-100 text-gray-300 cursor-not-allowed'
            : showPct
            ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
            : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
        }`}
      >
        %
      </button>
      {hasIds && (
        <button
          type="button"
          onClick={() => setShowIds((s) => !s)}
          className={`text-xs px-2 py-0.5 rounded border transition-colors ${
            showIds
              ? 'bg-blue-50 border-blue-300 text-blue-700 font-medium'
              : 'border-gray-200 text-gray-400 hover:text-gray-600 hover:border-gray-300'
          }`}
        >
          {t('Incident IDs')}
        </button>
      )}
    </div>
  );

  if (!counts || counts.size === 0) {
    return (
      <Card>
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-base font-semibold">{t(title)}</h3>
            {subtitle && <p className="text-xs text-gray-500">{t(subtitle)}</p>}
            {incidentCount !== undefined && (
              <p className="text-xs text-gray-400 mt-0.5">N = {incidentCount}</p>
            )}
          </div>
          {typeToggle}
        </div>
        <div className="py-8 text-center text-sm text-gray-400">
          <Trans>No data available for this analysis.</Trans>
        </div>
      </Card>
    );
  }

  return (
    <Card>
      {/* Card header: title + type toggle buttons */}
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="text-base font-semibold">{t(title)}</h3>
          {subtitle && <p className="text-xs text-gray-500">{t(subtitle)}</p>}
          {incidentCount !== undefined && (
            <p className="text-xs text-gray-400 mt-0.5">N = {incidentCount}</p>
          )}
          {incidentCount !== undefined && incidentCount > 0 && incidentCount < 10 && (
            <p className="text-xs text-amber-600 mt-0.5">
              <Trans>Low sample: based on only {{ incidents: incidentCount }} incidents.</Trans>
            </p>
          )}
          {counts.size > maxItems && (
            <p className="text-xs text-gray-400 mt-0.5">
              {sortBy === 'key' ? (
                <Trans>
                  Showing the latest {{ shown: maxItems }} of {{ total: counts.size }} values.
                </Trans>
              ) : (
                <Trans>
                  Showing the top {{ shown: maxItems }} of {{ total: counts.size }} values.
                </Trans>
              )}
            </p>
          )}
        </div>
        {typeToggle}
      </div>

      {showIds ? (
        <IncidentListBody entries={sortedEntries} incidentIdsByValue={incidentIdsByValue} t={t} />
      ) : activeType === 'donut' ? (
        <DonutChartBody entries={sortedEntries} t={t} />
      ) : (
        <BarLineChartBody
          entries={sortedEntries}
          t={t}
          activeType={activeType}
          showPct={showPct}
          denominator={incidentCount}
          sortBy={sortBy}
        />
      )}
    </Card>
  );
}

// ---- Incident list body ----------------------------------------------------

// Renders a wrapped row of links to each incident's /cite page. Shared by the
// guided/ad-hoc ChartCard list view and the Custom Explorer's cross list.
export function IncidentLinks({ ids }) {
  if (!ids || ids.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5">
      {ids.map((id) => (
        <a
          key={id}
          href={`/cite/${id}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block text-xs px-1.5 py-0.5 rounded border border-gray-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
        >
          #{id}
        </a>
      ))}
    </div>
  );
}

// Lists the incidents behind each charted value, in the same order/limit the
// chart uses, with a color swatch matching the chart legend.
function IncidentListBody({ entries, incidentIdsByValue, t }) {
  return (
    <div className="flex flex-col gap-3 mt-1 max-h-[420px] overflow-y-auto pr-1">
      {entries.map(([label], i) => {
        const ids = (incidentIdsByValue && incidentIdsByValue.get(label)) || [];

        return (
          <div key={label} className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 text-sm font-medium text-gray-700">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              <span>{label}</span>
              <span className="text-xs font-normal text-gray-400">
                ({ids.length} {ids.length === 1 ? t('incident') : t('incidents')})
              </span>
            </div>
            <IncidentLinks ids={ids} />
          </div>
        );
      })}
    </div>
  );
}

// ---- Bar / Line chart body -------------------------------------------------

function BarLineChartBody({ entries, t, activeType, showPct, denominator, sortBy = 'count' }) {
  // Time series get x-axis labels instead of per-bar colors.
  const isTimeSeries = sortBy === 'key';

  // 1-2 bars get a fixed narrow width (bar only; line stays fluid).
  const isFewBars = !isTimeSeries && activeType === 'bar' && entries.length <= 2;

  const options = useMemo(() => {
    const labels = entries.map(([label]) => label);

    const rawValues = entries.map(([, count]) => count);

    const values =
      showPct && denominator > 0
        ? rawValues.map((n) => +((n / denominator) * 100).toFixed(1))
        : rawValues;

    const chartTypeFunc = activeType === 'line' ? line() : bar();

    const yLabel = showPct ? t('% of classified incidents') : t('Count');

    const tickFormat = showPct ? (x) => `${x}%` : (x) => (x === Math.floor(x) ? x : '');

    return {
      data: {
        x: 'x',
        columns: [
          ['x', ...labels],
          ['Count', ...values],
        ],
        type: chartTypeFunc,
        // Uniform color for time series; per-index colors elsewhere to match
        // the legend below.
        color: isTimeSeries
          ? () => COLORS[0]
          : (defaultColor, d) => {
              if (d && typeof d.index === 'number') return COLORS[d.index % COLORS.length];
              return defaultColor;
            },
        names: { Count: '' },
      },
      axis: {
        x: {
          type: 'category',
          // Ticks only for time series; other charts use the legend instead.
          show: isTimeSeries,
          ...(isTimeSeries && {
            // Fixed rotate threshold; billboard's autorotate lets labels touch.
            tick: {
              rotate: entries.length > 6 ? -30 : 0,
              multiline: false,
              culling: false,
            },
            height: entries.length > 6 ? 60 : 40,
          }),
        },
        y: {
          label: { text: yLabel, position: 'outer-middle' },
          tick: { format: tickFormat },
        },
      },
      // bar config is ignored by Billboard when chart type is line
      bar: {
        width: isFewBars
          ? 120
          : {
              ratio: Math.max(0.45, Math.min(0.85, 0.37 + entries.length * 0.04)),
              max: Math.max(80, Math.min(160, 280 / entries.length)),
            },
      },
      grid: { y: { show: false } },
      legend: { show: false },
      tooltip: {
        grouped: false,
        format: {
          title: (x) => labels[x] || '',
          value: (value) => (showPct ? `${value}%` : value),
        },
      },
      size: isFewBars
        ? { height: 390, width: entries.length * 180 + 80 }
        : { height: Math.max(390, 340 + Math.ceil(entries.length / 3) * 24) },
      resize: { auto: !isFewBars },
    };
  }, [entries, t, activeType, isFewBars, isTimeSeries, showPct, denominator]);

  return (
    <>
      <div
        className={`[&_.bb-ygrid-line>line]:stroke-gray-300 [&_.bb-ygrid-line>line]:stroke-1 [&_.bb-line]:fill-none ${
          isTimeSeries
            ? '[&_svg]:overflow-visible'
            : isFewBars
            ? 'w-fit overflow-x-auto'
            : 'overflow-hidden'
        }`}
      >
        <BillboardChart options={options} chartKey={`${activeType}-${showPct}`} />
      </div>
      {/* Legend: only for non-time-series charts. Time-series charts use X-axis labels instead. */}
      {!isTimeSeries && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 justify-center">
          {entries.map(([label], i) => (
            <div key={label} className="flex items-center gap-1 text-xs text-gray-600">
              <span
                className="inline-block w-3 h-3 rounded-sm flex-shrink-0"
                style={{ backgroundColor: COLORS[i % COLORS.length] }}
              />
              {label}
            </div>
          ))}
        </div>
      )}
    </>
  );
}

// ---- Donut chart body ------------------------------------------------------

function DonutChartBody({ entries, t }) {
  const options = useMemo(() => {
    const columns = entries.map(([label, count]) => [label, count]);

    const colors = {};

    entries.forEach(([label], i) => {
      colors[label] = COLORS[i % COLORS.length];
    });

    const names = columns.reduce((obj, [key]) => {
      obj[key] = t(key);
      return obj;
    }, {});

    return {
      data: {
        columns,
        type: donut(),
        names,
        colors,
      },
      donut: {
        title: '',
        label: { show: false },
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      tooltip: {
        contents: (d) => {
          if (!d || !d[0]) return '';

          const { id, ratio } = d[0];

          const name = names[id] || id;

          const pct = (ratio * 100).toFixed(1);

          const bg = colors[id] || '#3b82f6';

          return (
            '<div style="background:white;border:1px solid #d1d5db;border-radius:6px;' +
            'padding:6px 12px;font-size:13px;box-shadow:0 1px 4px rgba(0,0,0,0.1);' +
            'display:flex;align-items:center;gap:8px;">' +
            `<span style="width:10px;height:10px;border-radius:2px;background:${bg};` +
            'flex-shrink:0;display:inline-block;"></span>' +
            `<span>${name} <strong>${pct}%</strong></span>` +
            '</div>'
          );
        },
      },
      size: { height: 300 },
      resize: { auto: true },
    };
  }, [entries, t]);

  return <BillboardChart options={options} chartKey={`donut-${entries.length}`} />;
}
