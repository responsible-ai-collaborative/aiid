import React, { Component, useState } from 'react';
import Helmet from 'react-helmet';
import { graphql } from 'gatsby';
import styled from "styled-components"

import md5 from 'md5'
import uuid from 'react-uuid'
import Button from 'react-bootstrap/Button'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Modal from 'react-bootstrap/Modal'
import Carousel from 'react-bootstrap/Carousel'

import { Layout } from '$components';
import { StyledHeading, StyledMainWrapper } from '../components/styles/Docs';

import config from '../../config';
import { getFormattedName } from '../utils/typography';

const forcedNavOrder = config.sidebar.forcedNavOrder;

const GetCitation = ({ nodes }) => {

  let docs = [];
  nodes.forEach(({ node }) => docs.push(node));

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a["submission_date"] > b["submission_date"];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]["submitters"][0]);

  var incidentDate = docs[0]["incident_date"];
  var submissionDate = docs[0]["submission_date"];
  const jsx = <>
    {submitterCite}. ({incidentDate}) Incident Number {docs[0]['incident_id']}. in McGregor, S. (ed.){' '}
    <em>Artificial Intelligence Incident Database.</em> Partnership on AI.
  </>
  return jsx;
}

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
    color: white !important;;
    `;
  const SubCaption = styled.p`
    background: rgba(0, 0, 0, 0.55);
    `;

  return <Carousel interval={60000}>
      {nodes.map((value, index) => (
        <Carousel.Item key={index}>
          <img
            className="d-block w-100"
            src={"https://incidentdatabase.ai/large_media/report_banners/" + md5(value["node"]["image_url"])}
            alt={value["node"]["title"]}
          />
          <Carousel.Caption>
            <Caption>
              <Link href={value["node"]["url"]} target="_blank">{value["node"]["title"]}</Link>
            </Caption>
            <SubCaption>{value["node"]["source_domain"]}</SubCaption>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
  </Carousel>
}

function BibTex({ nodes }) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  let docs = [];
  nodes.forEach(({ node }) => docs.push(node));

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a["submission_date"] > b["submission_date"];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]["submitters"][0]);

  var incidentDate = docs[0]["incident_date"];
  var submissionDate = docs[0]["submission_date"];
  var incidentID = docs[0]["incident_id"];

  const jsx = (
    <>
      @article&#123;aiid:{docs[0]['incident_id']},
      author = &#123;{submitterCite}&#125;,
      editor = &#123;McGregor, Sean&#125;,
      journal = &#123;AI Incident Database&#125;,
      publisher = &#123;Partnership on AI&#125;,
      title = &#123;Incident Number {docs[0]['incident_id']}&#125;,
      url = &#123;https://incidentdatabase.ai/cite/{incidentID}&#125;,
      year = &#123;{incidentDate.substring(0, 4)}&#125;
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
      {items.map((value, index) => (
        <li key={uuid()}>{value["node"]["date_published"]} <a href={value["node"]["url"]}>{value["node"]["title"]}</a></li>
      ))}
    </ul>
  );
};

const IncidentList = ({ group }) => {
  return (<>
    {group.map((value, index) => (
      <div key={uuid()}>
        <ReportList key={uuid()} items={value["edges"]} />
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
      allMdx,
      allMongodbAiidprodIncidents: {
        group
      },
      site: {
        siteMetadata: { docsLocation, title },
      },
    } = data;

    const gitHub = require('../components/images/github.svg');

    const navItems = allMdx.edges
      .map(({ node }) => node.fields.slug)
      .filter(slug => slug !== '/')
      .sort()
      .reduce(
        (acc, cur) => {
          if (forcedNavOrder.find(url => url === cur)) {
            return { ...acc, [cur]: [cur] };
          }

          let prefix = cur.split('/')[1];

          if (config.gatsby && config.gatsby.trailingSlash) {
            prefix = prefix + '/';
          }

          if (prefix && forcedNavOrder.find(url => url === `/${prefix}`)) {
            return { ...acc, [`/${prefix}`]: [...acc[`/${prefix}`], cur] };
          } else {
            return { ...acc, items: [...acc.items, cur] };
          }
        },
        { items: [] }
      );

    const nav = forcedNavOrder
      .reduce((acc, cur) => {
        return acc.concat(navItems[cur]);
      }, [])
      .concat(navItems.items)
      .map(slug => {
        if (slug) {
          const { node } = allMdx.edges.find(({ node }) => node.fields.slug === slug);

          return { title: node.fields.title, url: node.fields.slug };
        }
      });

    // meta tags
    const reports = group[0]["edges"];
    const incident_id = reports[0]["node"]["incident_id"];
    const metaTitle = "Incident " + incident_id;
    const metaDescription = "Citation record for Incident " + incident_id;

    let canonicalUrl = config.gatsby.siteUrl;

    canonicalUrl =
      config.gatsby.pathPrefix !== '/' ? canonicalUrl + config.gatsby.pathPrefix : canonicalUrl;
    canonicalUrl = canonicalUrl + "/cite/" + incident_id;

    const nodes = group[0]["edges"];

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
                <h2>
                  Suggested citation format
                </h2>
                <GetCitation nodes={nodes} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h2>
                  Reports
                </h2>
                <IncidentList group={group} />
                <GetImageCarousel nodes={nodes} />
              </Col>
            </Row>
            <Row>
              <Col>
                <h1>Tools</h1>
                <Button variant="outline-primary" href={"/summaries/incidents"}>All Incidents</Button>
                <Button variant="outline-primary" href={"/discover/index.html?incident_id=" + incident_id}>Discover</Button>
                <BibTex nodes={nodes} />
              </Col>
            </Row>
          </Container>
        </StyledMainWrapper>
      </Layout>
    );
  }
}

export const pageQuery = graphql`
  query ($incident_id: Int!) {
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
    allMongodbAiidprodIncidents(filter: {incident_id: {eq: $incident_id}}) {
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
