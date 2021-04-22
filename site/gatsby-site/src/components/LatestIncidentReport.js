import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';
import md5 from 'md5';
import { format } from 'date-fns';

const ThumbnailImg = styled.img`
  max-width: 300px;
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;

  @media (max-width: 800px) {
    flex-direction: column;
  }
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

const TextContainer = styled.div`
  padding-left: 1.5em;

  @media (max-width: 800px) {
    padding-left: 0;
    padding-top: 1.5em;
  }
`;

const Title = styled.div`
  p {
    font-size: 1.5em;
  }
`;

const SubmissionDate = styled.div`
  p {
    color: grey;
  }
`;

const Description = styled.div`
  padding-top: 1em;
  p {
    line-height: 1.5;
    margin-bottom: 0;
  }
`;

const LatestIncidentReport = () => {
  return (
    <StaticQuery
      query={graphql`
        query LatestIncidentReport {
          allMongodbAiidprodIncidents(
            sort: { order: DESC, fields: epoch_date_submitted }
            limit: 1
          ) {
            nodes {
              title
              epoch_date_submitted
              description
              image_url
              incident_id
            }
          }
        }
      `}
      render={({ allMongodbAiidprodIncidents: { nodes } }) => {
        const { image_url, title, description, epoch_date_submitted, incident_id } = nodes[0];

        return (
          <>
            <Row>
              <Link to={`/cite/${incident_id}`}>
                <ThumbnailImg
                  src={'https://incidentdatabase.ai/large_media/report_banners/' + md5(image_url)}
                  alt={title}
                />
              </Link>
              <TextContainer>
                <Column>
                  <Link to={`/cite/${incident_id}`}>
                    <Title>
                      <p>{title}</p>
                    </Title>
                  </Link>
                  <SubmissionDate>
                    <p>{format(epoch_date_submitted, 'MMM d, yyyy, h:mm aaaa')}</p>
                  </SubmissionDate>
                  <Description>
                    <p>{description}</p>
                  </Description>
                </Column>
              </TextContainer>
            </Row>
          </>
        );
      }}
    />
  );
};

export default LatestIncidentReport;
