import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import styled from 'styled-components';
import { useApolloClient, gql } from '@apollo/client';
import { Image } from '../../utils/cloudinary';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Color from 'color';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans, useTranslation } from 'react-i18next';

export default function TsneVisualization({
  currentIncidentId,
  incidents,
  classifications,
  csetClassifications,
}) {
  const [axis, setAxis] = useState('CSET::Sector of Deployment');

  const [axisNamespace, axisFieldName] = axis.split('::');

  const [highlightedCategory, setHighlightedCategory] = useState(null);

  const currentSpatialIncident = incidents.find(
    (incident) => incident.incident_id == currentIncidentId
  );

  const classificationsWithAttributes = classifications.filter(
    (c) => c.attributes != null && c.attributes.length > 0
  );

  const axes = [];

  const attributesByAxis = {};

  for (const classification of classificationsWithAttributes) {
    for (const attribute of classification.attributes) {
      if (attributeIsNotEmpty(attribute)) {
        const axis = classification.namespace + '::' + attribute.short_name;

        attributesByAxis[axis] ||= [];
        attributesByAxis[axis].push(attribute);
      }
    }
  }

  for (const axis in attributesByAxis) {
    const axisAttributes = attributesByAxis[axis];

    const uniqueValues = new Set(axisAttributes.map((a) => a.value_json));

    const multipleValuesExist = 1 < uniqueValues.size;

    const repeatingValuesExist = uniqueValues.size < axisAttributes.length;

    if (
      multipleValuesExist &&
      repeatingValuesExist &&
      (axis.split('::')[0] != 'CSET' || csetClassifications.includes(axis.split('::')[1]))
    ) {
      axes.push(axis);
    }
  }

  const taxons = Array.from(
    new Set(
      classificationsWithAttributes
        .filter((c) => c.namespace == axisNamespace)
        .map((c) => c.attributes.find((a) => a.short_name == axisFieldName))
        .filter((a) => a && a.value_json)
        .map((a) => attributeToTaxon(a))
        .reduce((result, value) => result.concat(value), [])
        .filter((value) => value)
        .concat('Unclassified')
    )
  );

  const taxonColorMap = getTaxonColorMap({ taxons });

  const getTaxonVisibility = () =>
    [...taxons].reduce((visibility, taxon) => ({ ...visibility, [taxon]: true }), {
      Unclassified: true,
    });

  const [taxonVisibility, setTaxonVisibility] = useState(getTaxonVisibility());

  useEffect(() => {
    setHighlightedCategory(null);
    setTaxonVisibility(getTaxonVisibility());
  }, [axis]);

  return (
    incidents &&
    (currentSpatialIncident || !currentIncidentId || currentIncidentId < 1) && (
      <>
        <VisualizationLayout>
          <VisualizationView
            {...{
              incidents,
              classifications,
              currentSpatialIncident,
              currentIncidentId,
              taxonColorMap,
              taxonVisibility,
              axis,
              axisNamespace,
              axisFieldName,
              highlightedCategory,
            }}
          />
          <Sidebar>
            <label htmlFor="color-axis-select">
              <Trans>Color by incident classifications from taxonomies</Trans>
            </label>
            <Form.Select
              className="my-4 w-full"
              id="color-axis-select"
              onChange={(event) => setAxis(event.target.value)}
              data-cy="color-axis-select"
            >
              {axes.map((axis) => (
                <option key={axis} value={axis}>
                  {axis}
                </option>
              ))}
            </Form.Select>
            <ul>
              {taxons.map((taxon) => (
                <li
                  key={taxon}
                  className={
                    'cursor-pointer' +
                    (taxonVisibility[taxon]
                      ? highlightedCategory &&
                        taxonVisibility[highlightedCategory] &&
                        highlightedCategory != taxon
                        ? ' opacity-50'
                        : ''
                      : ' opacity-10')
                  }
                >
                  <button
                    style={{
                      background: 'none',
                      padding: '0px',
                      margin: '0px',
                      border: 'none',
                      textAlign: 'left',
                    }}
                    className="-indent-4 pl-4"
                    onMouseEnter={() => setHighlightedCategory(taxon)}
                    onMouseLeave={() => setHighlightedCategory(null)}
                    onClick={() =>
                      setTaxonVisibility((taxonVisibility) => ({
                        ...taxonVisibility,
                        [taxon]: !taxonVisibility[taxon],
                      }))
                    }
                  >
                    <Swatch color={taxonColorMap[taxon]} />
                    <Trans>{taxon}</Trans>
                  </button>
                </li>
              ))}
            </ul>
          </Sidebar>
        </VisualizationLayout>
      </>
    )
  );
}

