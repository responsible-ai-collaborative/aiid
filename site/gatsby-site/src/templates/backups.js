import React from 'react';
import Helmet from 'react-helmet';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';

const Backups = ({ pageContext, ...props }) => {
  const { backups } = pageContext;

  if (!backups) {
    return null;
  }

  return (
    <Layout {...props}>
      <Helmet>
        <title>Database Backups and Snapshots</title>
      </Helmet>
      <div className="titleWrapper">
        <StyledHeading>Database Snapshots</StyledHeading>
      </div>
      <StyledMainWrapper>
        <p className="paragraph">
          In many cases it is necessary to have an unchanging and shared version of the database
          (e.g., if you are doing natural language processing research). This page lists weekly
          snapshots of the database taken through time by the&nbsp;
          <Link to="https://github.com/aiincidentdatabase/mongodb-awesome-backup">
            GitHub backup workflow
          </Link>
          .
        </p>
        <Container>
          <Row>
            <Col xs={12}>
              <ul>
                {backups
                  .map((b) => ({
                    ...b,
                    Url: `https://s3.amazonaws.com/aiid-backups-public/${b.Key}`,
                  }))
                  .map((value) => (
                    <li key={`snapshot-${value['Key']}`}>
                      {value['LastModified']} &middot; {value['Size'] / 1000000} MB &middot;{' '}
                      <Link to={value['Url']}>{value['Key']}</Link>
                    </li>
                  ))}
              </ul>
            </Col>
          </Row>
        </Container>
      </StyledMainWrapper>
    </Layout>
  );
};

export default Backups;
