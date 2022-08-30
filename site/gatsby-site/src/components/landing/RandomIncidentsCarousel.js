import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import styled from 'styled-components';
import md5 from 'md5';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';

const Caption = styled.h3`
  background: rgba(0, 0, 0, 0.55);
`;

const CarouselImage = styled(Image)`
  height: 480px;
  object-fit: cover;
  width: 100%;
`;

const RandomIncidentsCarousel = ({ className }) => {
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
          allMongodbAiidprodIncidents {
            nodes {
              incident_id
              reports
            }
          }

          allMongodbAiidprodReports(limit: 50, sort: { order: ASC, fields: id }) {
            nodes {
              id
              report_number
              title
              image_url
            }
          }
        }
      `}
      render={({
        allMongodbAiidprodReports: { nodes: reports },
        allMongodbAiidprodIncidents: { nodes: incidents },
      }) => {
        const randomIncidents = reports
          .filter(
            (node, index) => randomArray.includes(index) && node.image_url !== 'placeholder.svg'
          )
          .map((report) => ({
            ...report,
            incident_id: incidents.find((incident) =>
              incident.reports.includes(report.report_number)
            ).incident_id,
          }));

        return (
          <div className="bootstrap">
            <Carousel interval={60000} className={className}>
              {randomIncidents.map(({ id, incident_id, title, image_url, cloudinary_id }) => (
                <Carousel.Item key={id}>
                  <Link to={`/cite/${incident_id}`}>
                    <CarouselImage
                      publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
                      alt={title}
                      transformation={fill().height(480)}
                      plugins={[]}
                    />
                    <Carousel.Caption>
                      <Caption>{title}</Caption>
                    </Carousel.Caption>
                  </Link>
                </Carousel.Item>
              ))}
            </Carousel>
          </div>
        );
      }}
    />
  );
};

export default RandomIncidentsCarousel;
