import React from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import Markdown from 'react-markdown';
import Badge from 'react-bootstrap/Badge';

import Layout from 'components/Layout';
import { StyledHeading } from 'components/styles/Docs';
import Link from 'components/Link';

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

const FacetList = ({ namespace, instant_facet, short_name, permitted_values, stats }) => {
  if (!instant_facet || permitted_values === null) {
    return '';
  }

  let valueStats = {};

  if (stats[short_name]) {
    valueStats = stats[short_name];
  }
  return (
    <div>
      <ul>
        {permitted_values.map((item) => (
          <StyledLi key={`${short_name}-${item}`}>
            <Link
              to={
                `/apps/discover?classifications=` +
                encodeURIComponent(`${namespace}:${short_name}:${item}`)
              }
            >
              {valueStats !== {} ? (
                <>
                  {`${item} => ${valueStats[item]} ${
                    valueStats[item] > 1 || valueStats[item] === 0 ? 'Incidents' : 'Incident'
                  }`}
                </>
              ) : (
                <>{`${item}`}</>
              )}
            </Link>
          </StyledLi>
        ))}
      </ul>
    </div>
  );
};

const Taxonomy = (props) => {
  if (!props || !props.pageContext) {
    return null;
  }

  const { namespace, description, field_list } = props.pageContext.taxonomy;

  const sortedFieldsArray = field_list.sort((a, b) => b.weight - a.weight);

  return (
    <Layout {...props}>
      <div className={'titleWrapper'}>
        <StyledHeading>{namespace}</StyledHeading>
      </div>
      <Description>{description}</Description>
      <h1 className="heading1">Taxonomy Fields</h1>
      {sortedFieldsArray.map(
        ({ long_name, long_description, permitted_values, short_name, instant_facet }) => (
          <Row key={md5(long_name)}>
            <Card>
              <FieldNameHeading>
                {long_name}{' '}
                {instant_facet && <Badge variant="secondary">Searchable in Facet</Badge>}
              </FieldNameHeading>
              <Description>{long_description}</Description>
              <FacetList
                namespace={namespace}
                instant_facet={instant_facet}
                short_name={short_name}
                permitted_values={permitted_values}
                stats={props.pageContext.stats}
              />
            </Card>
          </Row>
        )
      )}
    </Layout>
  );
};

export default Taxonomy;
