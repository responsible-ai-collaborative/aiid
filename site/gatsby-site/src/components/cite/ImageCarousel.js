import React from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';

const Caption = styled.h3`
  background: rgba(0, 0, 0, 0.55);
`;

const SubCaption = styled.p`
  background: rgba(0, 0, 0, 0.55);
`;

const CarouselImage = styled(Image)`
  height: 640px;
  object-fit: cover;
  width: 100%;
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
          <CarouselImage
            publicID={value.cloudinary_id ? value.cloudinary_id : `legacy/${md5(value.image_url)}`}
            alt={value.title}
            transformation={fill().height(640)}
            plugins={[]}
          />
          <Carousel.Caption>
            <Caption>
              <a href={value.url} className="text-white" target="_blank" rel="noopener noreferrer">
                {value.title}
              </a>
            </Caption>
            <SubCaption>{value.source_domain}</SubCaption>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
