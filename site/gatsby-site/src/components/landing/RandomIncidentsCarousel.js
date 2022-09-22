import React from 'react';
import { StaticQuery, graphql, Link } from 'gatsby';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { Carousel } from 'flowbite-react';

const RandomIncidentsCarousel = () => {
  const generateRandomIncidents = () => {
    const array = [];

    for (let index = 0; index < 5; index++) {
      array.push(Math.floor(Math.random() * 50 + 1));
    }

    return array;
  };

  const randomArray = generateRandomIncidents();

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
            }
          }
        }
      `}
      render={({
        allMongodbAiidprodReports: { nodes: reports },
        allMongodbAiidprodIncidents: { nodes: incidents },
      }) => {
        const randomIncidents = reports
          .filter(
            (node, index) => randomArray.includes(index) && node.image_url !== 'placeholder.svg'
          )
          .map((report) => ({
            ...report,
            ...incidents.find((incident) => incident.reports.includes(report.report_number)),
          }));

        return (
          <div className="flex-1 flex justify-center items-center">
            <div className="h-56 sm:h-64 xl:h-80 2xl:h-96 w-full">
              <Carousel slideInterval={6000} slide={false}>
                {randomIncidents.map(({ id, incident_id, title, image_url, cloudinary_id }) => (
                  <Link to={`/cite/${incident_id}`} key={id} className="h-full">
                    <h5 className="text-sm sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                      {title}
                    </h5>
                    <Image
                      publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
                      alt={title}
                      transformation={fill().height(480)}
                      plugins={[]}
                    />
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
