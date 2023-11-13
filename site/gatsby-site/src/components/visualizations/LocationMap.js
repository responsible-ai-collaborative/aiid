import React, { useEffect, useRef, useState } from 'react';
import { geoPath, geoGraticule, geoEquirectangular, scaleLinear, extent, zoom, select } from 'd3';
import { useWorldAtlas } from './useWorldAtlas';

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

      const [showTooltip, setShowTooltip] = useState(false);

      return (
        <React.Fragment key={place}>
          <circle className="fill-[#f00]" cx={x} cy={y} r={radius} />
          <foreignObject
            x={x - radius}
            y={y - radius * 2}
            width={showTooltip ? radius * 50 : radius * 2}
            height={showTooltip ? radius * 20 : radius * 2}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <div className="relative">
              {showTooltip && (
                <div className="absolute bottom-full left-4 top-0 transform bg-gray-900 text-white rounded-md border border-gray-800 pointer-events-none transition-all duration-300 z-50 text-xs h-fit w-fit p-1">
                  {place}
                </div>
              )}
            </div>
          </foreignObject>
        </React.Fragment>
      );
    });
}

function WorldMap({ land, projection }) {
  const path = geoPath(projection);

  const graticule = geoGraticule();

  return (
    <>
      <path className="fill-[#fbfbfb]" d={path({ type: 'Sphere' })} />

      <path className="fill-none stroke-[#ececec]" d={path(graticule())} />

      {land.features.map((feature) => (
        <path className="fill-[#bdbdbd]" key={feature} d={path(feature)} />
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
