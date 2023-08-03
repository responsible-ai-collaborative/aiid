import React from 'react';
import { graphql } from 'gatsby';

import BillboardJS from '@billboard.js/react';
import bb, { bar } from 'billboard.js';

import AiidHelmet from 'components/AiidHelmet';
import { getClassificationValue } from 'utils/classifications';
import { isAiHarm } from 'utils/cset';

export default function CsetChartsPage({ data, ...props }) {
  const metaTitle = 'CSET Charts';

  const allVsHarmDefinition = {
    'All AIID Incidents': {
      filter: () => true,
      valuesCount: {},
    },
    'CSET AI Harm Definition': {
      filter: (c) => isAiHarm(c),
      valuesCount: {},
    },
  };

  const classifications = data.allMongodbAiidprodClassifications.nodes;

  return (
    <>
      <AiidHelmet {...{ metaTitle }} path={props.location.pathname}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1>{metaTitle}</h1>
      </div>
      <GroupBarChart
        groups={allVsHarmDefinition}
        attributeShortName={'AI System'}
        classifications={classifications}
        namespace="CSETv1"
      />
      <GroupBarChart
        title="Basis for differential treatment"
        attributeShortName={'Harm Distribution Basis'}
        groups={{
          'All AIID Incidents': {
            filter: (c) => getClassificationValue(c, 'Protected Characteristic') == 'yes',
            valuesCount: {},
          },
          'CSET AI Harm Definition': {
            filter: (c) =>
              getClassificationValue(c, 'Protected Characteristic') == 'yes' && isAiHarm(c),
            valuesCount: {},
          },
        }}
        classifications={classifications}
        namespace="CSETv1"
      />
      <GroupBarChart
        groups={allVsHarmDefinition}
        attributeShortName={'Sector of Deployment'}
        classifications={classifications}
        namespace="CSETv1"
      />
      <GroupBarChart
        groups={allVsHarmDefinition}
        attributeShortName={'Autonomy Level'}
        classifications={classifications}
        namespace="CSETv1"
      />
      <ul>
        <li>
          <b>Autonomy1 (fully autonomous)</b>: Does the system operate independently, without
          simultaneous human oversight, interaction or intervention?
        </li>

        <li>
          <b>Autonomy2 (human-on-loop)</b>: Does the system operate independently but with human
          oversight, where the system makes decisions or takes actions but a human actively observes
          the behavior and can override the system in real time?
        </li>

        <li>
          <b>Autonomy3 (human-in-the-loop)</b>: Does the system provide inputs and suggested
          decisions to a human that
        </li>
      </ul>
      {[
        'Physical Objects',
        'Entertainment Industry',
        'Report, Test, or Study of data',
        'Deployed',
        'Producer Test in Controlled Conditions',
        'Producer Test in Operational Conditions',
        'User Test in Controlled Conditions',
        'User Test in Operational Conditions',
      ].map((attributeShortName) => (
        <GroupBarChart
          key={attributeShortName}
          title={`Domain questions – ${attributeShortName}`}
          groups={allVsHarmDefinition}
          attributeShortName={attributeShortName}
          classifications={classifications}
          namespace="CSETv1"
        />
      ))}
    </>
  );
}

function GroupBarChart({ groups, attributeShortName, classifications, namespace, title }) {
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

  const autonomySort = (a, b) => Number(a.id[8] || 0) - Number(b.id[8] || 0);

  const options = {
    data: {
      order: attributeShortName == 'Autonomy Level' ? autonomySort : undefined,
      x: 'x',
      columns: [
        ['x', ...groupNames],
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
    },
    axis: {
      x: {
        type: 'category',
        height: 40,
        tick: {
          tooltip: true,
        },
      },
    },
    tooltip: {
      show: false,
    },
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-lg mb-0 mt-4">{title}</h2>
        (by Incident Count)
      </div>
      <BillboardJS bb={bb} options={{ ...options }} />
      <div className="flex gap-2 flex-wrap justify-around">
        {allValues.length > 5 &&
          groupNames.map((groupName) => {
            const byGroupOccurences = (a, b) =>
              (groups[groupName].valuesCount[b] || 0) - (groups[groupName].valuesCount[a] || 0);

            return (
              <div key={groupName}>
                <h3 className="text-lg text-center">{groupName}</h3>
                <table>
                  <tr>
                    <th className="p2 text-left">Category</th>
                    <th className="p2">Count</th>
                  </tr>
                  {allValues.sort(byGroupOccurences).map((value) => (
                    <tr key={value}>
                      <td className="p2">{value}</td>
                      <td className="p2 text-center">{groups[groupName].valuesCount[value]}</td>
                    </tr>
                  ))}
                </table>
              </div>
            );
          })}
      </div>
    </>
  );
}

export const pageQuery = graphql`
  query Classifications {
    allMongodbAiidprodClassifications(limit: 9999999) {
      nodes {
        namespace
        attributes {
          short_name
          value_json
        }
        publish
      }
    }
    allMongodbAiidprodTaxa(limit: 9999999) {
      nodes {
        namespace
        field_list {
          short_name
          hide_search
        }
      }
    }
  }
`;
