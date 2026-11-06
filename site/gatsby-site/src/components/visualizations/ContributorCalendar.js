import React, { useMemo, useState } from 'react';
import * as d3 from 'd3';
import { Trans } from 'react-i18next';
import Link from 'components/ui/Link';

const CELL = 13;

const GAP = 2;

const LEFT = 30;

const TOP = 20;

const DAY = 86400000;

const dayKey = (date) => date.toISOString().slice(0, 10);

// Flattens the reports nested under incidents into one record per report with
// its incident id, keeping only reports with a submission date.
export function flattenReports(incidents) {
  const seen = new Map();

  for (const incident of incidents) {
    for (const report of incident.reports || []) {
      if (!report.date_submitted || seen.has(report.report_number)) continue;

      const date = new Date(Date.parse(report.date_submitted));

      if (Number.isNaN(date.getTime()) || date.getUTCFullYear() < 1990) continue;

      seen.set(report.report_number, {
        report_number: report.report_number,
        title: report.title,
        submitters: report.submitters || [],
        incident_id: incident.incident_id,
        day: dayKey(date),
        year: date.getUTCFullYear(),
      });
    }
  }

  return [...seen.values()];
}

export function buildCalendar({ reports, year, submitter }) {
  const filtered = reports.filter(
    (report) =>
      report.year === year && (submitter === 'all' || report.submitters.includes(submitter))
  );

  const byDay = d3.group(filtered, (report) => report.day);

  const start = new Date(Date.UTC(year, 0, 1));

  const end = new Date(Date.UTC(year + 1, 0, 1));

  const days = [];

  for (let t = start.getTime(); t < end.getTime(); t += DAY) {
    const date = new Date(t);

    const key = dayKey(date);

    const week = Math.floor((t - start.getTime() + start.getUTCDay() * DAY) / (7 * DAY));

    days.push({ key, date, week, weekday: date.getUTCDay(), reports: byDay.get(key) || [] });
  }

  const months = d3.range(12).map((month) => {
    const first = new Date(Date.UTC(year, month, 1));

    return {
      label: first.toLocaleString('en', { month: 'short', timeZone: 'UTC' }),
      week: Math.floor((first.getTime() - start.getTime() + start.getUTCDay() * DAY) / (7 * DAY)),
    };
  });

  return { days, months, total: filtered.length };
}

