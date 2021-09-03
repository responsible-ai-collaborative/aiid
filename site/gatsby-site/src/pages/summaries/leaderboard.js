import React, { Component } from 'react';
import Helmet from 'react-helmet';

import Layout from 'components/Layout';
import Link from 'components/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';
import AuthorsLeaderboard from 'components/leaderboards/AuthorsLeaderboard';
import DomainsLeaderboard from 'components/leaderboards/DomainsLeaderboard';
import OriginalSubmittersLeaderboard from 'components/leaderboards/OriginalSubmittersLeaderboard';
import UniqueSubmittersLeaderboard from 'components/leaderboards/UniqueSubmittersLeaderboard';

export default class Authors extends Component {
  render() {
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
          <OriginalSubmittersLeaderboard />
          <UniqueSubmittersLeaderboard />
          <SubmittersLeaderboard />
          <AuthorsLeaderboard />
          <DomainsLeaderboard />
        </StyledMainWrapper>
      </Layout>
    );
  }
}
