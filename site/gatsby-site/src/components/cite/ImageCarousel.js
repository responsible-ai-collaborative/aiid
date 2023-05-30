import React from 'react';
import md5 from 'md5';
import { fill } from '@cloudinary/base/actions/resize';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'flowbite-react';
import { Image } from 'utils/cloudinary';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

/**
 * Get an image carousel of the report images along with their headlines.
 *
 * @param {nodes} The GraphQL nodes to render as a carousel.
 * @return {jsx} The HTML to render to the page.
 */
const ImageCarousel = ({ nodes }) => {
  const shouldNavigate = nodes.length > 1;

  return (
    <Carousel
      slideInterval={6000}
      slide={false}
      indicators={shouldNavigate}
      leftControl={
        shouldNavigate ? (
          <FontAwesomeIcon
            icon={faArrowCircleLeft}
            className="h-8 w-8 text-white bg-gray-500 shadow rounded-full"
          />
        ) : (
          <></>
        )
      }
      rightControl={
        shouldNavigate ? (
          <FontAwesomeIcon
            icon={faArrowCircleRight}
            className="h-8 w-8 text-white bg-gray-500 shadow rounded-full"
          />
        ) : (
          <></>
        )
      }
    >
      {nodes.map((value, index) => {
        return (
          <div className="relative" key={`report-carousel-item-${index}`}>
            <CloudinaryImage {...value} />
            <div className="absolute bottom-10 flex flex-col justify-center items-center px-10 w-full">
              <h3 className="bg-black/50 px-1 rounded text-center">
                <a
                  href={value.url}
                  className="text-white"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {value.title}
                </a>
              </h3>
              <p className="bg-black/50 m-0 text-white px-1 rounded text-center">
                {value.source_domain}
              </p>
            </div>
          </div>
        );
      })}
    </Carousel>
  );
};

const CloudinaryImage = (value) => {
  const { t } = useTranslation();

  return (
    <>
      <Image
        className="h-[320px] object-cover w-full"
        publicID={value.cloudinary_id ? value.cloudinary_id : `legacy/${md5(value.image_url)}`}
        alt={value.title}
        transformation={fill().height(640)}
        plugins={[]}
        itemIdentifier={t('Report {{report_number}}', {
          report_number: value.report_number,
        }).replace(' ', '.')}
      />
    </>
  );
};

export default ImageCarousel;
