import React, { useState } from 'react';
import { graphql } from 'gatsby';
import styled from 'styled-components';
import Markdown from 'react-markdown';
import { Badge, Button } from 'react-bootstrap';

import BillboardChart from 'react-billboardjs';
import { donut } from 'billboard.js';
import 'billboard.js/dist/billboard.css';

import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import Link from 'components/ui/Link';
import LocationMap from 'components/visualizations/LocationMap';

const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

const Description = styled(Markdown)`
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
`;

const Card = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  padding: 1em 2em 2em 2em;
  margin-bottom: 2em;
  width: 100%;
`;

const FieldNameHeading = styled.h1`
  font-size: 20px;
  font-weight: 800;
  line-height: 1.5;
  margin-bottom: 0.5em;
`;

const StyledLi = styled.li`
  margin-left: 1em;
`;

const StyledUl = styled.ul`
  padding: 0;
`;

const StatItemText = styled.span`
  margin-right: 0.7em;
`;

const StatItem = ({ text, value }) => {
  return (
    <>
      <StatItemText>{text}</StatItemText>
      <Badge pill bg="light" text="dark">
        {`${value || 0} ${value === 1 ? 'Incident' : 'Incidents'}`}
      </Badge>
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
        <StyledUl>
          {sortedStatsArray
            .filter((item, index) => showAllStats || index < 5)
            .map(({ item, value }) => (
              <StyledLi key={`${short_name}-${item}`}>
                <Link
                  to={
                    `/apps/discover?classifications=` +
                    encodeURIComponent(`${namespace}:${short_name}:${item}`)
                  }
                >
                  {valueStats !== {} ? <StatItem text={item} value={value} /> : <>{`${item}`}</>}
                </Link>
              </StyledLi>
            ))}
        </StyledUl>
        {sortedStatsArray.length > 5 && (
          <Button
            variant="outline-primary"
            className="btn btn-sm assignment-button"
            onClick={toggleShowAllStats}
          >
            {`Show ${showAllStats ? 'fewer stats' : 'more stats'}`}
          </Button>
        )}
        {short_name == 'Location' ? (
          <LocationMap
            data={{ columns: sortedStatsArray.map((a) => [a.item, a.value]) }}
            geocodes={geocodes}
            className="mt-4 border rounded"
          />
        ) : (
          <BillboardChart data={data} />
        )}
      </div>
    );
  }

  return <></>;
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
        const value = c.classifications[field.short_name.split(' ').join('_')];

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
        const value = c.classifications[field.short_name.split(' ').join('_')];

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
    const { Location } = c.classifications;

    if (!(Location in map)) {
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
    .sort((a, b) => b.weight - a.weight)
    .filter((entry) => entry.public === null || entry.public);

  const stats = getStats(props.pageContext.taxonomy, allMongodbAiidprodClassifications.nodes);

  const geocodes = getGeocodes(allMongodbAiidprodClassifications.nodes);

  return (
    <Layout {...props}>
      <div className={'titleWrapper'}>
        <StyledHeading>{namespace}</StyledHeading>
      </div>
      <Description>{description}</Description>
      <h1 className="heading1">Taxonomy Fields</h1>
      {sortedFieldsArray
        .filter((f) => f.short_name !== 'Publish')
        .map(({ long_name, long_description, permitted_values, short_name, instant_facet }) => (
          <Row key={short_name} data-cy={`field-${short_name}`}>
            <Card>
              <FieldNameHeading data-cy={`title-${short_name}`}>
                {long_name}{' '}
                {instant_facet && <Badge bg="secondary">Searchable in Discover App</Badge>}
              </FieldNameHeading>
              <Description>{long_description}</Description>
              <FacetList
                namespace={namespace}
                instant_facet={instant_facet}
                short_name={short_name}
                permitted_values={permitted_values}
                stats={stats}
                geocodes={geocodes}
              />
            </Card>
          </Row>
        ))}
    </Layout>
  );
};

export default Taxonomy;

export const pageQuery = graphql`
  query ($namespace: String!) {
    allMongodbAiidprodClassifications(
      filter: {
        namespace: { eq: $namespace }
        incident_id: { lt: 1000 }
        classifications: { Publish: { eq: true } }
      }
    ) {
      ...ClassificationFields
    }
  }
`;
