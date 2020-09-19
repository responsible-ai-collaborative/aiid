import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';

import uuid from 'react-uuid'

import { Layout, Link } from '$components';
import config from '../config';
import { Edit, StyledHeading, StyledMainWrapper } from '../src/components/styles/Docs';

const Leaderboard = ({title, content}) => {
  return (<>
      <h2>{title}</h2>
          <ul>
            {content.map((value, index) => (
                <li key={uuid()}>{value[0]}: {value[1]}</li>
            ))}
          </ul>
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
      allMongodbAiidprodIncidents: {
        nodes
      }
    } = data;

    let leaderboardAuthors = {}
    let leaderboardSubmitters = {}
    let leaderboardDomains = {}
    nodes.forEach(element => {
      if(element["source_domain"] in leaderboardDomains) {
        leaderboardDomains[element["source_domain"]] += 1
      } else {
        leaderboardDomains[element["source_domain"]] = 1
      }
      element["authors"].forEach(author => {
        if(author in leaderboardAuthors) {
          leaderboardAuthors[author] += 1
        } else {
          leaderboardAuthors[author] = 1
        }
      })
      element["submitters"].forEach(submitter => {
        if(submitter in leaderboardSubmitters) {
          leaderboardSubmitters[submitter] += 1
        } else {
          leaderboardSubmitters[submitter] = 1
        }
      })
    });
    let leaderboardAuthorsSorted = []
    let leaderboardSubmittersSorted = []
    let leaderboardDomainsSorted = []
    for (var submitter in leaderboardSubmitters) {
        leaderboardSubmittersSorted.push([submitter, leaderboardSubmitters[submitter]]);
    }
    for (var author in leaderboardAuthors) {
        leaderboardAuthorsSorted.push([author, leaderboardAuthors[author]]);
    }
    for (var domain in leaderboardDomains) {
        leaderboardDomainsSorted.push([domain, leaderboardDomains[domain]]);
    }
    leaderboardSubmittersSorted.sort(function(a, b) {
        return b[1] - a[1];
    });
    leaderboardAuthorsSorted.sort(function(a, b) {
        return b[1] - a[1];
    });
    leaderboardDomainsSorted.sort(function(a, b) {
        return b[1] - a[1];
    });

    return (
      <Layout {...this.props}>
        <Helmet>
          <title>Incident List</title>
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>Leaderboard</StyledHeading>
        </div>
        <StyledMainWrapper>
          <p className="paragraph">
            This is a ranking of the top submitters, authors, and domains by count.
            If you would
            like to explore the contents of the reports, you
            should work through the
            <Link to="/apps/1-discover"> Discover app</Link>.
          </p>
          <Leaderboard title="Submitters" content={leaderboardSubmittersSorted} />
          <Leaderboard title="Authors" content={leaderboardAuthorsSorted} />
          <Leaderboard title="Domains" content={leaderboardDomainsSorted} />
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
query LeaderboardAuthors {
  allMongodbAiidprodIncidents {
    nodes {
      authors
      source_domain
      submitters
    }
  }
}


`;