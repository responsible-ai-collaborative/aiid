import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Checkbox, Select, TextInput } from 'flowbite-react';
import { useApolloClient, gql } from '@apollo/client';
import Color from 'color';
import { Trans, useTranslation } from 'react-i18next';
import { Image } from '../../utils/cloudinary';
import Link from 'components/ui/Link';
import useApiAccess from 'hooks/useApiAccess';

// Plot coordinates: t-SNE positions run from -1 to 1 and are drawn into a square viewBox,
// leaving a margin so dots on the edge are not cut off.
const SIZE = 1000;

const SPREAD = 480;

const MIN_ZOOM = 0.5;

const MAX_ZOOM = 24;

// Incident IDs are drawn inside the dots from this zoom level on.
const LABEL_ZOOM = 4;

const DOT_RADIUS = 6;

// MIT Risk Domain classifies almost every incident in a handful of categories, so the map opens
// fully coloured. The CSET sector field covers far fewer incidents.
const DEFAULT_AXES = ['MIT::Risk Domain', 'CSETv1::Sector of Deployment'];

const UNCLASSIFIED = 'Unclassified';

const SEARCH_LIMIT = 8;

const SHOW_CARD_MS = 200;

const HIDE_CARD_MS = 500;

const CARD_WIDTH = 240;

const INCIDENT_CARD_QUERY = gql`
  query ProbablyRelatedIncidentIds($filter: IncidentFilterType) {
    incident(filter: $filter) {
      incident_id
      title
      reports {
        cloudinary_id
        report_number
        title
        url
      }
    }
  }
`;

