import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { Carousel } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { CarouselLeftArrow, CarouselRightArrow } from 'elements/Carousel';

const RandomIncidentsCarousel = () => {
  return (
    <StaticQuery
      query={graphql`
        query RandomIncidentsCarousel {
          allMongodbAiidprodIncidents(sort: { reports: { report_number: ASC } }) {
            nodes {
              incident_id
              reports {
                id
                report_number
                image_url
                cloudinary_id
              }
              title
            }
          }
        }
      `}
      render={({ allMongodbAiidprodIncidents: { nodes: incidents } }) => {
        // this cannot be really random because it causes rehydration problems

        const { t } = useTranslation();

        const selected = [];

        const reports = incidents
          .flatMap((incident) => incident.reports)
          .sort((a, b) => a.id.localeCompare(b.id))
          .slice(0, 50);

        for (let i = 0; i < reports.length && selected.length < 5; i++) {
          const report = reports[i];

          const incident = incidents.find((incident) => {
            return incident.reports.some((r) => r.report_number === report.report_number);
          });

          if (!selected.some((s) => s.incident_id == incident.incident_id)) {
            selected.push({
              ...report,
              incident_id: incident.incident_id,
              title: incident.title || report.title,
            });
          }
        }
        return (
          <div className="flex-1 flex justify-center items-center">
            <div className="h-full w-full relative">
              <div className="absolute h-3 inset-x-0 top-0 bg-white filler z-50 block w-50">
                {/* The carousel insists on using rounded corners, *
                 * so we have to cover them up on top.            */}
              </div>
              <Carousel
                data-cy="random-incidents-carousel"
                slideInterval={6000}
                slide={false}
                leftControl={<CarouselLeftArrow />}
                rightControl={<CarouselRightArrow />}
              >
                {selected.map(({ incident_id, title, image_url, cloudinary_id }) => (
                  <Link
                    to={`/cite/${incident_id}`}
                    key={incident_id}
                    className="block h-full relative"
                    data-cy="random-incidents-carousel-item"
                  >
                    <Image
                      publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
                      alt={title}
                      transformation={fill().height(800).width(1000)}
                      className="w-full h-full object-cover"
                      itemIdentifier={t('Incident {{id}}', { id: incident_id }).replace(' ', '.')}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <h5
                        className="
                      text-sm sm:text-lg 
                      font-bold 
                      tracking-tight 
                      text-gray-900 dark:text-white 
                      w-1/2
                      backdrop-blur-md
                      p-6
                      rounded-md
                      bg-white/50
                      top-0
                      inset-x-0
                      shadow-lg
                    "
                      >
                        {title}
                      </h5>
                    </div>
                  </Link>
                ))}
              </Carousel>
            </div>
          </div>
        );
      }}
    />
  );
};

export default RandomIncidentsCarousel;
