import React, { useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Trans } from 'react-i18next';
import Link from 'components/ui/Link';

const WIDTH = 960;

const HEIGHT = 560;

const NO_AUTHOR = 'no author listed';

// duration of the zoom into a publication and back out, in milliseconds
const ZOOM_MS = 500;

// Publication dates arrive as date strings; a few are missing or implausible.
const yearOf = (value) => {
  const time = value ? Date.parse(value) : NaN;

  return Number.isNaN(time) ? null : new Date(time).getUTCFullYear();
};

const topLevel = (domain) => {
  const parts = domain.split('.');

  return parts.length > 1 ? parts[parts.length - 1] : domain;
};

const inYear = (report, year) => year === 'all' || yearOf(report.date_published) === year;

// Report counts per source domain, optionally limited to one publication year
// and optionally grouped by top-level domain. Only the top `limit` domains
// become tiles; the long tail is reported as a share in the summary line so
// the tiles can use the whole area.
export function buildTreemap({ reports, year, groupByTld, limit }) {
  const counts = new Map();

  let total = 0;

  for (const report of reports) {
    if (!report.source_domain || !inYear(report, year)) continue;

    counts.set(report.source_domain, (counts.get(report.source_domain) || 0) + 1);
    total += 1;
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));

  const kept = sorted.slice(0, limit).map(([domain, count]) => ({ name: domain, count }));

  const shown = kept.reduce((sum, leaf) => sum + leaf.count, 0);

  let children;

  if (groupByTld) {
    const groups = d3.group(kept, (leaf) => topLevel(leaf.name));

    children = [...groups.entries()].map(([tld, leaves]) => ({
      name: `.${tld}`,
      children: leaves,
    }));
  } else {
    children = kept;
  }

  const root = d3
    .hierarchy({ name: 'root', children })
    .sum((node) => node.count || 0)
    .sort((a, b) => b.value - a.value);

  d3
    .treemap()
    .size([WIDTH, HEIGHT])
    .paddingInner(2)
    .paddingOuter(groupByTld ? 6 : 2)
    .paddingTop(groupByTld ? 18 : 2)(root);

  return { root, total, shown, domains: sorted.length };
}

// The next level of detail: one domain's reports by author. A report with
// several authors counts once for each; reports without an author share one tile.
export function buildAuthorTreemap({ reports, year, domain }) {
  const counts = new Map();

  let total = 0;

  for (const report of reports) {
    if (report.source_domain !== domain || !inYear(report, year)) continue;

    total += 1;

    const authors = (report.authors || []).filter((name) => name && name.trim());

    for (const author of authors.length > 0 ? authors : [NO_AUTHOR]) {
      counts.set(author, (counts.get(author) || 0) + 1);
    }
  }

  const children = [...counts.entries()].map(([name, count]) => ({
    name,
    count,
    unknown: name === NO_AUTHOR,
  }));

  const root = d3
    .hierarchy({ name: domain, children })
    .sum((node) => node.count || 0)
    .sort((a, b) => b.value - a.value);

  d3.treemap().size([WIDTH, HEIGHT]).paddingInner(2).paddingOuter(2)(root);

  return { root, total, authors: counts.size - (counts.has(NO_AUTHOR) ? 1 : 0) };
}

const fitLabel = (label, width) =>
  label.length * 6 > width ? label.slice(0, Math.max(3, Math.floor(width / 6) - 1)) + '…' : label;

