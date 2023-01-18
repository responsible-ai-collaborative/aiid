import React, { useEffect, useRef } from 'react';
import { geoPath, geoGraticule, geoEquirectangular, scaleLinear, extent, zoom, select } from 'd3';
import styled from 'styled-components';
import { useWorldAtlas } from './useWorldAtlas';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import PopoverWrapper from 'elements/PopoverWrapper';

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
  width: 100%;
  height: 100%;
  cursor: pointer;
`;

const abstractLocations = ['Global', 'Twitter platform', 'Wikipedia platform'];

function Points({ data, geocodes, projection }) {
  const sizeValue = ([, value]) => value;

  const [min, max] = extent(data.columns, sizeValue);

  const sizeScale = scaleLinear().domain([min, max]).range([6, 18]);

  return data.columns
    .filter(([place]) => !abstractLocations.includes(place))
    .filter(([place]) => geocodes[place])
    .map((d) => {
      const [place] = d;

      const {
        geometry: { location },
      } = geocodes[place];

      const [x, y] = projection([location.lng, location.lat]);

      const radius = sizeScale(sizeValue(d));

      return (
        <React.Fragment key={place}>
          <Point cx={x} cy={y} r={radius} />
          <OverlayTrigger
            placement="right"
            trigger="click"
            rootClose={true}
            overlay={
              <PopoverWrapper>
                <Popover.Body>{place}</Popover.Body>
              </PopoverWrapper>
            }
          >
            <foreignObject x={x - radius} y={y - radius} width={radius * 2} height={radius * 2}>
              <Trigger />
            </foreignObject>
          </OverlayTrigger>
        </React.Fragment>
      );
    });
}

function WorldMap({ land, projection }) {
  const path = geoPath(projection);

  const graticule = geoGraticule();

  return (
    <>
      <Sphere d={path({ type: 'Sphere' })} />

      <Graticules d={path(graticule())} />

      {land.features.map((feature) => (
        <Land key={feature} d={path(feature)} />
      ))}
    </>
  );
}

function LocationMap({ land, data, geocodes, className }) {
  const size = { width: 960, height: 480 };

  const svgRef = useRef();

  const mapRef = useRef();

  useEffect(() => {
    const svgNode = svgRef.current;

    const mapNode = mapRef.current;

    if (svgNode && mapNode) {
      const zoomBehavior = zoom()
        .scaleExtent([1, 9])
        .translateExtent([
          [0, 0],
          [size.width, size.height],
        ])
        .on('zoom', ({ transform }) => {
          select(mapNode).attr('transform', transform);
        });

      select(svgNode).call(zoomBehavior);
    }
  }, [svgRef, mapRef]);

  const projection = geoEquirectangular()
    .fitSize([size.width, size.height], land)
    .translate([size.width / 2, size.height / 2]);

  return (
    <div className={className}>
      <svg ref={svgRef} width="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
        <g ref={mapRef}>
          <WorldMap land={land} projection={projection} />
          <Points data={data} geocodes={geocodes} projection={projection} />
        </g>
      </svg>
    </div>
  );
}

function MapLoader({ data, geocodes, className }) {
  const worldAtlas = useWorldAtlas();

  if (!worldAtlas) {
    return <pre>Loading...</pre>;
  }

  const { land } = worldAtlas;

  return (
    <>
      <LocationMap land={land} data={data} geocodes={geocodes} className={className} />
    </>
  );
}

export default MapLoader;
