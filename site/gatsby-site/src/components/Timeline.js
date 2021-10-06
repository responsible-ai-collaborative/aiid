import React from 'react';
import { scaleTime, extent, timeFormat } from 'd3';

const width = 960;

const height = 500;

const margin = { top: 20, right: 30, bottom: 65, left: 90 };

const AxisLeft = ({ yScale, innerWidth, tickFormat, tickOffset = 3 }) =>
  yScale.ticks().map((tickValue) => (
    <g key={tickValue} className="tick" transform={`translate(0,${yScale(tickValue)})`}>
      <line x2={innerWidth} />
      <text key={tickValue} style={{ textAnchor: 'end' }} x={-tickOffset} dy=".32em">
        {tickFormat(tickValue)}
      </text>
    </g>
  ));

const Reports = ({ data, yScale, yValue }) => {
  return data.map((d) => (
    <g key={d.mongodb_id} transform={`translate(20,${yScale(yValue(d))})`}>
      <circle r={6} style={{ opacity: 0.7 }} />
      <a href={`#${d.mongodb_id}`}>
        <text dx={12} dy={6}>
          {d.title}
        </text>
      </a>
    </g>
  ));
};

function Timeline({ items }) {
  const data = items[0].edges.map((item) => item.node);

  const innerHeight = height - margin.top - margin.bottom;

  const innerWidth = width - margin.left - margin.right;

  const yValue = (d) => new Date(d.date_published);

  const yScale = scaleTime().domain(extent(data, yValue)).range([0, innerHeight]).nice();

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin.left},${margin.top})`}>
        <AxisLeft
          yScale={yScale}
          innerWidth={innerWidth}
          tickOffset={5}
          tickFormat={timeFormat('%m/%Y')}
        />
        <Reports data={data} yScale={yScale} yValue={yValue} />
      </g>
    </svg>
  );
}

export default Timeline;
