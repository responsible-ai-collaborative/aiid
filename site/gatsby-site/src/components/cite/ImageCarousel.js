import React from 'react';
import md5 from 'md5';
import Carousel from 'react-bootstrap/Carousel';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { useTranslation } from 'react-i18next';

/**
 * Get an image carousel of the report images along with their headlines.
 *
 * @param {nodes} The GraphQL nodes to render as a carousel.
 * @return {jsx} The HTML to render to the page.
 */
const ImageCarousel = ({ nodes }) => {
  const { t } = useTranslation();

  return (
    <div className="bootstrap">
      <Carousel interval={60000}>
        {nodes.map((value, index) => (
          <Carousel.Item key={index}>
            <Image
              className="h-[640px] object-cover w-full"
              publicID={
                value.cloudinary_id ? value.cloudinary_id : `legacy/${md5(value.image_url)}`
              }
              alt={value.title}
              transformation={fill().height(640)}
              plugins={[]}
              itemIdentifier={t('Report {{report_number}}', {
                report_number: value.report_number,
              }).replace(' ', '.')}
            />
            <Carousel.Caption>
              <h3 className="bg-0-0-0-055">
                <a
                  href={value.url}
                  className="text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {value.title}
                </a>
              </h3>
              <p className="bg-0-0-0-055">{value.source_domain}</p>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
};

export default ImageCarousel;