function VisualizationView({
  incidents,
  classifications,
  currentSpatialIncident,
  currentIncidentId,
  taxonColorMap,
  taxonVisibility,
  axis,
  axisNamespace,
  axisFieldName,
  highlightedCategory,
}) {
  return (
    <VisualizationWrapper data-cy="tsne-visualization">
      <TransformWrapper
        initialScale={currentSpatialIncident ? 2 : 1}
        initialPositionX={-500 + -500 * currentSpatialIncident?.tsne?.x || 0}
        initialPositionY={-500 + -500 * currentSpatialIncident?.tsne?.y || 0}
        limitToBounds={false}
        minScale={0.5}
        maxScale={10}
      >
        {({ state }) => (
          <TransformComponent className="h-full">
            <Visualization className="h-full">
              {incidents.map((incident) => {
                // I'm pretty sure the JS engine is smart enough to memoize this,
                // but I'm not taking my chances.
                const scaleMultiplier = 1 / Math.sqrt(state.scale);

                return (
                  <PlotPoint
                    classifications={
                      classifications.filter(
                        (classification) => classification.incident_id == incident.incident_id
                      ) || []
                    }
                    key={incident.incident_id}
                    {...{
                      highlightedCategory,
                      currentIncidentId,
                      axis,
                      axisNamespace,
                      axisFieldName,
                      taxonColorMap,
                      taxonVisibility,
                      scaleMultiplier,
                      state,
                      incident,
                    }}
                  />
                );
              })}
            </Visualization>
          </TransformComponent>
        )}
      </TransformWrapper>
    </VisualizationWrapper>
  );
}

