import React from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import Carousel from 'react-bootstrap/Carousel';

const Caption = styled.h3`
  background: rgba(0, 0, 0, 0.55);
`;

const SubCaption = styled.p`
  background: rgba(0, 0, 0, 0.55);
`;

/**
 * Get an image carousel of the report images along with their headlines.
 *
 * @param {nodes} The GraphQL nodes to render as a carousel.
 * @return {jsx} The HTML to render to the page.
 */
const ImageCarousel = ({ nodes }) => {
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
              <a
                href={value['node']['url']}
                className="text-white"
                target="_blank"
                rel="noopener noreferrer"
              >
                {value['node']['title']}
              </a>
            </Caption>
            <SubCaption>{value['node']['source_domain']}</SubCaption>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
