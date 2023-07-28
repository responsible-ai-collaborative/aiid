import React from 'react';
import { getClassificationValue } from 'utils/classifications';

import AiidHelmet from 'components/AiidHelmet';
import { isAiHarm } from 'utils/cset';

import BillboardJS from '@billboard.js/react';
import bb, { bar } from 'billboard.js';
import { Trans, useTranslation } from 'react-i18next';

export default function CsetTaxonomyPage(props) {
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

  const { t } = useTranslation();

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
        <Trans i18nKey={'csetChartDeveloped'}>
          CSET has developed specific definitions for the underlined phrases that may differ from
          other organizations&apos; definitions. As a result, other organizations may make different
          assessments on whether any particular AI incident is (or is not) AI harm. Details about
          CSET&apos;s definitions for AI harm can be found
          <a
            href="https://github.com/georgetown-cset/CSET-AIID-harm-taxonomy"
            target="_blank"
            rel="noreferrer"
          >
            here
          </a>
          .
        </Trans>
      </div>

      <div className="mt-2">
        <Trans i18nKey={'csetChartMail'}>
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
        titleDescription={t(
          'Does the incident involve a system that meets the CSET definition for an AI system?'
        )}
        className="mt-8"
      />
      <GroupBarChart
        title="Basis for differential treatment"
        titleDescription={t('If there was differential treatment, on what basis?')}
        subtitle={
          <Trans>
            Differential treatment based upon a protected characteristic: This special interest
            intangible harm covers bias and fairness issues concerning AI. However, the bias must be
            associated with a group having a protected characteristic.
          </Trans>
        }
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
        className="mt-8"
      />
      <GroupBarChart
        groups={allVsHarmDefinition}
        attributeShortName={'Sector of Deployment'}
        classifications={classifications}
        namespace={namespace}
        titleDescription={t('In which sector did the incident occur?')}
        className="mt-8"
      />
      <GroupBarChart
        groups={allVsHarmDefinition}
        attributeShortName={'Autonomy Level'}
        classifications={classifications}
        namespace={namespace}
        titleDescription={t(
          'How autonomously did the technology operate at the time of the incident?'
        )}
        subtitle={
          <>
            <div>
              <Trans>
                Autonomy is an AI&apos;s capability to operate independently. Levels of autonomy
                differ based on whether or not the AI makes independent decisions and the degree of
                human oversight. The level of autonomy does not depend on the type of input the AI
                receives, whether it is human- or machine-generated.
              </Trans>
              <div>
                <Trans>Currently, CSET is annotating three levels of autonomy.</Trans>
              </div>
              <ul>
                <li>
                  <Trans>
                    Level 1: the system operates independently with no simultaneous human oversight.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Level 2: the system operates independently but with human oversight, where the
                    system makes a decision or takes an action, but a human actively observes the
                    behavior and can override the system in real-time.
                  </Trans>
                </li>
                <li>
                  <Trans>
                    Level 3: the system provides inputs and suggested decisions or actions to a
                    human that actively chooses to proceed with the AI&apos;s direction.
                  </Trans>
                </li>
              </ul>
            </div>
          </>
        }
        className="mt-10"
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
        {
          attributeShortName: 'Physical Objects',
          titleDescription: 'Did the incident occur in a domain with physical objects?',
          subtitle: (
            <>
              <Trans>
                Incidents that involve physical objects are more likely to have damage or injury.
                However, AI systems that do not operate in a physical domain can still lead to harm.
              </Trans>
            </>
          ),
        },
        {
          attributeShortName: 'Entertainment Industry',
          titleDescription: 'Did the incident occur in the entertainment industry?',
          subtitle: (
            <Trans>
              AI systems used for entertainment are less likely to involve physical objects and
              hence unlikely to be associated with damage, injury, or loss. Additionally, there is a
              lower expectation for truthful information from entertainment, making detrimental
              content less likely (but still possible).
            </Trans>
          ),
        },
        {
          attributeShortName: 'Report, Test, or Study of data',
          titleDescription:
            'Was the incident about a report, test, or study of training data instead of the AI itself?',
          subtitle: (
            <Trans>
              The quality of AI training and deployment data can potentially create harm or risks in
              AI systems. However, an issue in the data does not necessarily mean the AI will cause
              harm or increase the risk for harm. It is possible that developers or users apply
              techniques and processes to mitigate issues with data.
            </Trans>
          ),
        },
        {
          attributeShortName: 'Deployed',
          titleDescription:
            'Was the reported system (even if AI involvement is unknown) deployed or sold to users?',
          subtitle: <></>,
        },
        {
          attributeShortName: 'Producer Test in Controlled Conditions',
          titleDescription:
            'Was this a test or demonstration of an AI system done by developers, producers, or researchers (versus users) in controlled conditions?',
          subtitle: (
            <Trans>
              AI tests or demonstrations by developers, producers, or researchers in controlled
              environments are less likely to expose people, organizations, property, institutions,
              or the natural environment to harm. Controlled environments may include situations
              such as an isolated compute system, a regulatory sandbox, or an autonomous vehicle
              testing range.
            </Trans>
          ),
        },
        {
          attributeShortName: 'Producer Test in Operational Conditions',
          titleDescription:
            'Was this a test or demonstration of an AI system done by developers, producers, or researchers (versus users) in operational conditions?',
          subtitle: (
            <Trans>
              Some AI systems undergo testing or demonstration in an operational environment.
              Testing in operational environments still occurs before the system is deployed by
              end-users. However, relative to controlled environments, operational environments try
              to closely represent real-world conditions that affect use of the AI system.{' '}
            </Trans>
          ),
        },
        {
          attributeShortName: 'User Test in Controlled Conditions',
          titleDescription:
            'Was this a test or demonstration of an AI system done by users in controlled conditions?',
          subtitle: (
            <Trans>
              Sometimes, prior to deployment, the users will perform a test or demonstration of the
              AI system. The involvement of a user (versus a developer, producer, or researcher)
              increases the likelihood that harm can occur even if the AI system is being tested in
              controlled environments because a user may not be as familiar with the functionality
              or operation of the AI system.
            </Trans>
          ),
        },
        {
          attributeShortName: 'User Test in Operational Conditions',
          titleDescription:
            'Was this a test or demonstration of an AI system done by users in operational conditions?',
          subtitle: (
            <Trans>
              The involvement of a user (versus a developer, producer, or researcher) increases the
              likelihood that harm can occur even if the AI system is being tested. Relative to
              controlled environments, operational environments try to closely represent real-world
              conditions and end-users that affect use of the AI system. Therefore, testing in an
              operational environment typically poses a heightened risk of harm to people,
              organizations, property, institutions, or the environment.
            </Trans>
          ),
        },
      ].map(({ attributeShortName, titleDescription, subtitle }) => (
        <GroupBarChart
          key={attributeShortName}
          title={`Domain questions – ${attributeShortName}`}
          groups={allVsHarmDefinition}
          attributeShortName={attributeShortName}
          classifications={classifications}
          namespace={namespace}
          titleDescription={titleDescription}
          subtitle={subtitle}
          className="mt-8"
        />
      ))}
    </>
  );
}

function GroupBarChart({
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
    <div className={`${className || ''}`}>
      <h2 className="text-center">{titleDescription}</h2>
      {subtitle && <>{subtitle}</>}
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
                  <tbody>
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
                  </tbody>
                </table>
              </div>
            );
          })}
      </div>
    </div>
  );
}
