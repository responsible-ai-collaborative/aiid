import React from 'react';
import { scaleTime, scaleLinear, extent, bin, axisLeft, select } from 'd3';
import styled from 'styled-components';

const AxisLeft = ({ yScale, margin }) => {
  const axisRef = (axis) => {
    axis && axisLeft(yScale)(select(axis));
  };

  return <g ref={axisRef} transform={`translate(${margin.left}, 0)`} />;
};

const Title = styled.text`
  font-size: 14px;
`;

const Reports = ({ data, yScale, yValue, margin }) => {
  const [, innerHeight] = yScale.range();

  const minRadius = 3;

  const maxRadius = 14;

  const thresholds = Math.round(innerHeight / maxRadius);

  const binned = bin().value(yValue).thresholds(thresholds)(data);

  const radius = scaleLinear().domain([1, 6]).range([minRadius, maxRadius]);

  return (
    <g transform={`translate(${margin.left}, 0)`}>
      {binned
        .filter((b) => b.length > 0)
        .map((b) => (
          <g key={b.x0} transform={`translate(20,${yScale((b.x0 + b.x1) / 2)})`}>
            <circle r={radius(b.length)} style={{ opacity: 0.7 }}>
              <text>{b.length}</text>
            </circle>
            <a href={`#${b[0].mongodb_id}`}>
              <Title dx={12} dy={4}>
                {b[0].title}
              </Title>
            </a>
          </g>
        ))}
    </g>
  );
};

function Timeline({ items }) {
  const data = items[0].edges.map((item) => item.node);

  const width = 640;

  const height = 480;

  const margin = { top: 20, right: 20, bottom: 20, left: 60 };

  const yValue = (d) => new Date(d.date_published);

  const yScale = scaleTime()
    .domain(extent(data, yValue))
    .range([margin.top, height - margin.top])
    .nice();

  return (
    <svg width="100%" viewBox={`0 0 ${width} ${height}`}>
      <AxisLeft yScale={yScale} margin={margin} />
      <Reports data={data} yScale={yScale} yValue={yValue} margin={margin} />
    </svg>
  );
}

export default Timeline;
