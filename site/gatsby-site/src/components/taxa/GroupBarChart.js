import React from 'react';
import { getClassificationValue } from 'utils/classifications';
import BillboardJS from '@billboard.js/react';
import bb, { bar } from 'billboard.js';
import { Trans, useTranslation } from 'react-i18next';

export default function GroupBarChart({
  groups,
  attributeShortName,
  classifications,
  namespace,
  title,
  titleDescription = '',
  subtitle = null,
  className = '',
}) {
  title ||= attributeShortName;

  for (const groupName in groups) {
    groups[groupName].valuesCount = {};
  }

  let allValues = new Set();

  for (const classification of classifications) {
    if (classification.namespace != namespace) continue;

    const baseValue = getClassificationValue(classification, attributeShortName);

    const values = Array.isArray(baseValue) ? baseValue : [baseValue];

    for (const value of values) {
      if (value) allValues.add(value);

      for (const groupName in groups) {
        const group = groups[groupName];

        if (group.filter(classification)) {
          group.valuesCount[value] ||= 0;
          group.valuesCount[value] += 1;
        }
      }
    }
  }

  allValues = Array.from(allValues);

  const groupNames = Object.keys(groups);

  const max = (list) => list.reduce((m, e) => Math.max(m, e), 0);

  const sum = (list) => list.reduce((s, e) => s + e, 0);

  const groupSizes = groupNames.map((groupName) =>
    sum(Object.values(groups[groupName].valuesCount))
  );

  const largestGroupSize = max(groupSizes);

  const autonomySort = (a, b) => Number(a.id[8] || 0) - Number(b.id[8] || 0);

  const stepMultiple = 5; // Stepsize should be a multiple of this

  const stepCount = 10;

  const stepSize = Math.round(largestGroupSize / stepCount / stepMultiple) * stepMultiple;

  const { t } = useTranslation();

  const translatedGroupNames = groupNames.map((groupName) => t(groupName));

  const names = allValues.reduce((obj, key) => {
    obj[key] = t(key);
    return obj;
  }, {});

  const options = {
    size: { height: 320 + 20 * allValues.length },
    data: {
      order: attributeShortName == 'Autonomy Level' ? autonomySort : undefined,
      x: 'x',
      columns: [
        ['x', ...translatedGroupNames],
        ...allValues
          .sort()
          .map((value) => [
            value,
            ...groupNames.map((groupName) => groups[groupName].valuesCount[value] || 0),
          ]),
      ],
      groups: [allValues],
      type: bar(),
      color: function (color, d) {
        if (d.id === 'yes') return '#2ca02c';
        if (d.id === 'no') return '#d62728';
        if (d.id === 'maybe') return '#1f77b4';
        return color;
      },
      names,
    },
    axis: {
      y: { tick: { stepSize } },
      y2: {
        show: false,
      },
      x: {
        type: 'category',
        height: 40,
        tick: {
          tooltip: true,
          stepSize: 10,
        },
      },
    },
    tooltip: {
      show: false,
    },
    grid: {
      y: {
        lines: Array(stepCount / 2 + 1)
          .fill()
          .map((_, i) => ({
            value: (i + 1) * 2 * stepSize,
            position: 'start',
          })),
      },
    },
  };

  return (
    <div
      className={`${
        className || ''
      } [&_.bb-ygrid-line>line]:stroke-gray-300 [&_.bb-ygrid-line>line]:stroke-1`}
    >
      <h2 className="text-center">{titleDescription}</h2>
      {subtitle && <>{subtitle}</>}
      <div className="text-center">
        <h2 className="text-lg mb-0 mt-4">{t(title)}</h2>
        <Trans>(by Incident Count)</Trans>
      </div>
      <BillboardJS bb={bb} options={{ ...options }} />
      <div className="flex gap-2 flex-wrap justify-around">
        {allValues.length > 5 &&
          groupNames.map((groupName) => {
            const byGroupOccurences = (a, b) =>
              (groups[groupName].valuesCount[b] || 0) - (groups[groupName].valuesCount[a] || 0);

            return (
              <div key={groupName}>
                <h3 className="text-lg text-center">{t(groupName)}</h3>
                <table>
                  <tbody>
                    <tr>
                      <th className="p2 text-left">
                        <Trans>Category</Trans>
                      </th>
                      <th className="p2">
                        <Trans>Count</Trans>
                      </th>
                    </tr>
                    {allValues.sort(byGroupOccurences).map((value) => (
                      <tr key={value}>
                        <td className="p2">{t(value)}</td>
                        <td className="p2 text-center">{groups[groupName].valuesCount[value]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    </div>
  );
}
