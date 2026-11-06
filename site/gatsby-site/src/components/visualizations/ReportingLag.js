import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Trans } from 'react-i18next';
import Link from 'components/ui/Link';

const DAY = 86400000;

export const BUCKETS = [
  { key: 'before', label: 'Before the incident date', test: (days) => days < 0 },
  { key: 'same', label: 'Same day', test: (days) => days === 0 },
  { key: 'week', label: '1–7 days', test: (days) => days >= 1 && days <= 7 },
  { key: 'month', label: '8–30 days', test: (days) => days > 7 && days <= 30 },
  { key: 'quarter', label: '31–90 days', test: (days) => days > 30 && days <= 90 },
  { key: 'year', label: '91–365 days', test: (days) => days > 90 && days <= 365 },
  { key: 'years', label: '1–5 years', test: (days) => days > 365 && days <= 5 * 365 },
  { key: 'decade', label: 'Over 5 years', test: (days) => days > 5 * 365 },
];

const WIDTH = 960;

const HEIGHT = 420;

const MARGIN = { top: 20, right: 30, bottom: 50, left: 96 };

const isoDay = (time) => new Date(time).toISOString().slice(0, 10);

// For every incident, the number of days between its date and the earliest
// publication date among its reports, and that first report. Reports without
// a credible publication date (before 1900) are ignored.
export function computeLags(incidents) {
  const lags = [];

  for (const incident of incidents) {
    const incidentDate = Date.parse(incident.date);

    if (Number.isNaN(incidentDate)) continue;

    const dated = (incident.reports || [])
      .map((report) => ({
        report,
        time: report.date_published ? Date.parse(report.date_published) : NaN,
      }))
      .filter(({ time }) => !Number.isNaN(time) && time > Date.UTC(1900, 0, 1));

    if (dated.length === 0) continue;

    const first = dated.reduce((earliest, entry) =>
      entry.time < earliest.time ? entry : earliest
    );

    const days = Math.round((first.time - incidentDate) / DAY);

    lags.push({
      incident_id: incident.incident_id,
      title: incident.title,
      date: incident.date,
      incidentDate,
      firstPublished: first.time,
      firstReport: first.report,
      days,
      bucket: BUCKETS.find((bucket) => bucket.test(days)).key,
    });
  }

  return lags.sort((a, b) => a.incidentDate - b.incidentDate);
}

