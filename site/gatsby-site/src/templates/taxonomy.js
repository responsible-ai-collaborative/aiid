import React from 'react';
import { graphql } from 'gatsby';
import { getClassificationValue } from 'utils/classifications';

import AiidHelmet from 'components/AiidHelmet';
import { isAiHarm } from 'utils/cset';

import BillboardJS from '@billboard.js/react';
import bb, { bar } from 'billboard.js';
import { Trans } from 'react-i18next';

const Taxonomy = (props) => {
  if (!props || !props.pageContext || !props.data) {
    return null;
  }

  const { allMongodbAiidprodClassifications } = props.data;

  const { namespace } = props.pageContext.taxonomy;

  const metaTitle = `${namespace} Charts`;

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

  const classifications = allMongodbAiidprodClassifications.nodes;

  return (
    <>
      <AiidHelmet {...{ metaTitle }} path={props.location.pathname}>
        <meta property="og:type" content="website" />
      </AiidHelmet>

      <div className={'titleWrapper'}>
        <h1>{metaTitle}</h1>
      </div>

      <div>
        <Trans i18nKey="csetCharts">
          The CSET AI Harm Taxonomy for AIID is the second edition of the CSET incident taxonomy. It
          characterizes the harms, entities, and technologies involved in AI incidents and the
          circumstances of their occurrence. The charts below show select fields from the CSET AI
          Harm Taxonomy for AIID. Details about each field can be found{' '}
          <a
            href="https://github.com/georgetown-cset/CSET-AIID-harm-taxonomy"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          . However, brief descriptions of the field are provided above each chart.
        </Trans>
      </div>

      <div className="mt-2">
        <Trans>The taxonomy provides the CSET definition for AI harm.</Trans>
      </div>

      <div className="mt-2">
        <Trans>
          AI harm has four elements which, once appropriately defined, enable the identification of
          AI harm. These key components serve to distinguish harm from non-harm and AI harm from
          non-AI harm. To be an AI harm, there must be:
        </Trans>
        <ul className="ml-4">
          <li>
            <Trans>
              1) an <u>entity</u> that experienced
            </Trans>
          </li>
          <li>
            <Trans>
              2) a <u>harm event</u> or <u>harm issue</u> that
            </Trans>
          </li>
          <li>
            <Trans>
              3) can be <u>directly linked</u> to a consequence of the behavior of
            </Trans>
          </li>
          <li>
            <Trans>
              4) an <u>AI system</u>.
            </Trans>
          </li>
        </ul>
        <Trans>All four elements need to be present in order for there to be AI harm.</Trans>
      </div>

      <div className="mt-2">
        <Trans>
          Not every incident in AIID meets this definition of AI harm. The below bar charts show the
          annotated results for both all AIID incidents and incidents that meet the CSET definition
          of AI harm.
        </Trans>
      </div>

      <div className="mt-2">
        <Trans>
          CSET has developed specific definitions for the underlined phrases that may differ from
          other organizations’ definitions. As a result, other organizations may make different
          assessments on whether any particular AI incident is (or is not) AI harm. Details about
          CSET’s definitions for AI harm can be found{' '}
          <a href="https://github.com/georgetown-cset/CSET-AIID-harm-taxonomy" target="_blank" rel="noreferrer">
            here
          </a>
          .
        </Trans>
      </div>

      <div className="mt-2">
        <Trans>
          Every incident is independently classified by two CSET annotators. Annotations are
          peer-reviewed and finally randomly selected for quality control ahead of publication.
          Despite this rigorous process, mistakes do happen, and readers are invited to{' '}
          <a href="mailto:mia.hoffmann@georgetown.edu" target="_blank" rel="noreferrer">
            report
          </a>{' '}
          any errors they might discover while browsing.
        </Trans>
      </div>

      <GroupBarChart
        groups={allVsHarmDefinition}
        attributeShortName={'AI System'}
        classifications={classifications}
        namespace={namespace}
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
        namespace={namespace}
      />
      <GroupBarChart
        groups={allVsHarmDefinition}
        attributeShortName={'Sector of Deployment'}
        classifications={classifications}
        namespace={namespace}
      />
      <GroupBarChart
        groups={allVsHarmDefinition}
        attributeShortName={'Autonomy Level'}
        classifications={classifications}
        namespace={namespace}
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
          namespace={namespace}
        />
      ))}
    </>
  );
};

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

export default Taxonomy;

export const pageQuery = graphql`
  query ($namespace: String!) {
    allMongodbAiidprodClassifications(
      filter: { namespace: { eq: $namespace }, incident_id: { lt: 1000 } }
    ) {
      nodes {
        namespace
        attributes {
          short_name
          value_json
        }
        fields {
          geocode {
            geometry {
              location {
                lat
                lng
              }
            }
          }
        }
      }
    }
  }
`;
