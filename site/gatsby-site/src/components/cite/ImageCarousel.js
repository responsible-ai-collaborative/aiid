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
            publicID={
              value.node.cloudinary_id
                ? value.node.cloudinary_id
                : `legacy/${md5(value.node.image_url)}`
            }
            alt={value.node.title}
            transformation={fill().height(640)}
            plugins={[]}
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