const prefersReducedMotion = () =>
  typeof window != 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function TsneVisualization({
  currentIncidentId,
  incidents,
  classifications,
  csetClassifications,
  taxa,
}) {
  const { t } = useTranslation();

  const axes = useMemo(
    () => findAxes({ classifications, taxa, csetClassifications }),
    [classifications, taxa, csetClassifications]
  );

  const [axis, setAxis] = useState(DEFAULT_AXES.find((a) => axes.includes(a)) || axes[0]);

  const [hidden, setHidden] = useState(new Set());

  const [highlighted, setHighlighted] = useState(null);

  const [focusId, setFocusId] = useState(null);

  const [query, setQuery] = useState('');

  const [zoomLevel, setZoomLevel] = useState(1);

  const [card, setCard] = useState(null);

  const taxonByIncident = useMemo(() => {
    const [namespace, fieldName] = (axis || '').split('::');

    const result = new Map();

    for (const classification of classifications) {
      if (classification.namespace != namespace || !classification.attributes) continue;

      const attribute = classification.attributes.find((a) => a.short_name == fieldName);

      if (!attributeIsNotEmpty(attribute)) continue;

      const taxon = attributeToTaxon(attribute);

      for (const { incident_id } of classification.incidents) {
        if (!result.has(incident_id)) result.set(incident_id, taxon);
      }
    }
    return result;
  }, [axis, classifications]);

  // Unclassified points come first so the classified ones are drawn on top of them.
  const points = useMemo(
    () =>
      incidents
        .map((incident) => ({
          id: incident.incident_id,
          title: incident.title,
          x: SIZE / 2 + SPREAD * incident.tsne.x,
          y: SIZE / 2 + SPREAD * incident.tsne.y,
          taxon: taxonByIncident.get(incident.incident_id) || UNCLASSIFIED,
        }))
        .sort((a, b) => (b.taxon == UNCLASSIFIED) - (a.taxon == UNCLASSIFIED)),
    [incidents, taxonByIncident]
  );

  const counts = useMemo(
    () =>
      d3.rollup(
        points,
        (group) => group.length,
        (p) => p.taxon
      ),
    [points]
  );

  const taxons = useMemo(
    () =>
      [...counts.keys()].sort(
        (a, b) =>
          (a == UNCLASSIFIED) - (b == UNCLASSIFIED) ||
          counts.get(b) - counts.get(a) ||
          a.localeCompare(b)
      ),
    [counts]
  );

  const colors = useMemo(() => {
    const colorMap = getTaxonColorMap({
      taxons: taxons.includes(UNCLASSIFIED) ? taxons : [...taxons, UNCLASSIFIED],
    });

    colorMap[UNCLASSIFIED] = Color('#d1d5db');
    for (const taxon of taxons) colorMap[taxon] ||= colorMap[UNCLASSIFIED];
    return colorMap;
  }, [taxons]);

  const dotStyles = useMemo(
    () =>
      Object.fromEntries(
        taxons.map((taxon) => [
          taxon,
          {
            fill: colors[taxon].hex(),
            stroke: colors[taxon].darken(0.3).hex(),
            text: colors[taxon].darken(0.1).isDark() ? 'white' : '#111827',
          },
        ])
      ),
    [taxons, colors]
  );

  const visiblePoints = useMemo(() => points.filter((p) => !hidden.has(p.taxon)), [points, hidden]);

  const focusPoint = points.find((p) => p.id == focusId);

  useEffect(() => {
    setHidden(new Set());
    setHighlighted(null);
  }, [axis]);

  // Zooming moves one <g> directly; React only re-renders when the zoom crosses a quarter step,
  // which is when dot sizes and labels need to change.
  const containerRef = useRef(null);

  const svgRef = useRef(null);

  const layerRef = useRef(null);

  const zoomRef = useRef(null);

  const transformRef = useRef(d3.zoomIdentity);

  useEffect(() => {
    const svg = d3.select(svgRef.current);

    let frame = null;

    const zoom = d3
      .zoom()
      .scaleExtent([MIN_ZOOM, MAX_ZOOM])
      .on('zoom', (event) => {
        transformRef.current = event.transform;
        layerRef.current.setAttribute('transform', event.transform.toString());
        if (frame === null) {
          frame = requestAnimationFrame(() => {
            frame = null;
            setZoomLevel(2 ** (Math.round(Math.log2(transformRef.current.k) * 4) / 4));
          });
        }
      });

    svg.call(zoom).on('dblclick.zoom', null);
    zoomRef.current = zoom;

    return () => {
      svg.on('.zoom', null);
      if (frame !== null) cancelAnimationFrame(frame);
    };
  }, []);

  const zoomTo = useCallback((targets, maxScale = 8) => {
    if (!targets.length) return;

    const [x0, x1] = d3.extent(targets, (p) => p.x);

    const [y0, y1] = d3.extent(targets, (p) => p.y);

    const padding = 40;

    const k = Math.min(maxScale, SIZE / Math.max(x1 - x0 + 2 * padding, y1 - y0 + 2 * padding));

    const transform = d3.zoomIdentity
      .translate(SIZE / 2, SIZE / 2)
      .scale(k)
      .translate(-(x0 + x1) / 2, -(y0 + y1) / 2);

    d3.select(svgRef.current)
      .transition()
      .duration(prefersReducedMotion() ? 0 : 750)
      .call(zoomRef.current.transform, transform);
  }, []);

  const zoomBy = (factor) =>
    d3
      .select(svgRef.current)
      .transition()
      .duration(prefersReducedMotion() ? 0 : 250)
      .call(zoomRef.current.scaleBy, factor);

  const resetView = () => zoomTo(visiblePoints);

  // Arriving with ?incident=N (from a citation page) zooms to that incident.
  useEffect(() => {
    const point = points.find((p) => p.id == currentIncidentId);

    if (point) {
      setFocusId(point.id);
      zoomTo([point], 6);
    }
  }, [currentIncidentId]);

  const focusOn = (point) => {
    setFocusId(point.id);
    setQuery('');
    setHidden((current) => {
      if (!current.has(point.taxon)) return current;
      const next = new Set(current);

      next.delete(point.taxon);
      return next;
    });
    zoomTo([point], 6);

    const url = new URL(window.location.href);

    url.searchParams.set('incident', point.id);
    window.history.replaceState(window.history.state, '', url);
  };

  const matches = useMemo(() => searchPoints(points, query), [points, query]);

  const toggleTaxon = (taxon) =>
    setHidden((current) => {
      const next = new Set(current);

      if (next.has(taxon)) next.delete(taxon);
      else next.add(taxon);
      return next;
    });

  // Hover card: shown after a short pause so it does not flash while the mouse crosses the map,
  // and kept briefly after leaving so the pointer can move onto it.
  const client = useApolloClient();

  const { hasApiAccess } = useApiAccess();

  const [cardData, setCardData] = useState({});

  const timers = useRef({});

  const touchScreen = useRef(false);

  const cardId = useRef(null);

  const pointsById = useMemo(() => new Map(points.map((p) => [p.id, p])), [points]);

  const showCard = useCallback(
    (id, clientX, clientY) => {
      const bounds = containerRef.current.getBoundingClientRect();

      cardId.current = id;
      setCard({ id, x: clientX - bounds.left, y: clientY - bounds.top, bounds });

      // The report image is fetched on demand and needs a login (SEE: server/apiAccess.ts).
      if (hasApiAccess) {
        setCardData((loaded) => {
          if (!(id in loaded)) {
            client
              .query({
                query: INCIDENT_CARD_QUERY,
                variables: { filter: { incident_id: { EQ: id } } },
              })
              .then((res) => setCardData((current) => ({ ...current, [id]: res.data.incident })))
              .catch(() => {
                // The card keeps its title and category without the image.
              });
            return { ...loaded, [id]: null };
          }
          return loaded;
        });
      }
    },
    [client, hasApiAccess]
  );

  const keepCard = () => clearTimeout(timers.current.hide);

  const hideCardSoon = () => {
    clearTimeout(timers.current.show);
    timers.current.hide = setTimeout(() => {
      cardId.current = null;
      setCard(null);
    }, HIDE_CARD_MS);
  };

  const onPointEnter = useCallback(
    (event) => {
      if (touchScreen.current) return;
      const id = Number(event.currentTarget.dataset.incidentId);

      const { clientX, clientY } = event;

      clearTimeout(timers.current.hide);
      clearTimeout(timers.current.show);
      timers.current.show = setTimeout(() => showCard(id, clientX, clientY), SHOW_CARD_MS);
    },
    [showCard]
  );

  const onPointLeave = useCallback(() => hideCardSoon(), []);

  const onPointTouch = useCallback(() => {
    touchScreen.current = true;
  }, []);

  // On touch screens the first tap shows the card and the second opens the incident.
  const onPointClick = useCallback(
    (event) => {
      if (!touchScreen.current) return;
      const id = Number(event.currentTarget.dataset.incidentId);

      if (cardId.current != id) {
        event.preventDefault();
        showCard(id, event.clientX, event.clientY);
      }
    },
    [showCard]
  );

  useEffect(() => () => Object.values(timers.current).forEach(clearTimeout), []);

  const cardPoint = card && pointsById.get(card.id);

  return (
    <div className="flex flex-col xl:flex-row gap-4 mt-4 px-2 md:px-0">
      <div className="flex-1 min-w-0">
        <div
          ref={containerRef}
          data-cy="tsne-visualization"
          className="relative mx-auto w-full max-w-[calc(100vh-10rem)] aspect-square border rounded bg-white"
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${SIZE} ${SIZE}`}
            className="w-full h-full cursor-grab active:cursor-grabbing select-none"
            data-cy="tsne-svg"
          >
            <g ref={layerRef}>
              <Points
                points={visiblePoints}
                {...{ dotStyles, highlighted, zoomLevel }}
                onEnter={onPointEnter}
                onLeave={onPointLeave}
                onTouch={onPointTouch}
                onClick={onPointClick}
                currentId={focusId}
              />
              {focusPoint && !hidden.has(focusPoint.taxon) && (
                <circle
                  cx={focusPoint.x}
                  cy={focusPoint.y}
                  r={(DOT_RADIUS * 1.8) / Math.sqrt(zoomLevel)}
                  fill="none"
                  stroke="#111827"
                  strokeWidth={2}
                  vectorEffect="non-scaling-stroke"
                  pointerEvents="none"
                  className="motion-safe:animate-pulse"
                  data-cy="tsne-current-ring"
                />
              )}
            </g>
          </svg>

          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <ZoomButton label={t('Zoom in')} onClick={() => zoomBy(1.6)} dataCy="tsne-zoom-in">
              +
            </ZoomButton>
            <ZoomButton
              label={t('Zoom out')}
              onClick={() => zoomBy(1 / 1.6)}
              dataCy="tsne-zoom-out"
            >
              −
            </ZoomButton>
            <ZoomButton label={t('Reset view')} onClick={resetView} dataCy="tsne-reset">
              ⟲
            </ZoomButton>
          </div>

          {cardPoint && (
            <IncidentCard
              point={cardPoint}
              position={card}
              color={colors[cardPoint.taxon]}
              data={cardData[cardPoint.id]}
              showImage={hasApiAccess}
              onMouseEnter={keepCard}
              onMouseLeave={hideCardSoon}
            />
          )}
        </div>
        <p className="mt-2 text-sm text-gray-600 text-center" data-cy="tsne-summary">
          {t('Showing {{shown}} of {{total}} incidents.', {
            shown: visiblePoints.length,
            total: points.length,
          })}{' '}
          <Trans>Scroll or pinch to zoom and drag to move. Click a dot to open its incident.</Trans>
        </p>
      </div>

      <div className="xl:w-80 shrink-0 space-y-5">
        <div className="relative">
          <label htmlFor="spatial-search" className="block mb-1 font-semibold">
            <Trans>Find an incident</Trans>
          </label>
          <TextInput
            id="spatial-search"
            data-cy="tsne-search"
            type="search"
            autoComplete="off"
            placeholder={t('ID or words from the title')}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => {
              if (event.key == 'Enter' && matches.length) focusOn(matches[0]);
              if (event.key == 'Escape') setQuery('');
            }}
          />
          {query.trim() && (
            <ul
              data-cy="tsne-search-results"
              className="absolute z-20 mt-1 w-full max-h-72 overflow-auto bg-white border rounded shadow"
            >
              {matches.length ? (
                matches.map((point) => (
                  <li key={point.id}>
                    <button
                      type="button"
                      className="w-full text-left px-3 py-1.5 text-sm hover:bg-gray-100"
                      onClick={() => focusOn(point)}
                    >
                      <span className="text-gray-500 mr-1">#{point.id}</span>
                      {point.title}
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-gray-500">
                  <Trans>No matching incidents</Trans>
                </li>
              )}
            </ul>
          )}
        </div>

        <div>
          <label htmlFor="color-axis-select" className="block mb-1 font-semibold">
            <Trans>Color by</Trans>
          </label>
          <Select
            id="color-axis-select"
            data-cy="color-axis-select"
            value={axis}
            onChange={(event) => setAxis(event.target.value)}
          >
            {groupAxes(axes).map(([namespace, fields]) => (
              <optgroup key={namespace} label={namespace}>
                {fields.map((field) => (
                  <option key={field} value={`${namespace}::${field}`}>
                    {field}
                  </option>
                ))}
              </optgroup>
            ))}
          </Select>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1 text-sm">
            <button
              type="button"
              className="text-blue-700 hover:underline"
              onClick={() => setHidden(new Set())}
              data-cy="tsne-show-all"
            >
              <Trans>Show all</Trans>
            </button>
            <button
              type="button"
              className="text-blue-700 hover:underline"
              onClick={() => setHidden(new Set(taxons))}
              data-cy="tsne-hide-all"
            >
              <Trans>Hide all</Trans>
            </button>
          </div>
          <ul data-cy="tsne-legend" className="max-h-[50vh] overflow-auto text-sm">
            {taxons.map((taxon) => (
              <li
                key={taxon}
                onMouseEnter={() => setHighlighted(taxon)}
                onMouseLeave={() => setHighlighted(null)}
              >
                <label className="flex items-center gap-2 py-1 cursor-pointer">
                  <Checkbox
                    className="flex-none"
                    checked={!hidden.has(taxon)}
                    onChange={() => toggleTaxon(taxon)}
                    data-cy="tsne-legend-toggle"
                    data-taxon={taxon}
                  />
                  <Swatch color={colors[taxon]} />
                  <span className="flex-1">
                    <Trans>{taxon}</Trans>
                  </span>
                  <span className="text-gray-500 tabular-nums">{counts.get(taxon)}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

const Points = React.memo(function Points({
  points,
  dotStyles,
  highlighted,
  zoomLevel,
  currentId,
  onEnter,
  onLeave,
  onTouch,
  onClick,
}) {
  // Dots grow more slowly than the space between them, so zooming in separates crowded ones.
  const radius = DOT_RADIUS / Math.sqrt(zoomLevel);

  const showLabels = zoomLevel >= LABEL_ZOOM;

  return points.map((point) => {
    const style = dotStyles[point.taxon];

    const dimmed = highlighted && highlighted != point.taxon;

    return (
      <Link
        key={point.id}
        to={'/cite/' + point.id}
        id={'spatial-incident-' + point.id}
        data-cy="tsne-plotpoint"
        data-incident-id={point.id}
        className={point.id == currentId ? 'current' : undefined}
        onMouseEnter={onEnter}
        onMouseLeave={onLeave}
        onTouchStart={onTouch}
        onClick={onClick}
      >
        <circle
          cx={point.x}
          cy={point.y}
          r={radius}
          fill={style.fill}
          stroke={style.stroke}
          strokeWidth={1}
          vectorEffect="non-scaling-stroke"
          opacity={dimmed ? 0.12 : 0.9}
          style={{ transition: 'opacity 0.3s ease' }}
        />
        {showLabels && (
          <text
            x={point.x}
            y={point.y}
            dy="0.35em"
            textAnchor="middle"
            fontSize={radius * 0.75}
            fill={style.text}
            opacity={dimmed ? 0.12 : 1}
            pointerEvents="none"
          >
            {point.id}
          </text>
        )}
      </Link>
    );
  });
});

function IncidentCard({ point, position, color, data, showImage, onMouseEnter, onMouseLeave }) {
  const { t } = useTranslation();

  // Opens towards whichever side of the point has room for it.
  const right = position.x + CARD_WIDTH + 24 > position.bounds.width && position.x > CARD_WIDTH;

  const below = position.y < position.bounds.height / 2;

  return (
    <Link
      to={'/cite/' + point.id}
      data-cy="incident-card"
      className="absolute z-10 block w-60 overflow-hidden rounded border bg-white shadow-lg text-gray-900 hover:text-gray-900"
      style={{
        left: right ? undefined : position.x + 12,
        right: right ? position.bounds.width - position.x + 12 : undefined,
        top: below ? position.y + 12 : undefined,
        bottom: below ? undefined : position.bounds.height - position.y + 12,
      }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {showImage &&
        (data ? (
          <Image
            publicID={data.reports[0].cloudinary_id}
            alt={data.title}
            className="w-full h-32 object-cover bg-gray-200"
            itemIdentifier={t('Incident {{id}}', { id: data.incident_id }).replace(' ', '.')}
          />
        ) : (
          <div role="status" className="w-full h-32 bg-gray-200 animate-pulse" />
        ))}
      <div className="p-3">
        <div className="text-xs text-gray-500">#{point.id}</div>
        <h3 data-cy="title" className="text-sm font-semibold leading-snug m-0">
          {point.title}
        </h3>
        <div className="mt-2 text-xs text-gray-700">
          <Swatch color={color} />
          <Trans>{point.taxon}</Trans>
        </div>
      </div>
    </Link>
  );
}

function ZoomButton({ label, onClick, dataCy, children }) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      data-cy={dataCy}
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded border bg-white text-lg leading-none text-gray-700 shadow hover:bg-gray-100"
    >
      {children}
    </button>
  );
}

// Matches an incident ID (with or without #) or every word of the query in the title.
function searchPoints(points, query) {
  const text = query.trim().toLowerCase();

  if (!text) return [];

  if (/^#?\d+$/.test(text)) {
    const digits = text.replace('#', '');

    return points
      .filter((p) => String(p.id).startsWith(digits))
      .sort((a, b) => (String(b.id) == digits) - (String(a.id) == digits) || a.id - b.id)
      .slice(0, SEARCH_LIMIT);
  }

  const words = text.split(/\s+/);

  return points
    .filter((p) => {
      const title = (p.title || '').toLowerCase();

      return words.every((word) => title.includes(word));
    })
    .sort((a, b) => a.id - b.id)
    .slice(0, SEARCH_LIMIT);
}

// Only fields whose values repeat across incidents make useful colours.
function findAxes({ classifications, taxa, csetClassifications }) {
  const attributesByAxis = {};

  for (const classification of classifications) {
    if (!classification.attributes?.length) continue;

    const taxonomy = taxa.find((taxonomy) => taxonomy.namespace == classification.namespace);

    for (const attribute of classification.attributes) {
      if (!attributeIsNotEmpty(attribute)) continue;

      const field = taxonomy?.field_list.find((field) => field.short_name == attribute.short_name);

      if (field?.hide_search) continue;

      const axis = classification.namespace + '::' + attribute.short_name;

      attributesByAxis[axis] ||= [];
      attributesByAxis[axis].push(attribute);
    }
  }

  return Object.keys(attributesByAxis).filter((axis) => {
    const values = new Set(attributesByAxis[axis].map((a) => a.value_json));

    const [namespace, fieldName] = axis.split('::');

    return (
      values.size > 1 &&
      values.size < attributesByAxis[axis].length &&
      (namespace != 'CSET' || csetClassifications.includes(fieldName))
    );
  });
}

function groupAxes(axes) {
  return [...d3.group(axes, (axis) => axis.split('::')[0])].map(([namespace, group]) => [
    namespace,
    group.map((axis) => axis.split('::')[1]).sort((a, b) => a.localeCompare(b)),
  ]);
}

var attributeIsNotEmpty = (attribute) =>
  attribute && ![null, undefined, '""', 'null', '', '[]'].includes(attribute.value_json);

function attributeToTaxon(attribute) {
  let taxon = UNCLASSIFIED;

  if (attributeIsNotEmpty(attribute)) {
    const value = JSON.parse(attribute.value_json);

    let stringValue = null;

    if (Array.isArray(value)) {
      if (value.length > 0) {
        stringValue = String(value[0]);
      }
    } else if (typeof value == 'boolean') {
      stringValue = value ? 'True' : 'False';
    } else {
      stringValue = String(value);
    }
    if (stringValue !== null && stringValue.trim().length > 0) {
      taxon = stringValue;
    }
  }
  return taxon;
}

function getTaxonColorMap({ taxons }) {
  let taxonColorMap = {
    Sex: Color('#ff0090'),
    'Sexual orientation or gender identity': Color('#ca9bff'),
    Race: Color('#be9269'),
    'Deliberate or expected': Color('#ff0000'),
    'Harm caused': Color('#ff0000'),
    'Near miss': Color('#00ff00'),
    'Financial harm': Color('#1aaa43'),
    'Financial means': Color('#1aaa43'),
    'Financial services': Color('#1aaa43'),
    Negligible: Color('#fffdcd'),
    Minor: Color('#fff349'),
    'Unclear/unknown': Color('#ebebeb'),
    Moderate: Color('#ffb534'),
    Critical: Color('#ff771d'),
    Severe: Color('#ff0000'),
    Amazon: Color('#ff9a02'),
    Google: Color('#4285F4'),
    Twitter: Color('#1d9fee'),
    Facebook: Color('#4267B2'),
    Tesla: Color('#cc0202'),
    Uber: Color('#000000'),
    YouTube: Color('#FF0000'),
    Unclassified: Color('#FFFFFF'),
  };

  // Select colors spaced evenly around the color wheel.
  // Alternate the saturation and value
  // so that adjacent items are more distinct.
  let hueSteps = Array(taxons.length - 1)
    .fill()
    .map((e, i) => {
      const initialTaxon = taxons.find((taxon) => taxonColorMap[taxon]);

      const degrees =
        (initialTaxon ? taxonColorMap[initialTaxon].hue() : 30) + (360 * i) / taxons.length;

      const color = Color.hsv(
        degrees,
        i % 2 == 0 ? 50 : 100,

        i % 3 == 0 ? 70 : i % 3 == 1 ? 85 : 100
      );

      return { degrees, color };
    });

  const circularDistance = (deg1, deg2) =>
    Math.min(Math.abs(deg1 - deg2), 360 - Math.abs(deg1 - deg2)) % 360;

  // Remove those colors closest to predefined colors
  for (const key of Object.keys(taxonColorMap).filter(
    (key) => taxons.includes(key) && key != 'Unclassified'
  )) {
    const color = taxonColorMap[key];

    const hue = color.hue();

    let closest;

    for (const step of hueSteps) {
      if (
        !closest ||
        circularDistance(step.degrees, hue) < circularDistance(closest.degrees, hue)
      ) {
        closest = step;
      }
    }

    hueSteps = hueSteps.filter((step) => step != closest);
  }

  // Assign the remaining colors arbitrarily
  for (let step of hueSteps) {
    const selection = taxons.find((taxon) => !taxonColorMap[taxon]);

    taxonColorMap[selection] = step.color;

    hueSteps = hueSteps.filter((s) => s != step);
  }
  return taxonColorMap;
}

function Swatch({ color }) {
  return (
    <span
      className="inline-block w-3 h-3 mr-1 -mb-px rounded shrink-0"
      style={{ background: color, border: '2px solid ' + color.darken(0.15).desaturate(0.2) }}
    />
  );
}
