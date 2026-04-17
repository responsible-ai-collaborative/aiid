import React, { useMemo } from 'react';
import { Card } from 'flowbite-react';
import BillboardJS from '@billboard.js/react';
import bb, { bar, donut } from 'billboard.js';
import { Trans, useTranslation } from 'react-i18next';

// Color palette matching the AIID taxonomy page style
const COLORS = [
  '#3b82f6', // blue
  '#f59e0b', // amber
  '#10b981', // emerald
  '#ef4444', // red
  '#8b5cf6', // violet
  '#6b7280', // gray
  '#ec4899', // pink
  '#14b8a6', // teal
  '#f97316', // orange
  '#06b6d4', // cyan
  '#84cc16', // lime
  '#a855f7', // purple
  '#78716c', // stone
  '#e11d48', // rose
  '#0ea5e9', // sky
  '#d946ef', // fuchsia
  '#eab308', // yellow
  '#22c55e', // green
  '#64748b', // slate
  '#dc2626', // red-dark
];

export default function ChartCard({ title, subtitle, counts, chartType = 'bar', maxItems = 15 }) {
  const { t } = useTranslation();

  const sortedEntries = useMemo(() => {
    if (!counts) return [];

    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, maxItems);
  }, [counts, maxItems]);

  if (!counts || counts.size === 0) {
    return (
      <Card>
        <h3 className="text-base font-semibold">{t(title)}</h3>
        {subtitle && <p className="text-xs text-gray-500">{t(subtitle)}</p>}
        <div className="py-8 text-center text-sm text-gray-400">
          <Trans>No data available for this analysis.</Trans>
        </div>
      </Card>
    );
  }

  if (chartType === 'donut') {
    return <DonutChartCard title={title} subtitle={subtitle} entries={sortedEntries} t={t} />;
  }

  return <BarChartCard title={title} subtitle={subtitle} entries={sortedEntries} t={t} />;
}

function BarChartCard({ title, subtitle, entries, t }) {
  const options = useMemo(() => {
    // Each category becomes its own data series with a unique color
    const columns = entries.map(([label, count]) => [label, count]);

    const colors = {};

    entries.forEach(([label], i) => {
      colors[label] = COLORS[i % COLORS.length];
    });

    return {
      data: {
        columns,
        type: bar(),
        colors,
      },
      axis: {
        x: {
          show: false,
        },
        y: {
          label: { text: t('Count'), position: 'outer-middle' },
          tick: { format: (x) => (x === Math.floor(x) ? x : '') },
        },
      },
      bar: { width: { ratio: 0.7 } },
      legend: {
        show: true,
        position: 'bottom',
      },
      tooltip: { grouped: false },
      padding: { bottom: 10 },
      size: { height: Math.max(350, 300 + Math.ceil(entries.length / 3) * 24) },
      resize: { auto: true },
    };
  }, [entries, t]);

  return (
    <Card>
      <h3 className="text-base font-semibold">{t(title)}</h3>
      {subtitle && <p className="text-xs text-gray-500">{t(subtitle)}</p>}
      <div className="overflow-hidden [&_.bb-ygrid-line>line]:stroke-gray-300 [&_.bb-ygrid-line>line]:stroke-1">
        <BillboardJS bb={bb} options={options} />
      </div>
    </Card>
  );
}

function DonutChartCard({ title, subtitle, entries, t }) {
  const options = useMemo(() => {
    const columns = entries.map(([label, count]) => [label, count]);

    const colors = {};

    entries.forEach(([label], i) => {
      colors[label] = COLORS[i % COLORS.length];
    });

    const names = columns.reduce((obj, [key]) => {
      obj[key] = t(key);
      return obj;
    }, {});

    return {
      data: {
        columns,
        type: donut(),
        names,
        colors,
      },
      donut: {
        title: t(title),
      },
      legend: {
        show: true,
        position: 'bottom',
      },
      size: { height: 300 },
      resize: { auto: true },
    };
  }, [entries, t, title]);

  return (
    <Card>
      <h3 className="text-base font-semibold">{t(title)}</h3>
      {subtitle && <p className="text-xs text-gray-500">{t(subtitle)}</p>}
      <BillboardJS bb={bb} options={options} />
    </Card>
  );
}
