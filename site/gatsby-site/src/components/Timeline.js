import React from 'react';
import { scaleTime, extent, bin, axisLeft, select } from 'd3';
import styled from 'styled-components';

const AxisLeft = ({ yScale, margin }) => {
  const axisRef = (axis) => {
    axis && axisLeft(yScale)(select(axis));
  };

  return <g ref={axisRef} transform={`translate(${margin.left}, 0)`} />;
};

const Title = styled.text`
  font-size: 14px;
  dominant-baseline: middle;
`;

const Line = styled.line`
  stroke: #5b5b5b;
  stroke-dasharray: 2;
`;

const Point = styled.circle``;

const Count = styled.text`
  fill: #fff;
  text-anchor: middle;
  dominant-baseline: middle;
`;

const DataPoint = ({ bucket, groupRadius, radius, yScale }) => {
  return (
    <g key={bucket.x0} transform={`translate(20,${yScale((bucket.x0 + bucket.x1) / 2)})`}>
      <Point cy={0} r={bucket.length > 1 ? groupRadius : radius} />
      {bucket.length > 1 && <Count>{bucket.length}</Count>}
      <a href={`#${bucket[0].mongodb_id}`}>
        <Title dx={16}>{bucket[0].title}</Title>
      </a>
    </g>
  );
};

const Reports = ({ data, yScale, yValue, margin, size }) => {
  const [, innerHeight] = yScale.range();

  const radius = 6;

  const groupRadius = 12;

  const thresholds = Math.round(innerHeight / (groupRadius * 2));

  const binned = bin().value(yValue).thresholds(thresholds)(data);

  return (
    <g transform={`translate(${margin.left}, 0)`}>
      <Line x1={20} x2={20} y1={margin.top} y2={size.height - margin.bottom} />
      {binned
        .filter((b) => b.length > 0)
        .map((b) => (
          <DataPoint
            key={b.x0}
            bucket={b}
            yScale={yScale}
            groupRadius={groupRadius}
            radius={radius}
          />
        ))}
    </g>
  );
};

function Timeline({ items }) {
  const data = items[0].edges.map((item) => item.node);

  const size = { width: 640, height: 480 };

  const margin = { top: 20, right: 20, bottom: 20, left: 60 };

  const yValue = (d) => new Date(d.date_published);

  const yScale = scaleTime()
    .domain(extent(data, yValue))
    .range([margin.top, size.height - margin.top])
    .nice();

  return (
    <svg width="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
      <AxisLeft yScale={yScale} margin={margin} size={size} />
      <Reports data={data} yScale={yScale} yValue={yValue} margin={margin} size={size} />
    </svg>
  );
}

export default Timeline;
