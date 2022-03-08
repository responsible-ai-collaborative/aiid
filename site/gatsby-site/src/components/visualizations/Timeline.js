import React, { useState, useEffect, useRef } from 'react';
import {
  scaleTime,
  extent,
  bin,
  axisLeft,
  select,
  timeFormat,
  timeYear,
  timeMonth,
  timeWeek,
} from 'd3';
import styled from 'styled-components';
import { OverlayTrigger, Popover } from 'react-bootstrap';

const formatDay = timeFormat('%b %d');

const formatMonth = timeFormat('%B');

const formatYear = timeFormat('%Y');

const multiFormat = (date) => {
  return (timeMonth(date) < date ? formatDay : timeYear(date) < date ? formatMonth : formatYear)(
    date
  );
};

const AxisLeft = ({ yScale, margin, data }) => {
  const axisRef = useRef();

  useEffect(() => {
    const axis = axisRef.current;

    axisLeft(yScale)
      .ticks(data.length == 1 ? 1 : 8)
      .tickFormat((d, i) => {
        if (i == 0 || yScale.ticks().length - 1 == i) {
          return timeFormat('%b %Y')(d);
        }

        return multiFormat(d);
      })(select(axis));
  }, [axisRef]);

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

const Point = styled.circle`
  fill: ${(props) => (props.isOccurrence ? 'var(--bs-danger)' : 'var(--bs-gray-900)')};
`;

const Count = styled.text`
  fill: #fff;
  text-anchor: middle;
  dominant-baseline: middle;
  font-weight: bold;
  font-size: 12px;
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
          <Count>+{bucket.length - 1}</Count>
          <OverlayTrigger
            placement="right"
            trigger="click"
            rootClose={true}
            overlay={
              <Popover>
                <Popover.Body>
                  <GroupList>
                    {bucket.slice(1).map((b) => (
                      <GroupListItem key={b.mongodb_id}>
                        {timeFormat('%b %d, %Y')(new Date(b.date_published))}
                        <br />
                        {b.isOccurrence ? (
                          <>{b.title}</>
                        ) : (
                          <a href={`#r${b.mongodb_id}`}>{b.title}</a>
                        )}
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
        <Point cy={0} r={radius} isOccurrence={bucket[0].isOccurrence} />
      )}

      {bucket[0].isOccurrence ? (
        <Title dx={16}>{bucket[0].title}</Title>
      ) : (
        <a href={bucket[0].mongodb_id ? `#r${bucket[0].mongodb_id}` : ''}>
          <Title dx={16}>{bucket[0].title}</Title>
        </a>
      )}
    </g>
  );
};

const Reports = ({ binned, yScale, radius, groupRadius, margin, size }) => {
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

const calculatesize = ({ data, rect = null }) => ({
  width: rect ? rect.width : 640,
  height: data.length == 1 ? 120 : 480,
});

function Timeline({ data }) {
  const containerRef = useRef();

  const [size, setSize] = useState(calculatesize({ data }));

  const margin = { top: 20, right: 20, bottom: 20, left: 60 };

  const yValue = (d) => new Date(d.date_published);

  const [min, max] = extent(data, yValue);

  const domain = [timeWeek.floor(min), timeWeek.ceil(max)];

  const yScale = scaleTime()
    .domain(domain)
    .range([margin.top, size.height - margin.top])
    .nice();

  const [, innerHeight] = yScale.range();

  const radius = 6;

  const groupRadius = 12;

  const thresholds = Math.round(innerHeight / (groupRadius * 2));

  const binned = bin().value(yValue).thresholds(thresholds)(data);

  useEffect(() => {
    const resize = () => {
      const container = containerRef.current;

      const rect = container.getBoundingClientRect();

      setSize(calculatesize({ data: binned, rect }));
    };

    resize();

    window.addEventListener('resize', resize, false);

    return () => window.removeEventListener('resize', resize);
  }, [containerRef]);

  return (
    <div ref={containerRef} style={{ height: `${size.height}px` }}>
      <svg width="100%" viewBox={`0 0 ${size.width} ${size.height}`}>
        <AxisLeft data={data} yScale={yScale} margin={margin} size={size} />
        <Reports
          radius={radius}
          groupRadius={groupRadius}
          binned={binned}
          yScale={yScale}
          yValue={yValue}
          margin={margin}
          size={size}
        />
      </svg>
    </div>
  );
}

export default Timeline;