export default function ReportingLag({ incidents }) {
  const all = useMemo(() => computeLags(incidents), [incidents]);

  const years = useMemo(() => all.map((lag) => new Date(lag.incidentDate).getUTCFullYear()), [all]);

  const minYear = years.length ? Math.min(...years) : 2000;

  const maxYear = years.length ? Math.max(...years) : new Date().getUTCFullYear();

  const [fromYear, setFromYear] = useState(Math.max(minYear, 2010));

  const [toYear, setToYear] = useState(maxYear);

  const [hovered, setHovered] = useState(null);

  // the point clicked last: it stays shown below the chart until unpinned
  const [pinned, setPinned] = useState(null);

  const lags = all.filter((lag) => {
    const year = new Date(lag.incidentDate).getUTCFullYear();

    return year >= fromYear && year <= toYear;
  });

  const counts = BUCKETS.map((bucket) => ({
    ...bucket,
    count: lags.filter((lag) => lag.bucket === bucket.key).length,
  }));

  const median = lags.length ? d3.median(lags, (lag) => lag.days) : null;

  const withinMonth = lags.length
    ? Math.round((100 * lags.filter((lag) => lag.days >= 0 && lag.days <= 30).length) / lags.length)
    : null;

  const x = d3
    .scaleUtc()
    .domain([Date.UTC(fromYear, 0, 1), Date.UTC(toYear + 1, 0, 1)])
    .range([MARGIN.left, WIDTH - MARGIN.right]);

  const maxDays = d3.max(lags, (lag) => Math.abs(lag.days)) || 1;

  const y = d3
    .scaleSymlog()
    .constant(7)
    .domain([-maxDays, maxDays])
    .range([HEIGHT - MARGIN.bottom, MARGIN.top]);

  const yTicks = [-3650, -365, -30, 0, 30, 365, 3650, 36500].filter(
    (tick) => Math.abs(tick) <= maxDays * 1.05 || tick === 0
  );

  const barMax = d3.max(counts, (bucket) => bucket.count) || 1;

  const formatDays = (days) =>
    Math.abs(days) >= 365
      ? `${(days / 365).toFixed(1)} years`
      : Math.abs(days) >= 30
      ? `${Math.round(days / 30)} months`
      : `${days} days`;

  return (
    <div className="flex flex-col gap-4" data-cy="reporting-lag">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <Trans>Incidents from</Trans>
          <input
            type="number"
            className="rounded border-gray-300 text-sm w-24"
            min={minYear}
            max={toYear}
            value={fromYear}
            data-cy="from-year"
            onChange={(event) => setFromYear(Number(event.target.value))}
          />
        </label>
        <label className="flex items-center gap-2">
          <Trans>to</Trans>
          <input
            type="number"
            className="rounded border-gray-300 text-sm w-24"
            min={fromYear}
            max={maxYear}
            value={toYear}
            data-cy="to-year"
            onChange={(event) => setToYear(Number(event.target.value))}
          />
        </label>
        <span className="text-gray-600" data-cy="lag-summary">
          {lags.length} <Trans>incidents</Trans>
          {median !== null && (
            <>
              , <Trans>median lag</Trans> {formatDays(median)}, {withinMonth}%{' '}
              <Trans>reported within 30 days</Trans>
            </>
          )}
        </span>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="border rounded bg-white p-2" data-cy="lag-buckets">
          <h2 className="text-sm font-semibold mb-2">
            <Trans>Time to first report</Trans>
          </h2>
          <svg viewBox="0 0 340 280" className="w-full">
            {counts.map((bucket, i) => (
              <g key={bucket.key} transform={`translate(0,${i * 34})`} data-cy="lag-bucket">
                <text x={150} y={20} textAnchor="end" fontSize={12} fill="#374151">
                  {bucket.label}
                </text>
                <rect
                  x={158}
                  y={8}
                  height={18}
                  width={(120 * bucket.count) / barMax}
                  fill="#2563eb"
                  rx={2}
                />
                <text x={162 + (120 * bucket.count) / barMax} y={21} fontSize={12} fill="#111827">
                  {bucket.count}
                </text>
              </g>
            ))}
          </svg>
        </div>
        <div className="border rounded bg-white p-2 lg:col-span-2">
          <h2 className="text-sm font-semibold mb-2">
            <Trans>Lag by incident date</Trans>
          </h2>
          <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className="w-full" data-cy="lag-scatter">
            {yTicks.map((tick) => (
              <g key={tick} transform={`translate(0,${y(tick)})`}>
                <line
                  x1={MARGIN.left}
                  x2={WIDTH - MARGIN.right}
                  stroke={tick === 0 ? '#9ca3af' : '#e5e7eb'}
                />
                <text x={MARGIN.left - 8} y={4} textAnchor="end" fontSize={11} fill="#374151">
                  {tick === 0 ? '0' : formatDays(tick)}
                </text>
              </g>
            ))}
            {x.ticks(Math.min(12, toYear - fromYear + 1)).map((tick) => (
              <g key={tick.valueOf()} transform={`translate(${x(tick)},0)`}>
                <line y1={MARGIN.top} y2={HEIGHT - MARGIN.bottom} stroke="#f3f4f6" />
                <text
                  y={HEIGHT - MARGIN.bottom + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#374151"
                >
                  {tick.getUTCFullYear()}
                </text>
              </g>
            ))}
            <text
              transform={`translate(14,${HEIGHT / 2}) rotate(-90)`}
              textAnchor="middle"
              fontSize={12}
              fill="#374151"
            >
              days from incident to first report
            </text>
            {lags.map((lag) => {
              const isPinned = pinned && pinned.incident_id === lag.incident_id;

              const isHovered = hovered && hovered.incident_id === lag.incident_id;

              return (
                <circle
                  key={lag.incident_id}
                  cx={x(lag.incidentDate)}
                  cy={y(lag.days)}
                  r={isPinned ? 7 : isHovered ? 6 : 3.5}
                  fill={lag.days < 0 ? '#dc2626' : '#2563eb'}
                  fillOpacity={isPinned ? 0.9 : 0.55}
                  stroke={isPinned || isHovered ? '#111827' : 'none'}
                  strokeWidth={isPinned ? 2 : 1}
                  className="cursor-pointer"
                  data-cy="lag-point"
                  data-pinned={isPinned ? 'true' : undefined}
                  onMouseEnter={() => setHovered(lag)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => setPinned(isPinned ? null : lag)}
                >
                  <title>{`${lag.incident_id}: ${lag.title} — ${formatDays(lag.days)}`}</title>
                </circle>
              );
            })}
          </svg>
          <p className="text-sm min-h-[1.5rem]" data-cy="lag-hover">
            {hovered ? (
              <>
                <Link to={`/cite/${hovered.incident_id}`}>
                  {hovered.incident_id}: {hovered.title}
                </Link>{' '}
                — {hovered.date}, <Trans>first report</Trans> {isoDay(hovered.firstPublished)} (
                {formatDays(hovered.days)})
              </>
            ) : (
              <span className="text-gray-600">
                <Trans>
                  Hover a point for the incident and click it to pin the report below. Red points
                  were published before the incident date.
                </Trans>
              </span>
            )}
          </p>
          {pinned && (
            <div
              className="mt-2 flex items-start justify-between gap-3 rounded border bg-gray-50 p-3 text-sm"
              data-cy="lag-pinned"
            >
              <div>
                <Link to={`/cite/${pinned.incident_id}`}>
                  {pinned.incident_id}: {pinned.title}
                </Link>{' '}
                <span className="text-gray-600">
                  — {pinned.date}, <Trans>first report</Trans> {isoDay(pinned.firstPublished)} (
                  {formatDays(pinned.days)})
                </span>
                <br />
                <Trans>First report:</Trans>{' '}
                <Link
                  to={`/cite/${pinned.incident_id}#r${pinned.firstReport.report_number}`}
                  data-cy="lag-pinned-report"
                >
                  {pinned.firstReport.title || `#${pinned.firstReport.report_number}`}
                </Link>
                {pinned.firstReport.source_domain && (
                  <span className="text-gray-600"> ({pinned.firstReport.source_domain})</span>
                )}
              </div>
              <button
                type="button"
                className="shrink-0 rounded border border-gray-300 px-2 py-0.5"
                data-cy="lag-unpin"
                onClick={() => setPinned(null)}
              >
                <Trans>Unpin</Trans>
              </button>
            </div>
          )}
        </div>
      </div>
      <div className="border rounded bg-white p-4" data-cy="lag-longest">
        <h2 className="text-sm font-semibold mb-2">
          <Trans>Longest gaps between incident and first report</Trans>
        </h2>
        <ol className="list-decimal pl-5 text-sm">
          {[...lags]
            .sort((a, b) => b.days - a.days)
            .slice(0, 15)
            .map((lag) => (
              <li key={lag.incident_id}>
                <Link to={`/cite/${lag.incident_id}`}>
                  {lag.incident_id}: {lag.title}
                </Link>{' '}
                <span className="text-gray-600">
                  ({lag.date} → {isoDay(lag.firstPublished)}, {formatDays(lag.days)})
                </span>
              </li>
            ))}
        </ol>
      </div>
    </div>
  );
}
