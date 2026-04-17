import React, { useMemo } from 'react';
import BillboardJS from '@billboard.js/react';
import bb, { bar, line, scatter } from 'billboard.js';
import { toBillboardColumns, toScatterData } from 'utils/crossTaxonomy';
import { useTranslation } from 'react-i18next';

export default function CrossTaxonomyChart({ chartType, crossData, xLabel, yLabel }) {
  const { t } = useTranslation();

  const options = useMemo(() => {
    if (!crossData || crossData.xValues.length === 0) return null;

    if (chartType === 'scatter') {
      return buildScatterOptions(crossData, xLabel, yLabel, t);
    }
    return buildBarLineOptions(crossData, chartType, xLabel, yLabel, t);
  }, [crossData, chartType, xLabel, yLabel, t]);

  if (!options) return null;

  const height = Math.max(400, crossData.xValues.length * 25 + 100);

  return (
    <div className="[&_.bb-ygrid-line>line]:stroke-gray-300 [&_.bb-ygrid-line>line]:stroke-1">
      <BillboardJS
        bb={bb}
        options={{
          ...options,
          size: { height },
          resize: { auto: true },
        }}
      />
    </div>
  );
}

function buildBarLineOptions(crossData, chartType, xLabel, yLabel, t) {
  const columns = toBillboardColumns(crossData);

  const chartTypeFunc = chartType === 'line' ? line() : bar();

  const isStacked = chartType === 'histogram';

  return {
    data: {
      x: 'x',
      columns,
      type: chartTypeFunc,
      groups: isStacked ? [crossData.yValues] : [],
    },
    axis: {
      x: {
        type: 'category',
        label: { text: t(xLabel), position: 'outer-center' },
        tick: { rotate: crossData.xValues.length > 8 ? -45 : 0, tooltip: true },
        height: crossData.xValues.length > 8 ? 120 : 60,
      },
      y: {
        label: { text: t(yLabel), position: 'outer-middle' },
      },
    },
    bar: {
      width: { ratio: 0.7 },
    },
    legend: {
      show: crossData.yValues.length <= 20,
    },
    tooltip: {
      grouped: true,
    },
  };
}

function buildScatterOptions(crossData, xLabel, yLabel, t) {
  const { xs, columns, xValues } = toScatterData(crossData);

  return {
    data: {
      xs,
      columns,
      type: scatter(),
    },
    axis: {
      x: {
        label: { text: t(xLabel), position: 'outer-center' },
        tick: {
          format: (i) => xValues[Math.round(i)] || '',
          rotate: xValues.length > 8 ? -45 : 0,
        },
        height: xValues.length > 8 ? 120 : 60,
      },
      y: {
        label: { text: t('Count'), position: 'outer-middle' },
        min: 0,
      },
    },
    legend: {
      show: crossData.yValues.length <= 20,
    },
    point: {
      r: 5,
    },
    tooltip: {
      format: {
        title: (i) => xValues[Math.round(i)] || '',
      },
    },
  };
}
