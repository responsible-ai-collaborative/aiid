import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';

const TaxonomiesList = () => {
  return (
    <StaticQuery
      query={graphql`
        query TaxonomiesList {
          allMongodbAiidprodTaxa {
            nodes {
              namespace
              weight
            }
          }
        }
      `}
      render={({ allMongodbAiidprodTaxa: { nodes } }) => {
        return (
          <ul>
            {nodes
              .sort((a, b) => b.weight - a.weight)
              .map((taxonomy) => (
                <li key={taxonomy.namespace}>
                  <Link to={`/taxonomy/${taxonomy.namespace.toLowerCase()}`}>
                    {taxonomy.namespace}
                  </Link>
                </li>
              ))}
          </ul>
        );
      }}
    />
  );
};

export default TaxonomiesList;
