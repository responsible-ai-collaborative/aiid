import React from 'react';
import { graphql } from 'gatsby';

import AiidHelmet from 'components/AiidHelmet';
import { getClassificationValue } from 'utils/classifications';
import { isAiHarm } from 'utils/cset';
import GroupBarChart from 'components/taxa/GroupBarChart';

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

      <div className="max-w-3xl">
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
            oversight, where the system makes decisions or takes actions but a human actively
            observes the behavior and can override the system in real time?
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
