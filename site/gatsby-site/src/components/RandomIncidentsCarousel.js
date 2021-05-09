import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';
import md5 from 'md5';
import Carousel from 'react-bootstrap/Carousel';

const Caption = styled.h3`
  background: rgba(0, 0, 0, 0.55);
`;

const Container = styled.div`
  border: 1.5px solid #d9deee;
  border-radius: 5px;
  box-shadow: 0 2px 5px 0px #e3e5ec;
  display: flex;
  flex-direction: column;
  h4 {
    margin: 0 !important;
  }
`;

const Img = styled.img`
  max-height: 500px;
`;

const RandomIncidentsCarousel = () => {
  const generateRandomIncidents = () => {
    const array = [];

    for (let index = 0; index < 5; index++) {
      array.push(Math.floor(Math.random() * 50 + 1));
    }

    return array;
  };

  const randomArray = generateRandomIncidents();

  return (
    <StaticQuery
      query={graphql`
        query RandomIncidentsCarousel {
          allMongodbAiidprodIncidents(limit: 50, sort: { order: ASC, fields: id }) {
            edges {
              node {
                id
                incident_id
                title
                image_url
              }
            }
          }
        }
      `}
      render={({ allMongodbAiidprodIncidents: { edges } }) => {
        const randomIncidents = edges.filter(
          (node, index) => randomArray.includes(index) && node.image_url !== 'placeholder.svg'
        );

        return (
          <Container>
            <Carousel interval={60000}>
              {randomIncidents.map(({ node: { id, incident_id, title, image_url } }) => (
                <Carousel.Item key={id}>
                  <Link to={`/cite/${incident_id}`}>
                    <Img
                      className="d-block w-100"
                      src={
                        'https://incidentdatabase.ai/large_media/report_banners/' + md5(image_url)
                      }
                      alt={title}
                    />
                    <Carousel.Caption>
                      <Caption>{title}</Caption>
                    </Carousel.Caption>
                  </Link>
                </Carousel.Item>
              ))}
            </Carousel>
          </Container>
        );
      }}
    />
  );
};

export default RandomIncidentsCarousel;