function PlotPoint({
  state,
  incident,
  scaleMultiplier,
  classifications,
  taxonColorMap,
  taxonVisibility,
  axisNamespace,
  axisFieldName,
  currentIncidentId,
  highlightedCategory,
}) {
  const client = useApolloClient();

  const { t } = useTranslation();

  const [incidentData, setIncidentData] = useState(null);

  // We have to track this and render the incident card only when hovered.
  // Just hiding it with css is too slow and makes zooming laggy.
  const [hover, setHover] = useState(false);

  const [touchScreen, setTouchScreen] = useState(false);

  const [hoverTimeout, setHoverTimeout] = useState(null);

  let taxon = 'Unclassified';

  if (classifications) {
    const classification = classifications.find((c) => c.namespace == axisNamespace);

    if (classification && classification.attributes && classification.attributes.length > 0) {
      const attribute = classification.attributes.find((a) => a.short_name == axisFieldName);

      taxon = attributeToTaxon(attribute);
    }
  }

  const background = (taxonColorMap[taxon] || Color('#ffffff')).opaquer(-0.25);

  const borderColor = background.darken(0.15).desaturate(0.2);

  // isDark() returns false for values that I find hard to read black text against,
  // so we pretend it's darker than it really is.
  const color = background?.darken(0.1).isDark() ? 'white' : 'black';

  const [clientPosition, setClientPosition] = useState(null);

  const onTop = typeof window != 'undefined' && clientPosition?.y < window.innerHeight / 2;

  const onLeft = typeof window != 'undefined' && clientPosition?.x < window.innerWidth / 2;

  const showIncidentCard = (event) => {
    setHover(true);
    setClientPosition({ x: event.clientX, y: event.clientY });
    if (!incidentData) {
      client
        .query({
          query: gql`
            query ProbablyRelatedIncidentIds($query: IncidentQueryInput) {
              incident(query: $query) {
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
          `,
          variables: { query: { incident_id: incident.incident_id } },
        })
        .then((res) => {
          setIncidentData(res.data.incident);
        });
    }
  };

  if (taxonVisibility[taxon] === false) {
    return null;
  }

  return (
    <>
      <LocalizedLink
        id={'spatial-incident-' + incident.incident_id}
        to={'/cite/' + incident.incident_id}
        data-cy="tsne-plotpoint"
        data-cy-background={taxonColorMap[taxon] ? background : undefined}
        style={{
          top: `calc(50% + 48% * ${incident.tsne.y})`,
          left: `calc(50% + 48% * ${incident.tsne.x})`,
          border: '2px solid ' + borderColor.hex(),
          opacity:
            highlightedCategory &&
            taxonVisibility[highlightedCategory] &&
            highlightedCategory != taxon
              ? 0.1
              : 1,
          zIndex: highlightedCategory == taxon ? 3 : taxon != 'Unclassified' ? 2 : 1,
          background,
          color,

          // The points do not grow as fast as the space between them,
          // allowing the user to zoom to more accurately select
          // from points that are very close to each other.
          transform: `scale(${scaleMultiplier})`,
        }}
        className={`${incident.incident_id == currentIncidentId ? 'current' : ''} hover:z-10`}
        onTouchStart={() => {
          setTouchScreen(true);
        }}
        onMouseEnter={(event) => {
          // Timeout prevents the cards from showing up
          // when you're just moving the mouse across the screen
          if (!touchScreen) {
            setHoverTimeout(
              setTimeout(() => {
                showIncidentCard(event);
              }, 200)
            );
          }
        }}
        onMouseLeave={() => {
          // This gives time to move the mouse over the card before it disappears
          clearTimeout(hoverTimeout);
          setHoverTimeout(setTimeout(() => setHover(false), 500));
        }}
        onClick={(event) => {
          if (touchScreen) {
            if (!hover) {
              event.preventDefault();
              showIncidentCard(event);
            }
          }
        }}
      >
        <span>{incident.incident_id}</span>
      </LocalizedLink>

      {hover && ( // Incident Card
        <LocalizedLink
          to={'/cite/' + incident.incident_id}
          data-cy="incident-card"
          className="incident-card"
          style={{
            top: onTop ? `calc(50% + 48% * ${incident.tsne.y} + ${scaleMultiplier}em)` : undefined,
            bottom: !onTop
              ? `calc(50% - 48% * ${incident.tsne.y} + ${scaleMultiplier}em)`
              : undefined,
            left: onLeft
              ? `calc(50% + 48% * ${incident.tsne.x} + ${scaleMultiplier}em)`
              : undefined,
            right: !onLeft
              ? `calc(50% - 48% * ${incident.tsne.x} + ${scaleMultiplier}em)`
              : undefined,
            transform: `scale(${1 / state.scale})`,
            transformOrigin: `${onTop ? 'top' : 'bottom'} ${onLeft ? 'left' : 'right'}`,
            zIndex: 10,
          }}
          onMouseEnter={() => {
            clearTimeout(hoverTimeout);
            setHoverTimeout(null);
          }}
          onMouseLeave={() => setHoverTimeout(setTimeout(() => setHover(false), 500))}
        >
          {incidentData ? (
            <>
              <Image
                publicID={incidentData.reports[0].cloudinary_id}
                title={incidentData.title}
                className="bg-gray-300"
                itemIdentifier={t('Incident {{id}}', { id: incidentData.incident_id }).replace(
                  ' ',
                  '.'
                )}
              />
            </>
          ) : (
            <div role="status" className="animate-pulse md:flex md:items-center -m-4 mb-2">
              <div className="flex items-center justify-center w-full h-32 bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                <svg
                  className="w-12 h-12 text-gray-200"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 640 512"
                >
                  <path d="M480 80C480 35.82 515.8 0 560 0C604.2 0 640 35.82 640 80C640 124.2 604.2 160 560 160C515.8 160 480 124.2 480 80zM0 456.1C0 445.6 2.964 435.3 8.551 426.4L225.3 81.01C231.9 70.42 243.5 64 256 64C268.5 64 280.1 70.42 286.8 81.01L412.7 281.7L460.9 202.7C464.1 196.1 472.2 192 480 192C487.8 192 495 196.1 499.1 202.7L631.1 419.1C636.9 428.6 640 439.7 640 450.9C640 484.6 612.6 512 578.9 512H55.91C25.03 512 .0006 486.1 .0006 456.1L0 456.1z" />
                </svg>
              </div>
            </div>
          )}
          <div>
            <h3 data-cy="title">{incident.title}</h3>
            {taxon && (
              <div style={{ marginTop: '.5em' }}>
                <Swatch color={background} />
                {taxon}
              </div>
            )}
          </div>
        </LocalizedLink>
      )}
    </>
  );
}

