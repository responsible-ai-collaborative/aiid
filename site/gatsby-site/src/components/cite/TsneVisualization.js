import React, { useState } from 'react';
import { Spinner, Form } from 'react-bootstrap';
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
    box-shadow: 0px 0px 2px 2px rgba(0, 0, 0, 0.25);
    transition: background 0.25s;
  }
  a + div {
    min-height: 6em;
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
  darkenBySeverity,
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

  const background = (taxonColorMap[taxon] || Color('#ffffff'))
    .darken(
      darkenBySeverity && classifications && classifications['Severity']
        ? (0.7 *
            ['Negligible', 'Minor', 'Unclear/unknown', 'Moderate', 'Critical', 'Severe'].indexOf(
              classifications['Severity']
            )) /
            5
        : 0
    )
    .opaquer(-0.25);

  // isDark() returns false for values that I find hard to read black text against,
  // so we pretend it's darker than it really is.
  const color = background?.darken(0.1).isDark() ? 'white' : 'black';

  return (
    <>
      <LocalizedLink
        id={'spatial-incident-' + incident.incident_id}
        to={'/cite/' + incident.incident_id}
        data-cy="tsne-plotpoint"
        style={{
          top: `calc(50% + 48% * ${incident.tsne.y})`,
          left: `calc(50% + 48% * ${incident.tsne.x})`,

          // The points do not grow as fast as the space between them,
          // allowing the user to zoom to more accurately select
          // from points that are very close to each other.
          transform: `scale(${1 / sqrtScale})`,
          background,
          color,
        }}
        className={incident.incident_id == currentIncidentId ? 'current' : ''}
        onMouseLeave={() => setHover(false)}
        onMouseEnter={() => {
          setHover(true);
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
          style={{
            top: `calc(50% + 48% * ${incident.tsne.y} + ${0.75 / sqrtScale}em)`,
            left: `calc(50% + 48% * ${incident.tsne.x} + ${0.75 / sqrtScale}em)`,
            transform: `scale(${1 / state.scale})`,
            transformOrigin: 'top left',
            zIndex: 10,
          }}
        >
          {incidentData ? (
            <>
              <Image publicID={incidentData.reports[0].cloudinary_id} />
              <h3>{incidentData?.title || incidentData.reports[0].title}</h3>
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
            <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          )}
        </div>
      )}
    </>
  );
};

const TsneVisualization = ({ currentIncidentId }) => {
  const [axis, setAxis] = useState('Harm Distribution Basis');

  const [darkenBySeverity, setDarkenBySeverity] = useState(false);

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
    (incident) => incident.incidentId == currentIncidentId
  );

  const csetClassifications = [
    'Harm Distribution Basis',
    'Harm Type',
    'Intent',
    'Near Miss',
    'Problem Nature',
    'Sector Of Deployment',
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
          Severity
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

  // These should have maximum value
  // so the darkening by severity feature makes sense.
  let taxonColorMap = {
    Sex: Color('#ff0090'),
    'Sexual orientation or gender identity': Color('#ca9bff'),
    Race: Color('#ffa200'),
    'Deliberate or expected': Color('#ff0000'),
    'Harm caused': Color('#ff0000'),
    'Near miss': Color('#00ff00'),
    'Financial harm': Color('#4bff4b'),
    'Financial means': Color('#4bff4b'),
    'Financial services': Color('#4bff4b'),
  };

  if (classificationsData) {
    const taxons = Array.from(
      new Set(
        classificationsData.classifications
          .map((c) => c.classifications[axis.replace(/ /g, '')])
          .reduce((result, value) => result.concat(value), [])
      )
    );

    // Select colors spaced evenly around the color wheel.
    // Alternate the saturation so that adjacent items are more distinct.
    let hueSteps = Array(taxons.length)
      .fill()
      .map((e, i) => {
        const degrees = (360 * i) / taxons.length;

        return {
          degrees,
          color: Color('#ff0000')
            .rotate(degrees)
            .desaturate(i % 2 == 0 ? 0.5 : 0),
        };
      });

    // Remove those colors closest to predefined colors
    for (const key of Object.keys(taxonColorMap).filter((key) => taxons.includes(key))) {
      const color = taxonColorMap[key];

      const hue = color.hue();

      let closest;

      for (const step of hueSteps) {
        if (!closest || Math.abs(step.degrees - hue) < Math.abs(closest.degrees - hue)) {
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
    incidents && (
      <>
        <div style={{ display: 'flex', gap: '1em', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
            <label htmlFor="color-axis-select">
              <Trans>Color by editor’s classification</Trans>
            </label>
            <Form.Select
              style={{ display: 'inline', width: 'unset' }}
              id="color-axis-select"
              onChange={(event) => setAxis(event.target.value)}
            >
              {csetClassifications.map((axis) => (
                <option key={axis} value={axis}>
                  CSET:{axis}
                </option>
              ))}
            </Form.Select>
          </div>
          <div style={{ display: 'flex', gap: '1em', alignItems: 'center' }}>
            <label htmlFor="darken-by-severity-checkbox">
              <Trans>Darken by Severity</Trans>
            </label>
            <Form.Check
              type="switch"
              id="darken-by-severity-checkbox"
              onChange={(event) => setDarkenBySeverity(event.target.checked)}
            />
          </div>
        </div>
        <VisualizationWrapper data-cy="tsne-visualization">
          <TransformWrapper
            initialScale={2}
            initialPositionX={-500 + -500 * currentSpatialIncident?.x || 0}
            initialPositionY={-500 + -500 * currentSpatialIncident?.y || 0}
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
                      darkenBySeverity={darkenBySeverity}
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
