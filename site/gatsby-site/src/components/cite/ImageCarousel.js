import React from 'react';
import md5 from 'md5';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
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
          <Image
            className="tw-h-[640px] tw-object-cover tw-w-full"
            publicID={value.cloudinary_id ? value.cloudinary_id : `legacy/${md5(value.image_url)}`}
            alt={value.title}
            transformation={fill().height(640)}
            plugins={[]}
          />
          <Carousel.Caption>
            <h3 className="tw-bg-0-0-0-055">
              <a href={value.url} className="text-white" target="_blank" rel="noopener noreferrer">
                {value.title}
              </a>
            </h3>
            <p className="tw-bg-0-0-0-055">{value.source_domain}</p>
          </Carousel.Caption>
        </Carousel.Item>
      ))}
    </Carousel>
  );
};

export default ImageCarousel;