var attributeIsNotEmpty = (attribute) =>
  attribute && ![null, undefined, '""', 'null', '', '[]'].includes(attribute.value_json);

function attributeToTaxon(attribute) {
  let taxon = 'Unclassified';

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
      className="inline-block w-3 h-3 mr-1 -mb-px rounded"
      style={{ background: color, border: '2px solid ' + color.darken(0.15).desaturate(0.2) }}
    />
  );
}

var visualizationHeight = 'calc(100vh - 2rem)';

function VisualizationLayout({ children }) {
  return (
    // Add a little extra padding on mobile
    // so there's space to swipe for scrolling
    <div
      className="flex flex-col xl:flex-row mt-4 px-2 md:px-0"
      style={{
        height: visualizationHeight,
      }}
    >
      {children}
    </div>
  );
}

function Sidebar({ children }) {
  return (
    <div
      className="
      p-4 border-2 border-l-0 border-gray-200 overflow-auto
      w-full  h-60
      xl:w-80 xl:h-full
    "
    >
      {children}
    </div>
  );
}

// TransformWrapper > TransformComponent > Visualization
var VisualizationWrapper = styled.div`
  width: 100%;
  height: ${visualizationHeight};
  flex-shrink: shrink;
  overflow-x: hidden;
  background: #ccc;

  > .react-transform-wrapper {
    width: 100% !important;
    height: 100%;

    > .react-transform-component {
      height: ${visualizationHeight};
      width: ${visualizationHeight};
      overflow: visible !important;
    }
  }
`;

var Visualization = styled.div`
  width: 100% !important;
  height: 100%;
  position: relative;
  overflow: visible;
  aspect-ratio: 1 / 1;
  > a:not(.incident-card) {
    color: inherit;
    position: absolute;
    font-size: 75%;
    height: 2em;
    width: 2em;
    padding-left: 2px;
    padding-right: 2px;
    border-radius: 50%;
    margin-left: -1em;
    margin-top: -1em;
    z-index: 1;
    text-align: center;
    line-height: 2em;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.15);
    transition: background, opacity 0.25s;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .incident-card {
    display: block;
    min-height: 15em;
    width: 15em;
    background: white;
    border-radius: 0.25rem;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.25);
    position: absolute;
    padding: 1em;
    overflow: hidden;
    img,
    canvas {
      margin: -1rem -1rem 0.5rem -1rem;
      max-width: unset;
      width: calc(100% + 4rem);
      height: 8rem;
      object-fit: cover;
    }
    h3 {
      font-size: 110%;
      margin: 0px;
      line-height: 1.5;
    }
  }
  .incident-card:not(:hover) {
    color: black;
  }

  > a:hover:not(.current):not(.incident-card) {
    background: #dedede;
    z-index: 3;
    color: var(--primary3) !important;
  }
  > a.current {
    border: 1px solid grey;
    background: #001a32;
    box-shadow: 0px 0px 3px 3px rgba(255, 255, 255, 0.75);
    z-index: 2;
  }
`;
