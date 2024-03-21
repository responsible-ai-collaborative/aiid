import React from 'react';
import { graphql } from 'gatsby';
import CsetTaxonomyPage from 'components/taxa/CsetTaxonomyPage';
import FacetTaxonomyPage from 'components/taxa/FacetTaxonomyPage';
import HeadContent from 'components/HeadContent';

const Taxonomy = (props) => {
  if (!props || !props.pageContext || !props.data) {
    return null;
  }
  const { namespace } = props.pageContext.taxonomy;

  return namespace == 'CSETv1' ? <CsetTaxonomyPage {...props} /> : <FacetTaxonomyPage {...props} />;
};

export default Taxonomy;

export const Head = (props) => {
  const { namespace } = props.pageContext.taxonomy;

  const metaTitle = `${namespace} Charts`;

  return (
    <HeadContent
      metaTitle={metaTitle}
      metaDescription={metaTitle}
      path={props.location.pathname}
      metaType="website"
    />
  );
};

export const pageQuery = graphql`
  query ($namespace: String!) {
    allMongodbAiidprodClassifications(
      filter: {
        namespace: { eq: $namespace }
        incidents: { elemMatch: { incident_id: { lt: 1000 } } }
      }
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
        publish
      }
    }
  }
`;
