import React from 'react';
import { geoPath, geoGraticule, geoNaturalEarth1, scaleLinear, extent } from 'd3';
import styled from 'styled-components';
import { useWorldAtlas } from './useWorldAtlas';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const projection = geoNaturalEarth1();

const path = geoPath(projection);

const graticule = geoGraticule();

const Point = styled.circle`
  fill: #f00;
`;

const Sphere = styled.path`
  fill: #fbfbfb;
`;

const Graticules = styled.path`
  fill: none;
  stroke: #ececec;
`;

const Land = styled.path`
  fill: #bdbdbd;
`;

const Trigger = styled.div`
  width: ${({ width }) => width}px;
  height: ${({ height }) => height}px;
  cursor: pointer;
`;

export default function LocationMap({ data, geocodes, className }) {
  const worldAtlas = useWorldAtlas();

  if (!worldAtlas) {
    return <pre>Loading...</pre>;
  }

  const { land } = worldAtlas;

  const size = { width: 960, height: 480 };

  const sizeValue = ([, value]) => value;

  const [min, max] = extent(data.columns, sizeValue);

  console.log(min, max);

  const sizeScale = scaleLinear().domain([min, max]).range([3, 18]);

  return (
    <svg className={className} width="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
      <Sphere d={path({ type: 'Sphere' })} />

      <Graticules d={path(graticule())} />

      {land.features.map((feature) => (
        <Land key={feature} d={path(feature)} />
      ))}

      {data.columns
        .filter(([place]) => geocodes[place])
        .map((d) => {
          const [place] = d;

          const {
            geometry: { location },
          } = geocodes[place];

          const [x, y] = projection([location.lng, location.lat]);

          const radius = sizeScale(sizeValue(d));

          return (
            <>
              <Point key={place} cx={x} cy={y} r={radius} />
              <OverlayTrigger
                placement="right"
                trigger="hover"
                rootClose={true}
                overlay={
                  <Popover>
                    <Popover.Body>{place}</Popover.Body>
                  </Popover>
                }
              >
                <foreignObject x={x - radius} y={y - radius} width={radius * 2} height={radius * 2}>
                  <Trigger width={radius} height={radius} />
                </foreignObject>
              </OverlayTrigger>
            </>
          );
        })}
    </svg>
  );
}
