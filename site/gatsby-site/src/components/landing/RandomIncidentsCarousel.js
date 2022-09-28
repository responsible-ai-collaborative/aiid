import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { Carousel } from 'flowbite-react';

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
          allMongodbAiidprodReports(limit: 50, sort: { order: ASC, fields: id }) {
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
        const randomIncidents = [];

        while (randomIncidents.length < 5) {
          const incident = incidents.splice(Math.floor(Math.random() * incidents.length), 1)[0];

          const reportWithImage = reports.find(
            (report) => incident.reports.includes(report.report_number) && report.cloudinary_id
          );

          if (reportWithImage) {
            randomIncidents.push({
              ...reportWithImage,
              incident_id: incident.incident_id,
              title: incident.title || reportWithImage.title,
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
              <Carousel slideInterval={6000} slide={false}>
                {randomIncidents.map(({ incident_id, title, image_url, cloudinary_id }) => (
                  <Link
                    to={`/cite/${incident_id}`}
                    key={incident_id}
                    className="block h-full relative"
                  >
                    <Image
                      publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
                      alt={title}
                      transformation={fill().height(800).width(1000)}
                      plugins={[]}
                      className="w-full h-full object-cover"
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
