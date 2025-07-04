import React from 'react';
import md5 from 'md5';
import { fill } from '@cloudinary/base/actions/resize';
import { useTranslation } from 'react-i18next';
import { Carousel } from 'flowbite-react';
import { Image } from 'utils/cloudinary';
import { CarouselLeftArrow, CarouselRightArrow } from 'elements/Carousel';

/**
 * Get an image carousel of the report images along with their headlines.
 *
 * @param {nodes} The GraphQL nodes to render as a carousel.
 * @return {jsx} The HTML to render to the page.
 */
const ImageCarousel = ({ nodes }) => {
  const { t } = useTranslation();

  const shouldNavigate = nodes.length > 1;

  return (
    <Carousel
      slideInterval={6000}
      slide={false}
      indicators={shouldNavigate}
      leftControl={shouldNavigate ? <CarouselLeftArrow /> : <></>}
      rightControl={shouldNavigate ? <CarouselRightArrow /> : <></>}
    >
      {nodes.map((value, index) => {
        const itemIdentifier = t('Report {{report_number}}', {
          report_number: value.report_number,
        }).replace(/\s+/g, '.');

        return (
          <div className="relative" key={`report-carousel-item-${index}`}>
            <CloudinaryImage {...value} itemIdentifier={itemIdentifier} />
            <div className="absolute bottom-10 flex flex-col justify-center items-center px-10 w-full">
              <h3 className="bg-black/50 px-1 rounded text-center">
                <a
                  href={value.url}
                  className="text-white hover:no-underline"
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
  let publicID;

  if (value.cloudinary_id) {
    publicID = value.cloudinary_id;
  } else if (value.image_url) {
    publicID = `legacy/${md5(value.image_url)}`;
  } else {
    publicID = 'legacy/placeholder';
  }

  return (
    <Image
      className="h-[320px] object-cover w-full"
      publicID={publicID}
      alt={value.title || 'Image'}
      transformation={fill().height(640)}
      plugins={[]}
      itemIdentifier={value.itemIdentifier}
    />
  );
};

export default ImageCarousel;
