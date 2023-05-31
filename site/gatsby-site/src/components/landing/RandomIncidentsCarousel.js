import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { Carousel } from 'flowbite-react';
import { useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

const RandomIncidentsCarousel = () => {
  return (
    <StaticQuery
      query={graphql`
        query RandomIncidentsCarousel {
          allMongodbAiidprodIncidents {
            nodes {
              incident_id
              reports
              title
            }
          }
          allMongodbAiidprodReports(limit: 50, sort: { id: ASC }) {
            nodes {
              id
              report_number
              image_url
              cloudinary_id
            }
          }
        }
      `}
      render={({
        allMongodbAiidprodReports: { nodes: reports },
        allMongodbAiidprodIncidents: { nodes: incidents },
      }) => {
        // this cannot be really random because it causes rehydration problems

        const { t } = useTranslation();

        const selected = [];

        for (let i = 0; i < reports.length && selected.length < 5; i++) {
          const report = reports[i];

          const incident = incidents.find((incident) =>
            incident.reports.includes(report.report_number)
          );

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
                slideInterval={6000}
                slide={false}
                leftControl={
                  <FontAwesomeIcon
                    icon={faArrowCircleLeft}
                    className="h-8 w-8 text-white bg-gray-500 shadow rounded-full"
                  />
                }
                rightControl={
                  <FontAwesomeIcon
                    icon={faArrowCircleRight}
                    className="h-8 w-8 text-white bg-gray-500 shadow rounded-full"
                  />
                }
              >
                {selected.map(({ incident_id, title, image_url, cloudinary_id }) => (
                  <Link
                    to={`/cite/${incident_id}`}
                    key={incident_id}
                    className="block h-full relative"
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
