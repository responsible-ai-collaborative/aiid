import React, { useState } from 'react';
import { Link } from 'gatsby';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { Carousel, Spinner } from 'flowbite-react';
import { gql, useQuery } from '@apollo/client';

const RandomIncidentsCarousel = () => {
  const [randomIncidentIds] = useState(
    Array(5)
      .fill(0)
      .map(() => Math.floor(Math.random() * 300))
  );

  const { loading: incidentsLoading, data: incidentsData } = useQuery(
    gql`
      query CarouselIncidents($query: IncidentQueryInput!) {
        incidents(query: $query) {
          incident_id
          title
          reports {
            report_number
            title
            cloudinary_id
            image_url
          }
        }
      }
    `,
    { variables: { query: { incident_id_in: randomIncidentIds } } }
  );

  const randomIncidents =
    (incidentsData?.incidents &&
      incidentsData?.incidents.reduce(
        (reports, incident) =>
          reports.concat([
            {
              ...incident.reports[0],
              incident_id: incident.incident_id,
              title: incident.title || reports[0].title,
            },
          ]),
        []
      )) ||
    [];

  return (
    <div className="flex-1 flex justify-center items-center">
      <div className="h-full w-full relative">
        <div className="absolute h-3 inset-x-0 top-0 bg-white filler z-50 block w-50">
          {/* The carousel insists on using rounded corners, *
           * so we have to cover them up on top.            */}
        </div>
        {incidentsLoading && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        )}
        <Carousel slideInterval={6000} slide={false}>
          {randomIncidents.map(({ incident_id, title, image_url, cloudinary_id }) => (
            <Link to={`/cite/${incident_id}`} key={incident_id} className="block h-full relative">
              <Image
                publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
                alt={title}
                transformation={fill().height(800).width(1000)}
                plugins={[]}
                className="w-full h-full"
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
};

export default RandomIncidentsCarousel;
