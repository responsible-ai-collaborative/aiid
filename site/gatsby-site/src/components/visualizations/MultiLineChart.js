import React, { useEffect } from 'react';
import * as d3 from 'd3';

function MultiLineChart({ data, id, params }) {
  // d3 wants to manipulate the dom on its own,
  useEffect(() => {
    document.getElementById(id).innerHTML = '';
    d3LineChart(data, '#' + id, params);
  }, [params]);

  return <div id={id}></div>;
}

// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/multi-line-chart
//
// Modified 2022 by the Responsible AI Collaborative
//
function d3LineChart(
  data,
  selector,
  {
    x = ([x]) => x, // given d in data, returns the (temporal) x-value
    y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
    z = () => 1, // given d in data, returns the (categorical) z-value
    title, // given d in data, returns the title text
    defined, // for gaps in data
    curve = d3.curveBasis, // method of interpolation between points
    marginTop = 60, // top margin, in pixels
    marginRight = 60, // right margin, in pixels
    marginBottom = 60, // bottom margin, in pixels
    marginLeft = 60, // left margin, in pixels
    width = 640, // outer width, in pixels
    height = 400, // outer height, in pixels
    xType = d3.scaleUtc, // type of x-scale
    xDomain, // [xmin, xmax]
    xRange = [marginLeft, width - marginRight], // [left, right]
    yType = d3.scaleLinear, // type of y-scale
    yDomain, // [ymin, ymax]
    yRange = [height - marginBottom, marginTop], // [bottom, top]
    yFormat, // a format specifier string for the y-axis
    yLabel, // a label for the y-axis
    zDomain, // array of z-values
    color = 'currentColor', // stroke color of line, as a constant or a function of *z*
    strokeLinecap, // stroke line cap of line
    strokeLinejoin = 'round', // stroke line join of line
    strokeWidth = 3, // stroke width of line
    strokeOpacity, // stroke opacity of line
    mixBlendMode = 'multiply', // blend mode of lines
    voronoi = false, // show a Voronoi overlay? (for debugging)
    fontSizePx = 20,
    modSize = 100, // The y-axis starts at the nearest multiple of `modSize`
    startAtZero = false,
    chartTitle,
  } = {}
) {
  const fontSize = fontSizePx + 'px';

  // Compute values.
  const X = d3.map(data, x);

  const Y = d3.map(data, y);

  const Z = d3.map(data, z);

  const O = d3.map(data, (d) => d);

  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains, and unique the z-domain.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined)
    yDomain = [
      startAtZero
        ? 0
        : Math.floor(d3.min(Y, (d) => (typeof d === 'string' ? +d : d)) / modSize) * modSize,
      d3.max(Y, (d) => (typeof d === 'string' ? +d : d)),
    ];

  if (zDomain === undefined) zDomain = Z;
  zDomain = new d3.InternSet(zDomain);

  // Omit any data not present in the z-domain.
  const I = d3.range(X.length).filter((i) => zDomain.has(Z[i]));

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);

  const yScale = yType(yDomain, yRange);

  const xAxis = d3
    .axisBottom(xScale)
    .tickSizeOuter(0)
    .tickValues(
      xDomain
        .concat(
          [...Array(2)].map((e, i) => {
            const interval = xDomain[1] - xDomain[0];

            return xDomain[0] + (interval * (i + 1)) / 3;
          })
        )
        .sort((a, b) => a - b)
    )
    .tickFormat(d3.timeFormat('%b ′%y'));

  const yAxis = d3
    .axisLeft(yScale)
    .tickSizeOuter(0)
    .tickValues(
      yScale.ticks(5).filter((i) => i != yDomain[0]),
      yFormat
    );

  // Compute titles.
  const T = title === undefined ? Z : title === null ? null : d3.map(data, title);

  // Construct a line generator.
  const line = d3
    .line()
    .defined((i) => D[i])
    .curve(curve)
    .x((i) => xScale(X[i]))
    .y((i) => yScale(Y[i]));

  const svg = d3
    .select(selector)
    .append('svg')
    .attr('width', width)
    .attr('height', height)
    .attr('viewBox', [0, 0, width, height])
    .attr('style', 'max-width: 100%; height: auto; height: intrinsic;')
    .attr('font-size', fontSize)
    .style('-webkit-tap-highlight-color', 'transparent')
    .on('pointerenter', pointerentered)
    .on('pointermove', pointermoved)
    .on('pointerleave', pointerleft)
    .on('touchstart', (event) => event.preventDefault());

  // An optional Voronoi display (for fun).
  if (voronoi)
    svg
      .append('path')
      .attr('fill', 'none')
      .attr('stroke', '#ccc')
      .attr(
        'd',
        d3.Delaunay.from(
          I,
          (i) => xScale(X[i]),
          (i) => yScale(Y[i])
        )
          .voronoi([0, 0, width, height])
          .render()
      );

  svg
    .append('g')
    .attr('transform', `translate(0,${height - marginBottom})`)
    .style('font-size', fontSizePx * 0.8 + 'px')
    .attr('class', 'x-axis')
    .call(xAxis);

  const ticks = d3.selectAll(selector + ' .x-axis .tick line');

  ticks.each(function (d, i) {
    if (i == 0 || i == ticks.size() - 1) {
      this.remove();
    }
  });

  svg
    .append('g')
    .attr('transform', `translate(${marginLeft},0)`)
    .style('font-size', fontSizePx * 0.8 + 'px')
    .call(yAxis)
    .call(
      voronoi
        ? () => {}
        : (g) =>
            g
              .selectAll('.tick line')
              .clone()
              .attr('x2', width - marginLeft - marginRight)
              .attr('stroke-opacity', 0.1)
    )
    .call((g) =>
      g
        .append('text')
        .attr('x', -marginLeft)
        .attr('y', marginTop - 30)
        .attr('fill', 'currentColor')
        .attr('text-anchor', 'start')
        .attr('font-size', fontSize)
        .text(yLabel)
    );

  const path = svg
    .append('g')
    .attr('fill', 'none')
    .attr('stroke', typeof color === 'string' ? color : null)
    .attr('stroke-linecap', strokeLinecap)
    .attr('stroke-linejoin', strokeLinejoin)
    .attr('stroke-width', strokeWidth)
    .attr('stroke-opacity', strokeOpacity)
    .selectAll('path')
    .data(d3.group(I, (i) => Z[i]))
    .join('path')
    .style('mix-blend-mode', mixBlendMode)
    .attr('stroke', typeof color === 'function' ? ([z]) => color(z) : null)
    .attr('d', ([, I]) => line(I));

  const dot = svg.append('g').attr('display', 'none');

  dot.append('circle').attr('r', 1.5 * strokeWidth);

  dot
    .append('text')
    .attr('font-family', 'sans-serif')
    .attr('font-size', fontSize)
    .attr('text-anchor', 'middle')
    .attr('y', -10);

  svg.append('g').call((group) =>
    group
      .append('text')
      .attr('font-family', 'sans-serif')
      .attr('font-size', fontSize)
      .attr('font-weight', 'bold')
      .attr('fill', 'currentColor')
      .attr('text-anchor', 'middle')
      .attr('y', marginTop - 10)
      .attr('x', (width - marginLeft) / 2)
      .text(chartTitle)
  );

  function pointermoved(event) {
    const [xm, ym] = d3.pointer(event);

    const i = d3.least(I, (i) => Math.hypot(xScale(X[i]) - xm, yScale(Y[i]) - ym)); // closest point

    path
      .style('stroke', ([z]) => (Z[i] === z ? null : '#ddd'))
      .filter(([z]) => Z[i] === z)
      .raise();
    dot.attr('transform', `translate(${xScale(X[i])},${yScale(Y[i])})`);
    if (T) dot.select('text').text(T[i]);
    svg.property('value', O[i]).dispatch('input', { bubbles: true });
  }

  function pointerentered() {
    path.style('mix-blend-mode', null).style('stroke', '#ddd');
    dot.attr('display', null);
  }

  function pointerleft() {
    path.style('mix-blend-mode', mixBlendMode).style('stroke', null);
    dot.attr('display', 'none');
    svg.node().value = null;
    svg.dispatch('input', { bubbles: true });
  }
}

export default MultiLineChart;
