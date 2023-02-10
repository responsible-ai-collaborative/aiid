import React, { useState } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import { Button } from 'react-bootstrap';

import BillboardChart from 'react-billboardjs';
import { donut } from 'billboard.js';
import 'billboard.js/dist/billboard.css';

import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import Link from 'components/ui/Link';
import LocationMap from 'components/visualizations/LocationMap';
import { Card, Badge } from 'flowbite-react';
import AiidHelmet from 'components/AiidHelmet';
import { getClassificationValue } from 'utils/classifications';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';

const Description = styled(Markdown)`
  margin-top: 0rem;
  h1 {
    font-size: 26px;
    font-weight: 800;
    line-height: 1.5;
    margin-bottom: 16px;
    margin-top: 32px;
  }
  p {
    line-height: 1.5;
  }
  p:first-child {
    margin-top: 0rem;
  }
`;

const StatItemText = styled.span``;

const StatItem = ({ text, value }) => {
  return (
    <>
      <StatItemText>{text}</StatItemText>
      <div className="flex ml-4">
        <Badge>{`${value || 0} ${value === 1 ? 'Incident' : 'Incidents'}`}</Badge>
      </div>
    </>
  );
};

const FacetList = ({ namespace, instant_facet, short_name, stats, geocodes }) => {
  if (!instant_facet) {
    return '';
  }

  let valueStats = {};

  if (stats[short_name]) {
    valueStats = stats[short_name];
  }

  const [showAllStats, setShowAllStats] = useState(false);

  const toggleShowAllStats = () => {
    setShowAllStats(!showAllStats);
  };

  if (valueStats && Object.keys(valueStats).length !== 0) {
    const valueStatsKeys = Object.keys(valueStats);

    let sortedStatsArray = [];

    valueStatsKeys.forEach((item) => {
      if (valueStats[item] > 0) {
        sortedStatsArray.push({
          item,
          value: valueStats[item],
        });
      }
    });

    sortedStatsArray.sort((a, b) => b.value - a.value);

    const data = {
      columns: [],
      type: donut(),
    };

    data.columns = sortedStatsArray.slice(0, 9).map((a) => [a.item, a.value]);
    if (sortedStatsArray.length > 9) {
      data.columns.push([
        'All Others',
        sortedStatsArray
          .slice(9)
          .reduce((accumulator, currentValue) => accumulator + currentValue.value, 0),
      ]);
    }

    return (
      <div>
        <strong>Discover</strong>:
        <ul className="text-gray-500 dark:text-gray-400 mt-4 ml-4">
          {sortedStatsArray
            .filter((item, index) => showAllStats || index < 5)
            .map(({ item, value }) => (
              <li key={`${short_name}-${item}`} className="mb-2">
                <Link
                  to={
                    `/apps/discover?classifications=` +
                    encodeURIComponent(`${namespace}:${short_name}:${item}`)
                  }
                  className="flex text-black hover:text-primary-blue"
                >
                  {valueStats !== {} ? <StatItem text={item} value={value} /> : <>{`${item}`}</>}
                </Link>
              </li>
            ))}
        </ul>
        {sortedStatsArray.length > 5 && (
          <Button
            variant="link"
            className="mb-3 btn btn-sm assignment-button"
            onClick={toggleShowAllStats}
            style={{ padding: '0px', margin: '0px', textDecoration: 'none' }}
          >
            {`Show ${showAllStats ? 'fewer stats' : 'more stats'}`}
          </Button>
        )}
        <div className="my-3">
          {short_name == 'Location' ? (
            <LocationMap
              data={{ columns: sortedStatsArray.map((a) => [a.item, a.value]) }}
              geocodes={geocodes}
              className="mt-4 border rounded"
            />
          ) : (
            <BillboardChart
              data={{
                ...data,
                onclick: (column) => {
                  if (column.name == 'All Others') {
                    window.open('/apps/discover');
                  } else {
                    window.open(
                      '/apps/discover?classifications=' +
                        [namespace, short_name, column.name].join(':')
                    );
                  }
                },
              }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="text-center h-[210px] relative mb-2">
      <div className="absolute inset-0 flex items-center justify-center">
        <FontAwesomeIcon
          fixedWidth
          icon={faQuestionCircle}
          className="text-[200px] block mx-auto text-gray-100"
        />
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg">No classifications with this field</span>
      </div>
    </div>
  );
};

const getStats = (taxa, classification) => {
  const incrementStat = (stat, val) => {
    if (val === undefined || val === null || val === '') {
      return 0;
    }

    let current = stat[val];

    if (current) {
      return current + 1;
    }

    return 1;
  };

  const filteredClassification = classification.filter((c) => c.namespace === taxa.namespace);

  const stats = {};

  taxa.field_list
    .filter((field) => field.permitted_values && field.permitted_values.length > 0)
    .forEach((field) => {
      let auxStat = {};

      filteredClassification.forEach((c) => {
        const value = getClassificationValue(c, field.short_name);

        if (value?.length > 0) {
          if (typeof value === 'object') {
            value.forEach((v) => {
              auxStat[v] = incrementStat(auxStat, v);
            });
          } else {
            auxStat[value] = incrementStat(auxStat, value);
          }
        }
      });

      if (Object.entries(auxStat).length !== 0) {
        stats[field.short_name] = auxStat;
      }
    });

  taxa.field_list
    .filter(
      (field) =>
        !field.permitted_values ||
        field.permitted_values === 0 ||
        field.permitted_values.length === 0
    )
    .forEach((field) => {
      let auxStat = {};

      filteredClassification.forEach((c) => {
        const value = getClassificationValue(c, field.short_name);

        if ((value || typeof value === 'boolean') && value !== '') {
          if (typeof value === 'boolean') {
            auxStat[value] = incrementStat(auxStat, value);
          }

          if (field.display_type === 'bool' && typeof value !== 'boolean') {
            auxStat[value] = incrementStat(auxStat, value === 'Yes' ? 'Yes' : 'No');
          }

          if (typeof value === 'object') {
            value
              .filter((v) => v !== '')
              .forEach((v) => {
                auxStat[v] = incrementStat(auxStat, v);
              });
          }

          if (field.display_type === 'list' && typeof value !== 'object') {
            auxStat[value] = incrementStat(auxStat, value);
          }

          if (field.short_name === 'Location') {
            auxStat[value] = incrementStat(auxStat, value);
          }
        }
      });

      if (Object.keys(auxStat).length !== 0) {
        stats[field.short_name] = auxStat;
      }
    });

  return stats;
};

const getGeocodes = (classifications) => {
  const map = {};

  classifications.forEach((c) => {
    const Location = getClassificationValue(c, 'Location', { spaceToUnderScore: true });

    if (Location && !(Location in map)) {
      map[Location] = c.fields ? c.fields.geocode : {};
    }
  });

  return map;
};

const Taxonomy = (props) => {
  if (!props || !props.pageContext || !props.data) {
    return null;
  }

  const { allMongodbAiidprodClassifications } = props.data;

  const { namespace, description, field_list } = props.pageContext.taxonomy;

  const sortedFieldsArray = field_list
    .sort((a, b) =>
      a.instant_facet && !b.instant_facet
        ? -1
        : b.instant_facet && !a.instant_facet
        ? 1
        : b.weight - a.weight
    )
    .filter((entry) => entry.public === null || entry.public);

  const stats = getStats(props.pageContext.taxonomy, allMongodbAiidprodClassifications.nodes);

  const geocodes = getGeocodes(allMongodbAiidprodClassifications.nodes);

  return (
    <Layout {...props} className="">
      <AiidHelmet metaTitle={'Taxonomy: ' + namespace} path={props.location.pathname} />

      <div className={'titleWrapper'}>
        <StyledHeading>{namespace}</StyledHeading>
      </div>
      <Description>{description}</Description>
      <h1 className="heading1">Taxonomy Fields</h1>
      <div className="flex gap-9 flex-col">
        {sortedFieldsArray
          .filter((f) => f.short_name !== 'Publish')
          .map(({ long_name, long_description, permitted_values, short_name, instant_facet }) => (
            <div data-cy={`field-${short_name}`} key={short_name}>
              <Card>
                <h5
                  className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white relative hover:text-primary-blue flex items-center"
                  data-cy={`title-${short_name}`}
                >
                  {long_name}{' '}
                  {instant_facet && (
                    <span className="ml-2">
                      <Badge color="gray">Searchable in Discover App</Badge>
                    </span>
                  )}
                </h5>
                <FacetList
                  namespace={namespace}
                  instant_facet={instant_facet}
                  short_name={short_name}
                  permitted_values={permitted_values}
                  stats={stats}
                  geocodes={geocodes}
                />
                <Description>{'**Definition**: ' + long_description}</Description>
              </Card>
            </div>
          ))}
      </div>
    </Layout>
  );
};

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