export default function MediaTreemap({ reports }) {
  const years = useMemo(() => {
    const set = new Set();

    for (const report of reports) {
      const year = yearOf(report.date_published);

      if (year !== null && year >= 1990) set.add(year);
    }

    return [...set].sort((a, b) => b - a);
  }, [reports]);

  const [year, setYear] = useState('all');

  const [groupByTld, setGroupByTld] = useState(false);

  const [limit, setLimit] = useState(100);

  const [hovered, setHovered] = useState(null);

  // the publication zoomed into, with the tile it grew out of
  const [focus, setFocus] = useState(null);

  // false while the author tiles still sit inside the publication's tile
  const [zoomed, setZoomed] = useState(false);

  const authorsRef = useRef(null);

  const timer = useRef(null);

  const { root, total, shown, domains } = useMemo(
    () => buildTreemap({ reports, year, groupByTld, limit }),
    [reports, year, groupByTld, limit]
  );

  const authorTree = useMemo(
    () => (focus ? buildAuthorTreemap({ reports, year, domain: focus.domain }) : null),
    [reports, year, focus]
  );

  // Once the author tiles are in the DOM at the size of the publication's tile,
  // let the browser lay them out, then expand them to the whole box.
  useEffect(() => {
    if (!focus) return undefined;

    if (authorsRef.current) authorsRef.current.getBoundingClientRect();

    const frame = requestAnimationFrame(() => setZoomed(true));

    return () => cancelAnimationFrame(frame);
  }, [focus]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const zoomIn = (leaf) => {
    clearTimeout(timer.current);
    setZoomed(false);
    setFocus({ domain: leaf.data.name, x0: leaf.x0, y0: leaf.y0, x1: leaf.x1, y1: leaf.y1 });
    setHovered(null);
  };

  const zoomOut = () => {
    setZoomed(false);
    setHovered(null);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setFocus(null), ZOOM_MS);
  };

  const groups = root.children ? root.children.filter((node) => node.children) : [];

  const leaves = root.leaves();

  const color = d3.scaleOrdinal(d3.schemeTableau10).domain(groups.map((group) => group.data.name));

  const fillOf = (leaf) =>
    groupByTld && leaf.parent && leaf.parent !== root
      ? color(leaf.parent.data.name)
      : d3.interpolateBlues(0.35 + (0.6 * leaf.value) / (leaves[0]?.value || 1));

  const authorLeaves = authorTree && authorTree.total > 0 ? authorTree.root.leaves() : [];

  const authorFill = (leaf) =>
    leaf.data.unknown
      ? '#d1d5db'
      : d3.interpolateOranges(0.3 + (0.55 * leaf.value) / (authorLeaves[0]?.value || 1));

  const authorsTransform = focus
    ? zoomed
      ? 'translate(0px, 0px) scale(1, 1)'
      : `translate(${focus.x0}px, ${focus.y0}px) scale(${(focus.x1 - focus.x0) / WIDTH}, ${
          (focus.y1 - focus.y0) / HEIGHT
        })`
    : undefined;

  return (
    <div className="flex flex-col gap-4" data-cy="media-treemap">
      <div className="flex flex-wrap items-center gap-4 text-sm">
        <label className="flex items-center gap-2">
          <Trans>Publication year</Trans>
          <select
            className="rounded border-gray-300 text-sm"
            value={year}
            data-cy="treemap-year"
            onChange={(event) =>
              setYear(event.target.value === 'all' ? 'all' : Number(event.target.value))
            }
          >
            <option value="all">all years</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <Trans>Domains shown</Trans>
          <select
            className="rounded border-gray-300 text-sm"
            value={limit}
            data-cy="treemap-limit"
            onChange={(event) => setLimit(Number(event.target.value))}
          >
            {[50, 100, 200].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            className="rounded"
            checked={groupByTld}
            data-cy="treemap-group"
            onChange={() => setGroupByTld(!groupByTld)}
          />
          <Trans>Group by top-level domain</Trans>
        </label>
      </div>
      <p className="text-sm text-gray-600" data-cy="treemap-summary">
        {total} <Trans>reports from</Trans> {domains} <Trans>domains</Trans>;{' '}
        <Trans>the domains shown account for</Trans> {total ? Math.round((100 * shown) / total) : 0}
        %.{' '}
        <Trans>
          Tile area is the number of reports. Click a publication to zoom into its authors, and an
          author to open those reports in Discover.
        </Trans>
      </p>
      <p className="text-sm flex flex-wrap items-center gap-2" data-cy="treemap-focus">
        {focus ? (
          <>
            <button
              type="button"
              className="rounded border border-gray-300 px-2 py-1"
              data-cy="treemap-back"
              onClick={zoomOut}
            >
              ← <Trans>All domains</Trans>
            </button>
            <span>
              <strong>{focus.domain}</strong>: {authorTree.total} <Trans>reports</Trans>,{' '}
              {authorTree.authors} <Trans>authors</Trans>
            </span>
          </>
        ) : (
          <span className="text-gray-600">
            <Trans>All domains</Trans>
          </span>
        )}
      </p>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full border rounded bg-white"
        data-cy="media-treemap-svg"
      >
        <g
          style={{
            opacity: focus ? 0.2 : 1,
            transition: `opacity ${ZOOM_MS}ms ease`,
            pointerEvents: focus ? 'none' : undefined,
          }}
        >
          {groups.map((group) => (
            <g key={group.data.name}>
              <rect
                x={group.x0}
                y={group.y0}
                width={group.x1 - group.x0}
                height={group.y1 - group.y0}
                fill="none"
                stroke={color(group.data.name)}
                strokeWidth={1.5}
              />
              <text
                x={group.x0 + 6}
                y={group.y0 + 13}
                fontSize={11}
                fontWeight={700}
                fill="#111827"
              >
                {group.data.name} ({group.value})
              </text>
            </g>
          ))}
          {leaves.map((leaf) => {
            const w = leaf.x1 - leaf.x0;

            const h = leaf.y1 - leaf.y0;

            const label = leaf.data.name;

            const isHovered = hovered && hovered.leaf === leaf;

            return (
              <g
                key={label}
                transform={`translate(${leaf.x0},${leaf.y0})`}
                data-cy="treemap-tile"
                data-domain={label}
                className="cursor-pointer"
                onMouseEnter={() =>
                  setHovered({ leaf, name: label, value: leaf.value, of: total, what: 'reports' })
                }
                onMouseLeave={() => setHovered(null)}
                onClick={() => zoomIn(leaf)}
              >
                <title>{`${label}: ${leaf.value} reports (${(
                  (100 * leaf.value) /
                  (total || 1)
                ).toFixed(1)}%)`}</title>
                <rect
                  width={w}
                  height={h}
                  fill={fillOf(leaf)}
                  stroke={isHovered ? '#111827' : '#ffffff'}
                  strokeWidth={isHovered ? 2 : 1}
                />
                {w > 48 && h > 16 && (
                  <text x={4} y={12} fontSize={10} fill="#111827" pointerEvents="none">
                    {fitLabel(label, w)}
                  </text>
                )}
                {w > 48 && h > 30 && (
                  <text x={4} y={25} fontSize={10} fill="#374151" pointerEvents="none">
                    {leaf.value}
                  </text>
                )}
              </g>
            );
          })}
        </g>
        {focus && (
          <g
            ref={authorsRef}
            data-cy="treemap-authors"
            style={{
              transformOrigin: '0 0',
              transform: authorsTransform,
              transition: `transform ${ZOOM_MS}ms ease`,
            }}
          >
            {authorLeaves.map((leaf) => {
              const w = leaf.x1 - leaf.x0;

              const h = leaf.y1 - leaf.y0;

              const label = leaf.data.name;

              const isHovered = hovered && hovered.leaf === leaf;

              const to = leaf.data.unknown
                ? `/apps/discover?source_domain=${encodeURIComponent(focus.domain)}`
                : `/apps/discover?source_domain=${encodeURIComponent(
                    focus.domain
                  )}&authors=${encodeURIComponent(label)}`;

              return (
                <Link key={label} to={to}>
                  <g
                    transform={`translate(${leaf.x0},${leaf.y0})`}
                    data-cy="treemap-author"
                    data-author={label}
                    className="cursor-pointer"
                    onMouseEnter={() =>
                      setHovered({
                        leaf,
                        name: label,
                        value: leaf.value,
                        of: authorTree.total,
                        what: `reports from ${focus.domain}`,
                      })
                    }
                    onMouseLeave={() => setHovered(null)}
                  >
                    <title>{`${label}: ${leaf.value} reports`}</title>
                    <rect
                      width={w}
                      height={h}
                      fill={authorFill(leaf)}
                      stroke={isHovered ? '#111827' : '#ffffff'}
                      strokeWidth={isHovered ? 2 : 1}
                    />
                    {zoomed && w > 48 && h > 16 && (
                      <text x={4} y={12} fontSize={10} fill="#111827" pointerEvents="none">
                        {fitLabel(label, w)}
                      </text>
                    )}
                    {zoomed && w > 48 && h > 30 && (
                      <text x={4} y={25} fontSize={10} fill="#374151" pointerEvents="none">
                        {leaf.value}
                      </text>
                    )}
                  </g>
                </Link>
              );
            })}
          </g>
        )}
      </svg>
      <p className="text-sm min-h-[1.5rem]" data-cy="treemap-hover">
        {hovered ? (
          <>
            <strong>{hovered.name}</strong>: {hovered.value} {hovered.what} (
            {((100 * hovered.value) / (hovered.of || 1)).toFixed(1)}%)
          </>
        ) : (
          <span className="text-gray-600">
            <Trans>Hover a tile for its share of the reports.</Trans>
          </span>
        )}
      </p>
    </div>
  );
}
