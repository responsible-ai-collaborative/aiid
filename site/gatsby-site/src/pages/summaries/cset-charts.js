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
      <BarChart
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
    </>
  );
}

function BarChart({ attributeShortName, classifications, namespace, title, filter = () => true }) {
  title ||= attributeShortName;

  const allValues = new Set();

  const valuesCount = {};

  for (const classification of classifications) {
    if (classification.namespace != namespace) continue;

    const baseValue = getClassificationValue(classification, attributeShortName);

    const values = Array.isArray(baseValue) ? baseValue : [baseValue];

    for (const value of values) {
      if (value) allValues.add(value);

      if (filter(classification)) {
        valuesCount[value] ||= 0;
        valuesCount[value] += 1;
      }
    }
  }

  const topValues = Array.from(allValues)
    .sort((a, b) => valuesCount[a] - valuesCount[b])
    .slice(0, 10);

  const options = {
    data: {
      columns: topValues.map((v) => [v, valuesCount[v]]),
      type: bar(),
    },
    axis: {
      x: {
        tick: {
          show: false,
          text: { show: false },
        },
      },
    },
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-lg mb-0 mt-4">{title}</h2>
        (by Incident Count)
      </div>
      <BillboardJS bb={bb} options={{ ...options }} />
    </>
  );
}

function GroupBarChart({ groups, attributeShortName, classifications, namespace, title }) {
  title ||= attributeShortName;

  const allValues = new Set();

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

  const groupNames = Object.keys(groups);

  const occurences = (v) => {
    let count = 0;

    for (const groupName of groupNames) {
      const group = groups[groupName];

      count += group.valuesCount[v];
    }
    return count;
  };

  const topValues = Array.from(allValues)
    .sort((a, b) => occurences(a) - occurences(b))
    .slice(0, 10);

  const options = {
    data: {
      x: 'x',
      columns: [
        ['x', ...groupNames],
        ...topValues.map((value) => [
          value,
          ...groupNames.map((groupName) => groups[groupName].valuesCount[value] || 0),
        ]),
      ],
      groups: [topValues],
      type: bar(),
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
  };

  return (
    <>
      <div className="text-center">
        <h2 className="text-lg mb-0 mt-4">{title}</h2>
        (by Incident Count)
      </div>
      <BillboardJS bb={bb} options={{ ...options }} />
    </>
  );
}

export const pageQuery = graphql`
  query Classifications {
    allMongodbAiidprodClassifications(limit: 9999999) {
      nodes {
        incident_id
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
