import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { Spinner } from 'flowbite-react';
import styled from 'styled-components';
import { useApolloClient, gql, useQuery } from '@apollo/client';
import { Image } from '../../utils/cloudinary';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import Color from 'color';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { Trans } from 'react-i18next';

const VisualizationWrapper = styled.div`
  > *,
  > * > * {
    width: 100% !important;
    height: 90vh;
    background: #ccc;
  }
  margin-bottom: 1em;
  margin-top: 1em;
`;

const Visualization = styled.div`
  max-height: 100vh;
  max-width: 100vh;
  height: 1000px;
  width: 1000px;
  position: relative;
  aspect-ratio: 1 / 1;
  > a {
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
    transition: background 0.25s;
  }
  a + div {
    min-height: 15em;
    width: 15em;
    background: white;
    border-radius: 0.25rem;
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.25);
    position: absolute;
    padding: 1em;
    overflow: hidden;
    img {
      margin: -1em -1em 1em -1em;
      max-width: unset;
      width: calc(100% + 4em);
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }
    h3 {
      font-size: 110%;
      margin: 0px;
    }
  }
  > a:hover:not(.current) {
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

const PlotPoint = ({
  state,
  incident,
  classifications,
  taxonColorMap,
  axis,
  currentIncidentId,
}) => {
  const client = useApolloClient();

  const [incidentData, setIncidentData] = useState(null);

  // We have to track this and render the incident card only when hovered.
  // Just hiding it with css is too slow and mages zooming laggy.
  const [hover, setHover] = useState(false);

  // I'm pretty sure the JS engine is smart enough to memoize this,
  // but I'm not taking my chances.
  const sqrtScale = Math.sqrt(state.scale);

  const dbAxis = axis.replace(/ /g, '');

  const taxon =
    classifications && classifications[dbAxis]
      ? Array.isArray(classifications[dbAxis])
        ? classifications[dbAxis].length > 0 && String(classifications[dbAxis][0].trim()).length > 0
          ? String(classifications[dbAxis][0])
          : null
        : String(classifications[dbAxis]).length > 0
        ? String(classifications[dbAxis])
        : null
      : null;

  const background = (taxonColorMap[taxon] || Color('#ffffff')).opaquer(-0.25);

  const borderColor = background.darken(0.15).desaturate(0.2);

  // isDark() returns false for values that I find hard to read black text against,
  // so we pretend it's darker than it really is.
  const color = background?.darken(0.1).isDark() ? 'white' : 'black';

  const [clientPosition, setClientPosition] = useState(null);

  const onTop = clientPosition?.y < window.innerHeight / 2;

  const onLeft = clientPosition?.x < window.innerWidth / 2;

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

          // The points do not grow as fast as the space between them,
          // allowing the user to zoom to more accurately select
          // from points that are very close to each other.
          transform: `scale(${1 / sqrtScale})`,
          border: '2px solid ' + borderColor.hex(),
          background,
          color,
        }}
        className={incident.incident_id == currentIncidentId ? 'current' : ''}
        onMouseLeave={() => setHover(false)}
        onMouseEnter={(event) => {
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
        }}
      >
        {incident.incident_id}
      </LocalizedLink>
      {hover && (
        <div
          data-cy="incident-card"
          style={{
            top: onTop ? `calc(50% + 48% * ${incident.tsne.y} + ${1 / sqrtScale}em)` : undefined,
            bottom: !onTop
              ? `calc(50% - 48% * ${incident.tsne.y} + ${1 / sqrtScale}em)`
              : undefined,
            left: onLeft ? `calc(50% + 48% * ${incident.tsne.x} + ${1 / sqrtScale}em)` : undefined,
            right: !onLeft
              ? `calc(50% - 48% * ${incident.tsne.x} + ${1 / sqrtScale}em)`
              : undefined,
            transform: `scale(${1 / state.scale})`,
            transformOrigin: `${onTop ? 'top' : 'bottom'} ${onLeft ? 'left' : 'right'}`,
            zIndex: 10,
            display: incidentData ? undefined : 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {incidentData ? (
            <>
              <Image publicID={incidentData.reports[0].cloudinary_id} />
              <h3 data-cy="title">{incidentData?.title || incidentData.reports[0].title}</h3>
              {taxon && (
                <div style={{ marginTop: '.5em' }}>
                  <span
                    style={{
                      height: '.75em',
                      width: '.75em',
                      borderRadius: '.2em',
                      margin: '0em .2em -.05em 0px',
                      verticalAlign: 'center',
                      display: 'inline-block',
                      background,
                    }}
                  />
                  {taxon}
                </div>
              )}
            </>
          ) : (
            <Spinner />
          )}
        </div>
      )}
    </>
  );
};

const circularDistance = (deg1, deg2) =>
  Math.min(Math.abs(deg1 - deg2), 360 - Math.abs(deg1 - deg2)) % 360;

const TsneVisualization = ({ currentIncidentId }) => {
  const [axis, setAxis] = useState('Sector Of Deployment');

  const { data: spatialIncidentsData } = useQuery(
    gql`
      query SpatialIncidents($query: IncidentQueryInput) {
        incidents(query: $query) {
          incident_id
          tsne {
            x
            y
          }
        }
      }
    `,
    {
      variables: { query: { tsne_exists: true } },
    }
  );

  const incidents = spatialIncidentsData?.incidents || [];

  const currentSpatialIncident = incidents.find(
    (incident) => incident.incident_id == currentIncidentId
  );

  const csetClassifications = [
    'Sector Of Deployment',
    'Harm Distribution Basis',
    'Severity',
    'Harm Type',
    'Intent',
    'Near Miss',
    'Problem Nature',
    'System Developer',
  ];

  const { data: classificationsData } = useQuery(
    gql`
    query ClassificationsQuery($query: ClassificationQueryInput) {
      classifications(query: $query) {
        incident_id
        namespace
        classifications {
          ${csetClassifications.map((s) => s.replace(/ /g, '')).join('\n        ')}
        }
      }
    }
  `,
    {
      variables: {
        query: {
          incident_id_in: incidents.map((incident) => incident.incident_id),
        },
      },
    }
  );

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
  };

  if (classificationsData) {
    const taxons = Array.from(
      new Set(
        classificationsData.classifications
          .map((c) => c.classifications[axis.replace(/ /g, '')])
          .map((e) => (Array.isArray(e) ? e[0] : e))
          .reduce((result, value) => result.concat(value), [])
          .filter((value) => value)
      )
    );

    // Select colors spaced evenly around the color wheel.
    // Alternate the saturation so that adjacent items are more distinct.
    let hueSteps = Array(taxons.length)
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

    // Remove those colors closest to predefined colors
    for (const key of Object.keys(taxonColorMap).filter((key) => taxons.includes(key))) {
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
  }

  return (
    incidents &&
    (currentSpatialIncident || !currentIncidentId || currentIncidentId < 1) && (
      <>
        <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
            <label htmlFor="color-axis-select">
              <Trans>Color by incident classifications from taxonomies</Trans>
            </label>
            <Form.Select
              style={{ display: 'inline', width: 'unset' }}
              id="color-axis-select"
              onChange={(event) => setAxis(event.target.value)}
              data-cy="color-axis-select"
            >
              {csetClassifications.map((axis) => (
                <option key={axis} value={axis}>
                  CSET:{axis}
                </option>
              ))}
            </Form.Select>
          </div>
        </div>
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
              <TransformComponent>
                <Visualization>
                  {incidents.map((incident) => (
                    <PlotPoint
                      state={state}
                      incident={incident}
                      classifications={
                        classificationsData?.classifications
                          ? classificationsData.classifications.find(
                              (classification) => classification.incident_id == incident.incident_id
                            )?.classifications || {}
                          : {}
                      }
                      key={incident.incident_id}
                      taxonColorMap={taxonColorMap}
                      axis={axis}
                      currentIncidentId={currentIncidentId}
                    />
                  ))}
                </Visualization>
              </TransformComponent>
            )}
          </TransformWrapper>
        </VisualizationWrapper>
      </>
    )
  );
};

export default TsneVisualization;
