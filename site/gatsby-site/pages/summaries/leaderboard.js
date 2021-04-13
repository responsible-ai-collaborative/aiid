import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import Layout from 'components/Layout';
import Link from 'components/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';

const LEADERBOARDS = [
  {
    title: 'Submitters',
    attribute: 'submitters',
  },
  {
    title: 'Authors',
    attribute: 'authors',
  },
  {
    title: 'Domains',
    attribute: 'source_domain',
  },
];

export const Leaderboards = ({ leaderboardsToGenerate, incidentData, limit, itemRender }) => {
  const leaderboards = [];

  const leaderboardsHash = {};

  const leaderboardsArray = {};

  for (const { attribute } of leaderboardsToGenerate) {
    leaderboardsHash[attribute] = {};
  }

  incidentData.forEach((element) => {
    for (const { attribute } of leaderboardsToGenerate) {
      const currentHash = leaderboardsHash[attribute];

      if (typeof element[attribute] === 'string') {
        if (element[attribute] in currentHash) {
          currentHash[element[attribute]] += 1;
        } else {
          currentHash[element[attribute]] = 1;
        }
      }

      if (Array.isArray(element[attribute])) {
        element[attribute].forEach((item) => {
          if (item in currentHash) {
            currentHash[item] += 1;
          } else {
            currentHash[item] = 1;
          }
        });
      }
    }
  });

  for (const { title, attribute } of leaderboardsToGenerate) {
    const currentHash = leaderboardsHash[attribute];

    leaderboardsArray[attribute] = [];
    for (const item in currentHash) {
      leaderboardsArray[attribute].push({
        label: item,
        value: currentHash[item],
        attribute,
      });
    }

    leaderboards.push({
      title,
      array: leaderboardsArray[attribute].sort((a, b) => {
        return b.value - a.value;
      }),
    });
  }

  if (limit && limit > 0) {
    leaderboards.forEach((board) => {
      return {
        title: board.title,
        array: board.array.splice(limit),
      };
    });
  }

  return (
    <>
      {leaderboards.map((board) => (
        <div key={board.title}>
          <h2>{board.title}</h2>
          <ul>
            {itemRender ? (
              <>{board.array.map((item, index) => itemRender(item, index))}</>
            ) : (
              <>
                {board.array.map((item) => (
                  <li key={`${item.label}-${item.value}`}>
                    {item.label}: {item.value}
                  </li>
                ))}
              </>
            )}
          </ul>
        </div>
      ))}
    </>
  );
};

export default class Authors extends Component {
  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }
    const {
      allMongodbAiidprodIncidents: { nodes },
    } = data;

    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Submissions Leaderboard</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>Leaderboard</StyledHeading>
        </div>
        <StyledMainWrapper>
          <p className="paragraph">
            This is a ranking of the top submitters, authors, and domains by count. If you would
            like to explore the contents of the reports, you should work through the
            <Link to="/about_apps/1-discover"> Discover app</Link>.
          </p>
          <Leaderboards leaderboardsToGenerate={LEADERBOARDS} incidentData={nodes} />
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query LeaderboardAuthors {
    allMongodbAiidprodIncidents {
      nodes {
        id
        authors
        source_domain
        submitters
      }
    }
  }
`;
