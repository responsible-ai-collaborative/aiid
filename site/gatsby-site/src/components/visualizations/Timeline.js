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
import { Trans } from 'react-i18next';

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

const DataPoint = ({ bucket, groupRadius, radius, yScale, setTooltipPosition }) => {
  const gRef = useRef(null);

  const fORef = useRef(null);

  const tooltipRef = useRef(null);

  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    function handleClickOutside(event) {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
        setTooltipPosition(0, 0, null);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipRef]);

  const tooltipContent = (
    <>
      <div
        className="bg-white text-gray-900 absolute opacity-100 z-50 px-2 py-1 border border-gray-900 rounded w-fit"
        ref={tooltipRef}
      >
        <ul className="m-0 p-0">
          {bucket.slice(1).map((b) => (
            <li className="text-[12px] mt-[6px] first:mt-[0%]" key={b.mongodb_id}>
              <p className="whitespace-nowrap m-0 font-bold mb-1">
                {timeFormat('%b %d, %Y')(new Date(b.date_published))}
              </p>
              {b.isOccurrence ? (
                <p className="whitespace-nowrap m-0">{b.title}</p>
              ) : (
                <a href={`#r${b.report_number}`} className="whitespace-nowrap">
                  {b.title}
                </a>
              )}
            </li>
          ))}
        </ul>
        <div className="absolute h-2 w-2 -left-[5px] transform-[translate3d(58.5px,0px,0px) top-1/2 bg-inherit before:border-b before:border-l before:visible before:h-2 before:absolute before:w-2 before:border-b-gray-900 before:border-l-gray-900 before:bg-inherit after:border-b after:border-l after:visible after:h-2 after:absolute after:w-2 after:border-b-gray-900 after:border-l-gray-900 after:bg-inherit before:rotate-45 after:rotate-45"></div>
      </div>
    </>
  );

  const toggleTooltip = () => {
    setShowTooltip(!showTooltip);
    if (!showTooltip) {
      const g = gRef.current;

      const parent = g.parentNode;

      const element = fORef.current;

      const { left, top } = element.getBoundingClientRect();

      const { left: parentLeft, top: parentTop } = parent.getBoundingClientRect();

      const offsetLeft = left - parentLeft;

      const offsetTop = top - parentTop;

      setTooltipPosition(offsetLeft, offsetTop, tooltipContent);
    } else {
      setTooltipPosition(0, 0, null);
    }
  };

  return (
    <g
      key={bucket.x0}
      transform={`translate(20,${(yScale(bucket.x0) + yScale(bucket.x1)) / 2})`}
      className="z-2"
      ref={gRef}
    >
      {bucket.length > 1 ? (
        <>
          <circle className="fill-gray-900" cy={0} r={groupRadius} />
          <text
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-white font-bold text-[12px] z-40"
          >
            +{bucket.length - 1}
          </text>
          <foreignObject
            x={-8}
            y={-8}
            width={16}
            height={16}
            onClick={() => {
              toggleTooltip();
            }}
            ref={fORef}
          >
            <div className="w-[16px] h-[16px] cursor-pointer" />
          </foreignObject>
        </>
      ) : (
        <circle
          className={`${
            bucket[0].isOccurrence
              ? 'fill-danger'
              : bucket[0].isResponse
              ? 'fill-green-500'
              : 'fill-gray-900'
          }`}
          cy={0}
          r={radius}
        />
      )}

      {bucket[0].isOccurrence ? (
        <text
          dominantBaseline="middle"
          className={`text-[14px] ${bucket[0].isResponse ? 'fill-green-700' : ''}`}
          dx={16}
          data-cy={`timeline-text-${bucket[0].isResponse ? 'response' : 'occurrence'}`}
        >
          {bucket[0].title}
          {bucket[0].isResponse && (
            <>
              {' '}
              - <Trans>Response</Trans>
            </>
          )}
        </text>
      ) : (
        <a href={bucket[0].mongodb_id ? `#r${bucket[0].report_number}` : ''}>
          <text
            dominantBaseline="middle"
            className={`text-[14px] ${bucket[0].isResponse ? 'fill-green-700' : ''}`}
            dx={16}
            data-cy={`timeline-text-${bucket[0].isResponse ? 'response' : 'occurrence'}`}
          >
            {bucket[0].title}
            {bucket[0].isResponse && (
              <>
                {' '}
                - <Trans>Response</Trans>
              </>
            )}
          </text>
        </a>
      )}
    </g>
  );
};

const Reports = ({ binned, yScale, radius, groupRadius, margin, size, setTooltipPosition }) => {
  return (
    <g transform={`translate(${margin.left}, 0)`}>
      <line
        className="stroke-[#5b5b5b]"
        strokeDasharray="2"
        x1={20}
        x2={20}
        y1={margin.top}
        y2={size.height - margin.bottom}
      />
      {binned
        .filter((b) => b.length > 0)
        .map((b) => (
          <DataPoint
            key={b.x0}
            bucket={b}
            yScale={yScale}
            groupRadius={groupRadius}
            radius={radius}
            setTooltipPosition={setTooltipPosition}
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

    // ResizeObserver is supported in all major browsers
    // but is not yet an official web standard.
    if (ResizeObserver) {
      const resizeObserver = new ResizeObserver(() => resize());

      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    } else {
      window.addEventListener('resize', resize, false);
      return () => window.removeEventListener('resize', resize);
    }
  }, [containerRef]);

  const [tooltipLeft, setTooltipLeft] = useState(0);

  const [tooltipTop, setTooltipTop] = useState(0);

  const [tooltipContent, setTooltipContent] = useState(null);

  const setTooltipPosition = (left, top, content) => {
    setTooltipLeft(left);
    setTooltipTop(top);
    setTooltipContent(content);
  };

  return (
    <div ref={containerRef} style={{ height: `${size.height}px` }} className="relative">
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
          setTooltipPosition={setTooltipPosition}
        />
      </svg>
      <div
        style={{ position: 'absolute', left: tooltipLeft + 100, top: tooltipTop, width: 'auto' }}
      >
        {tooltipContent}
      </div>
    </div>
  );
}

export default Timeline;
