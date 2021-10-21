import React from 'react';
import { scaleTime, extent, bin, axisLeft, select, timeFormat, timeMonth } from 'd3';
import styled from 'styled-components';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const AxisLeft = ({ yScale, margin, data }) => {
  const axisRef = (axis) => {
    axis && axisLeft(yScale).ticks(data.length == 1 ? 2 : null)(select(axis));
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

const Trigger = styled.div`
  width: 16px;
  height: 16px;
  cursor: pointer;
`;

const GroupList = styled.ul`
  margin: 0;
  padding: 0;
  list-style-type: none;
`;

const GroupListItem = styled.li`
  font-size: 12px;
  margin-top: 6px;
  &:first-child {
    margin-top: 0%;
  }
`;

const DataPoint = ({ bucket, groupRadius, radius, yScale }) => {
  return (
    <g key={bucket.x0} transform={`translate(20,${(yScale(bucket.x0) + yScale(bucket.x1)) / 2})`}>
      {bucket.length > 1 ? (
        <>
          <Point cy={0} r={groupRadius} />
          <Count>{bucket.length}</Count>
          <OverlayTrigger
            placement="right"
            trigger="click"
            rootClose={true}
            overlay={
              <Popover>
                <Popover.Body>
                  <GroupList>
                    {bucket.map((b) => (
                      <GroupListItem key={b.mongodb_id}>
                        {timeFormat('%b %d, %Y')(new Date(b.date_published))}
                        <br />
                        <a href={`#${b.mongodb_id}`}>{b.title}</a>
                      </GroupListItem>
                    ))}
                  </GroupList>
                </Popover.Body>
              </Popover>
            }
          >
            <foreignObject x={-8} y={-8} width={16} height={16}>
              <Trigger />
            </foreignObject>
          </OverlayTrigger>
        </>
      ) : (
        <Point cy={0} r={radius} />
      )}

      <a href={`#${bucket[0].mongodb_id}`}>
        <Title dx={16}>{bucket[0].title}</Title>
      </a>
    </g>
  );
};

function thresholdTime(n) {
  return (data, min, max) => {
    return scaleTime().domain([min, max]).ticks(n);
  };
}

const Reports = ({ data, yScale, yValue, margin, size }) => {
  const [, innerHeight] = yScale.range();

  const radius = 6;

  const groupRadius = 12;

  const thresholds = Math.round(innerHeight / (groupRadius * 2));

  const binned = bin().value(yValue).thresholds(thresholdTime(thresholds))(data);

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

  const size = { width: 640, height: data.length == 1 ? 120 : 480 };

  const margin = { top: 20, right: 20, bottom: 20, left: 60 };

  const yValue = (d) => new Date(d.date_published);

  const [min, max] = extent(data, yValue);

  const domain = [timeMonth.floor(min), timeMonth.ceil(max)];

  const yScale = scaleTime()
    .domain(domain)
    .range([margin.top, size.height - margin.top])
    .nice();

  return (
    <svg width="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
      <AxisLeft data={data} yScale={yScale} margin={margin} size={size} />
      <Reports data={data} yScale={yScale} yValue={yValue} margin={margin} size={size} />
    </svg>
  );
}

export default Timeline;
