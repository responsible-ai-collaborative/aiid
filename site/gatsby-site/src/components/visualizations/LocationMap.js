import React, { useEffect, useRef, useState } from 'react';
import { geoPath, geoGraticule, geoEquirectangular, scaleLinear, extent, zoom, select } from 'd3';
import styled from 'styled-components';
import { useWorldAtlas } from './useWorldAtlas';
import { OverlayTrigger, Popover } from 'react-bootstrap';

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

const abstractLocations = ['Global', 'Twitter platform', 'Wikipedia platform']

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
        <>
          <Point key={place} cx={x} cy={y} r={radius} />
          <OverlayTrigger
            placement="right"
            trigger="click"
            rootClose={true}
            overlay={
              <Popover>
                <Popover.Body>{place}</Popover.Body>
              </Popover>
            }
          >
            <foreignObject x={x - radius} y={y - radius} width={radius * 2} height={radius * 2}>
              <Trigger />
            </foreignObject>
          </OverlayTrigger>
        </>
      );
    })
}

function WorldMap({ land, projection }) {

  const path = geoPath(projection)

  const graticule = geoGraticule();

  return (
    <>
      <Sphere d={path({ type: 'Sphere' })} />

      <Graticules d={path(graticule())} />

      {land.features.map((feature) => (
        <Land key={feature} d={path(feature)} />
      ))}
    </>)
}

function LocationMap({ land, data, geocodes, className }) {

  const size = { width: 960, height: 480 }

  const svgRef = useRef()

  const mapRef = useRef()

  const containerRef = useRef()

  const zoomRef = useRef()

  const [rect, setRect] = useState()

  useEffect(() => {
    const containerNode = containerRef.current

    const resize = () => {

      const rect = containerNode.getBoundingClientRect();

      setRect(rect)
    }

    resize()

    window.addEventListener('resize', resize, false);

    return () => window.removeEventListener('resize', resize);

  }, [containerRef])

  useEffect(() => {

    if (svgRef && mapRef) {

      const svgNode = svgRef.current

      const mapNode = mapRef.current

      zoomRef.current = zoom()
        .on('zoom', ({ transform }) => {

          select(mapNode).attr("transform", transform);
        })

      select(svgNode).call(zoomRef.current)
    }

  }, [svgRef, mapRef])

  useEffect(() => {

    if (rect && zoomRef.current) {

      console.log('rect updated')

      const minZoom = Math.max(rect.width / size.width, rect.height / size.height);

      const maxZoom = 10 * minZoom;

      zoomRef.current
        .scaleExtent([minZoom, maxZoom])
        .translateExtent([[0, 0], [size.width, size.height]])
    }

  }, [rect, zoomRef]);

  const projection = geoEquirectangular()
    .fitSize([size.width, size.height], land)
    .translate([size.width / 2, size.height / 2])

  return <div className={className} ref={containerRef}>
    <svg ref={svgRef} width="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
      <g ref={mapRef}>
        <WorldMap land={land} projection={projection} />
        <Points data={data} geocodes={geocodes} projection={projection} />
      </g>
    </svg>
  </div>
}

function MapLoader({ data, geocodes, className }) {

  const worldAtlas = useWorldAtlas();

  if (!worldAtlas) {
    return <pre>Loading...</pre>;
  }

  const { land } = worldAtlas;

  return <>
    <LocationMap land={land} data={data} geocodes={geocodes} className={className} />
  </>
}

export default MapLoader