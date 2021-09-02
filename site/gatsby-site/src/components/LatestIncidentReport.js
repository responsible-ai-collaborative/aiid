import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';
import md5 from 'md5';
import { format } from 'date-fns';
import { Image } from '../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';

const ThumbnailLink = styled(Link)`
  display: block;
  height: 300px;
  margin: 0 -2rem 0;
`;

const ThumbnailImg = styled(Image)`
  object-fit: cover;
  height: 100%;
  width: 100%;
`;

const TextContainer = styled.div`
  margin: 1rem auto 0;
  line-height: 1.7;
  flex: 1;
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
  padding-top: 0em;
  p {
    line-height: 1.5;
    margin-bottom: 0;
  }
`;

const Wrapper = styled.div`
  margin-top: -0.75em;
  padding: 0em 2em 1rem;
  @media (min-width: 991px) {
    display: flex;
    ${ThumbnailLink} {
      height: auto;
      margin: 0 1rem -1rem -2rem;
      justify-self: stretch;
      flex: 1;
      display: block;
      position: relative;
      ${ThumbnailImg} {
        position: absolute;
      }
    }
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
        const { image_url, cloudinary_id, title, description, epoch_date_submitted, incident_id } =
          nodes[0];

        return (
          <Wrapper>
            <ThumbnailLink to={`/cite/${incident_id}`}>
              <ThumbnailImg
                publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
                transformation={fill().height(480)}
                alt={title}
              />
            </ThumbnailLink>
            <TextContainer>
              <Link to={`/cite/${incident_id}`}>
                <Title>
                  <p>{title}</p>
                </Title>
              </Link>
              <SubmissionDate>
                <p>{format(epoch_date_submitted * 1000, 'MMM d, yyyy, h:mm aaaa')}</p>
              </SubmissionDate>
              <Description>
                <p>
                  {description}... <Link to={`/cite/${incident_id}`}>(Read More)</Link>
                </p>
              </Description>
            </TextContainer>
          </Wrapper>
        );
      }}
    />
  );
};

export default LatestIncidentReport;