export default function ContributorCalendar({ incidents }) {
  const reports = useMemo(() => flattenReports(incidents), [incidents]);

  // every year with a submission, latest first: one calendar row each
  const years = useMemo(
    () => [...new Set(reports.map((report) => report.year))].sort((a, b) => b - a),
    [reports]
  );

  const [submitter, setSubmitter] = useState('all');

  const [selectedDay, setSelectedDay] = useState(null);

  const submitters = useMemo(() => {
    const counts = new Map();

    for (const report of reports) {
      for (const name of report.submitters) counts.set(name, (counts.get(name) || 0) + 1);
    }

    return [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [reports]);

  const calendars = useMemo(
    () => years.map((year) => ({ year, ...buildCalendar({ reports, year, submitter }) })),
    [reports, years, submitter]
  );

  const days = calendars.flatMap((calendar) => calendar.days);

  // Bulk imports put more than a thousand reports on a single day; the shading
  // is a square-root scale that saturates at the 98th percentile of the busy
  // days, so ordinary days stay visible next to them.
  const busyCounts = days
    .map((day) => day.reports.length)
    .filter((count) => count > 0)
    .sort(d3.ascending);

  const saturation = d3.quantileSorted(busyCounts, 0.98) || 1;

  const color = d3.scaleSequentialSqrt(d3.interpolateGreens).domain([0, saturation]).clamp(true);

  const total = calendars.reduce((sum, calendar) => sum + calendar.total, 0);

  const busiest = [...days].sort((a, b) => b.reports.length - a.reports.length)[0];

  const selected = selectedDay ? days.find((day) => day.key === selectedDay) : null;

  return (
    <div className="flex flex-col gap-4" data-cy="contributor-calendar">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <Trans>Submitter</Trans>
          <select
            className="rounded border-gray-300 text-sm max-w-xs"
            value={submitter}
            data-cy="calendar-submitter"
            onChange={(event) => {
              setSubmitter(event.target.value);
              setSelectedDay(null);
            }}
          >
            <option value="all">all submitters</option>
            {submitters.map(([name, count]) => (
              <option key={name} value={name}>
                {name} ({count})
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="text-sm text-gray-600" data-cy="calendar-summary">
        {total} <Trans>reports submitted</Trans>
        {years.length > 0 && (
          <>
            {' '}
            <Trans>from</Trans> {years[years.length - 1]} <Trans>to</Trans> {years[0]}
          </>
        )}
        {busiest && busiest.reports.length > 0 && (
          <>
            , <Trans>busiest day</Trans> {busiest.key} ({busiest.reports.length})
          </>
        )}
        . <Trans>One row per year. Click a day to list its reports.</Trans>
      </p>
      <div className="flex flex-col gap-2">
        {calendars.map((calendar) => {
          const weeks = (d3.max(calendar.days, (day) => day.week) || 52) + 1;

          const width = LEFT + weeks * (CELL + GAP) + 4;

          const height = TOP + 7 * (CELL + GAP) + 4;

          return (
            <div
              key={calendar.year}
              className="flex items-center gap-3"
              data-cy="calendar-year-row"
              data-year={calendar.year}
            >
              <div className="w-16 shrink-0 text-sm">
                <strong>{calendar.year}</strong>
                <br />
                <span className="text-gray-600">{calendar.total}</span>
              </div>
              <div className="overflow-x-auto">
                <svg
                  viewBox={`0 0 ${width} ${height}`}
                  width={width}
                  height={height}
                  className="bg-white border rounded"
                  data-cy="calendar-svg"
                >
                  {calendar.months.map((month) => (
                    <text
                      key={month.label}
                      x={LEFT + month.week * (CELL + GAP)}
                      y={12}
                      fontSize={10}
                      fill="#374151"
                    >
                      {month.label}
                    </text>
                  ))}
                  {['Mon', 'Wed', 'Fri'].map((label, i) => (
                    <text
                      key={label}
                      x={2}
                      y={TOP + (1 + i * 2) * (CELL + GAP) + CELL - 2}
                      fontSize={9}
                      fill="#374151"
                    >
                      {label}
                    </text>
                  ))}
                  {calendar.days.map((day) => (
                    <rect
                      key={day.key}
                      x={LEFT + day.week * (CELL + GAP)}
                      y={TOP + day.weekday * (CELL + GAP)}
                      width={CELL}
                      height={CELL}
                      rx={2}
                      fill={day.reports.length > 0 ? color(day.reports.length) : '#f3f4f6'}
                      stroke={selectedDay === day.key ? '#111827' : 'none'}
                      strokeWidth={1.5}
                      className={day.reports.length > 0 ? 'cursor-pointer' : undefined}
                      data-cy="calendar-day"
                      data-count={day.reports.length}
                      onClick={() =>
                        day.reports.length > 0 &&
                        setSelectedDay(selectedDay === day.key ? null : day.key)
                      }
                    >
                      <title>{`${day.key}: ${day.reports.length} reports`}</title>
                    </rect>
                  ))}
                </svg>
              </div>
            </div>
          );
        })}
      </div>
      <div className="border rounded bg-white p-4" data-cy="calendar-panel">
        {selected ? (
          <>
            <h2 className="text-sm font-semibold mb-2">
              {selected.key}: {selected.reports.length} <Trans>reports</Trans>
            </h2>
            <ul className="list-disc pl-5 text-sm max-h-[520px] overflow-y-auto">
              {selected.reports.slice(0, 300).map((report) => (
                <li key={report.report_number}>
                  <Link to={`/cite/${report.incident_id}#r${report.report_number}`}>
                    {report.title}
                  </Link>{' '}
                  {report.submitters.length > 0 && (
                    <span className="text-gray-600">
                      (
                      {report.submitters.map((name, i) => (
                        <React.Fragment key={`${name}-${i}`}>
                          {i > 0 && ', '}
                          <Link
                            to={`/apps/discover?submitters=${encodeURIComponent(name)}`}
                            data-cy="calendar-submitter-link"
                          >
                            {name}
                          </Link>
                        </React.Fragment>
                      ))}
                      )
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {selected.reports.length > 300 && (
              <p className="text-sm text-gray-600 mt-2">
                +{selected.reports.length - 300} <Trans>more</Trans>
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-600">
            <Trans>No day selected.</Trans>
          </p>
        )}
      </div>
    </div>
  );
}
