import React, { Component, useState } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import styled from 'styled-components';

import md5 from 'md5';
import uuid from 'react-uuid';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Modal from 'react-bootstrap/Modal';
import Carousel from 'react-bootstrap/Carousel';

import { Layout } from '@components';
import { StyledHeading, StyledMainWrapper } from '../components/styles/Docs';

import config from '../../config';
import { getFormattedName } from '../utils/typography';

/**
 * Get the month name, day, and year that the citation is
 * being referenced.
 *
 * @return {string} The month, day, and year as a string.
 */
const retrievalDate = () => {
  const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  const today = new Date();

  const dd = String(today.getDate());

  const month = monthNames[today.getMonth()];

  const yyyy = today.getFullYear();

  return `${month} ${dd}, ${yyyy}`;
};

const GetCitation = ({ nodes, incident_id }) => {
  let docs = [];

  nodes.forEach(({ node }) => docs.push(node));

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a['submission_date'] > b['submission_date'];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]['submitters'][0]);

  const retrievalString = `Retrieved on ${retrievalDate()} from incidentdatabase.ai/cite/${incident_id}.`;

  var incidentDate = docs[0]['incident_date'];

  const jsx = (
    <>
      {submitterCite}. ({incidentDate}) Incident Number {docs[0]['incident_id']}. in McGregor, S.
      (ed.) <em>Artificial Intelligence Incident Database.</em> Partnership on AI. {retrievalString}
    </>
  );

  return jsx;
};

/**
 * Get an image carousel of the report images along with their headlines.
 *
 * @param {nodes} The GraphQL nodes to render as a carousel.
 * @return {jsx} The HTML to render to the page.
 */
const GetImageCarousel = ({ nodes }) => {
  const Caption = styled.h3`
    background: rgba(0, 0, 0, 0.55);
  `;

  const Link = styled.a`
    color: white !important;
  `;

  const SubCaption = styled.p`
    background: rgba(0, 0, 0, 0.55);
  `;

  return (
    <Carousel interval={60000}>
      {nodes.map((value, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={
              'https://incidentdatabase.ai/large_media/report_banners/' +
              md5(value['node']['image_url'])
            }
            alt={value['node']['title']}
          />
          <Carousel.Caption>
            <Caption>
              <Link href={value['node']['url']} target="_blank">
                {value['node']['title']}
              </Link>
            </Caption>
            <SubCaption>{value['node']['source_domain']}</SubCaption>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

function BibTex({ nodes, incident_id }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  let docs = [];

  nodes.forEach(({ node }) => docs.push(node));

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a['submission_date'] > b['submission_date'];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]['submitters'][0]);

  var incidentDate = docs[0]['incident_date'];

  const jsx = (
    <>
      @article&#123;aiid:{docs[0]['incident_id']},
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; author = &#123;{submitterCite}&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; editor = &#123;McGregor, Sean&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; journal = &#123;AI Incident Database&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; publisher = &#123;Partnership on AI&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; title = &#123;Incident Number {incident_id}&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; url = &#123;https://incidentdatabase.ai/cite/{incident_id}&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; year = &#123;{incidentDate.substring(0, 4)}&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; urldate = &#123;{retrievalDate()}&#125;
      <br />
      &#125;
    </>
  );

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        BibTex Citation
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>BibTex Citation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{jsx}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

const ReportList = ({ items }) => {
  return (
    <ul>
      {items.map((value) => (
        <li key={uuid()}>
          {value['node']['date_published']}{' '}
          <a href={value['node']['url']}>{value['node']['title']}</a>
        </li>
      ))}
    </ul>
  );
};

const IncidentList = ({ group }) => {
  return (
    <>
      {group.map((value) => (
        <div key={uuid()}>
          <ReportList key={uuid()} items={value['edges']} />
        </div>
      ))}
    </>
  );
};

export default class IncidentCite extends Component {
  render() {
    const { data } = this.props;

    if (!data) {
      return null;
    }
    const {
      allMongodbAiidprodIncidents: { group },
    } = data;

    // meta tags
    const reports = group[0]['edges'];

    const incident_id = reports[0]['node']['incident_id'];

    const metaTitle = 'Incident ' + incident_id;

    const metaDescription = 'Citation record for Incident ' + incident_id;

    let canonicalUrl = config.gatsby.siteUrl;

    canonicalUrl =
      config.gatsby.pathPrefix !== '/' ? canonicalUrl + config.gatsby.pathPrefix : canonicalUrl;
    canonicalUrl = canonicalUrl + '/cite/' + incident_id;

    const nodes = group[0]['edges'];

    return (
      <Layout {...this.props}>
        <Helmet>
          {metaTitle ? <title>{metaTitle}</title> : null}
          {metaTitle ? <meta name="title" content={metaTitle} /> : null}
          {metaDescription ? <meta name="description" content={metaDescription} /> : null}
          {metaTitle ? <meta property="og:title" content={metaTitle} /> : null}
          {metaDescription ? <meta property="og:description" content={metaDescription} /> : null}
          {metaTitle ? <meta property="twitter:title" content={metaTitle} /> : null}
          {metaDescription ? (
            <meta property="twitter:description" content={metaDescription} />
          ) : null}
          <link rel="canonical" href={canonicalUrl} />
        </Helmet>
        <div className={'titleWrapper'}>
          <StyledHeading>{metaDescription}</StyledHeading>
        </div>
        <StyledMainWrapper>
          <Container>
            <Row>
              <Col>
                <h2>Suggested citation format</h2>
                <GetCitation nodes={nodes} incident_id={incident_id} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>Reports</h2>
                <IncidentList group={group} />
                <GetImageCarousel nodes={nodes} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h1>Tools</h1>
                <Button variant="outline-primary" href={'/summaries/incidents'}>
                  All Incidents
                </Button>
                <Button
                  variant="outline-primary"
                  href={'/discover/index.html?incident_id=' + incident_id}
                >
                  Discover
                </Button>
                <BibTex nodes={nodes} incident_id={incident_id} />
              </Col>
            </Row>
          </Container>
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query($incident_id: Int!) {
    site {
      siteMetadata {
        title
        docsLocation
      }
    }
    allMdx {
      edges {
        node {
          fields {
            slug
            title
          }
        }
      }
    }
    allMongodbAiidprodIncidents(filter: { incident_id: { eq: $incident_id } }) {
      group(field: incident_id) {
        edges {
          node {
            id
            submitters
            incident_date
            date_published
            incident_id
            report_number
            title
            url
            image_url
            source_domain
          }
        }
      }
    }
  }
`;
