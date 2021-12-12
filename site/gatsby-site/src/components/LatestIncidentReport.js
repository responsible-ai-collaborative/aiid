import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';
import md5 from 'md5';
import { format } from 'date-fns';
import { Image } from '../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { Card, Col, Row } from 'react-bootstrap';

const ThumbnailImg = styled(Image)`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const LatestIncidentReport = ({ className = '' }) => {
  return (
    <StaticQuery
      query={graphql`
        query LatestIncidentReport {
          allMongodbAiidprodIncidents(
            sort: { order: DESC, fields: epoch_incident_date }
            limit: 1
          ) {
            nodes {
              title
              epoch_incident_date
              description
              image_url
              incident_id
              cloudinary_id
            }
          }
        }
      `}
      render={({ allMongodbAiidprodIncidents: { nodes } }) => {
        const { image_url, cloudinary_id, title, description, epoch_incident_date, incident_id } =
          nodes[0];

        return (
          <Card className={className}>
            <Row className="g-0">
              <Col md={4}>
                <ThumbnailImg
                  publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
                  transformation={fill().height(480)}
                  alt={title}
                />
              </Col>
              <Col md={8}>
                <Card.Body>
                  <Card.Title>
                    <Link to={`/cite/${incident_id}`}>{title}</Link>
                  </Card.Title>
                  <Card.Subtitle>{format(epoch_incident_date * 1000, 'MMM d, yyyy')}</Card.Subtitle>
                  <Card.Text>
                    {description}... <Link to={`/cite/${incident_id}`}>(Read More)</Link>
                  </Card.Text>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        );
      }}
    />
  );
};

export default LatestIncidentReport;
