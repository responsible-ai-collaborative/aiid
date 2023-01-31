import React from 'react';
import AiidHelmet from 'components/AiidHelmet';

import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

import Layout from 'components/Layout';
import Link from 'components/ui/Link';
import { StyledHeading, StyledMainWrapper } from 'components/styles/Docs';
import { LocalizedLink } from 'gatsby-theme-i18n';

const Backups = ({ pageContext, ...props }) => {
  const { backups } = pageContext;

  if (!backups) {
    return null;
  }

  return (
    <Layout {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>Database Backups and Snapshots</title>
      </AiidHelmet>
      <div className="titleWrapper">
        <StyledHeading>Database Snapshots</StyledHeading>
      </div>
      <StyledMainWrapper>
        <h2>Citing the Database as a Whole</h2>
        <p>We invite you to cite:</p>
        <blockquote>
          McGregor, S. (2021) Preventing Repeated Real World AI Failures by Cataloging Incidents:
          The AI Incident Database. In Proceedings of the Thirty-Third Annual Conference on
          Innovative Applications of Artificial Intelligence (IAAI-21). Virtual Conference.
        </blockquote>
        <p>
          The <a href="https://arxiv.org/abs/2011.08512">pre-print</a> is available on arXiv
        </p>
        <h2>Citing a Specific Incident</h2>
        <p>
          Every incident has its own suggested citation that credits both the submitter(s) of the
          incident and the editor(s) of the incident. The submitters are the people that submitted
          reports associated with the incident and their names are listed in the order in which
          their submissions were added to the AIID. Since reports can be added to an incident record
          through time, our suggested citation format includes the access date. You can find
          incident citations at <code>https://incidentdatabase.ai/cite/INSERT_NUMBER_HERE</code>.
        </p>
        <p className="paragraph">
          In many cases it is necessary to have an unchanging and shared version of the database
          This page lists weekly snapshots of the database in JSON, MongoDB, and CSV format taken
          through time by the{' '}
          <a href="https://github.com/aiincidentdatabase/mongodb-awesome-backup">
            GitHub backup workflow
          </a>
          . We maintain these snapshots so you can create stable datasets for natural language
          processing research and academic analysis. Please{' '}
          <LocalizedLink to="/contact">contact us</LocalizedLink> to let us know what you are using
          the database for so we can list your work in the incident database and ensure your use
          case is not dropped from support.
        </p>
        <h2>Download</h2>
        <Container>
          <Row>
            <Col xs={12}>
              <ul className="pl-8 leading-6">
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
