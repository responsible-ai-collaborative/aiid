import React from 'react';
import LatestIncidentReport from 'components/landing/LatestIncidentReport';
import { Carousel } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

export default function LatestReports({ latestIncidents }) {
  return (
    <>
      <Carousel
        className="latest-reports-carousel"
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
        {latestIncidents.map((incident, index) => (
          <LatestIncidentReport
            isLatest={index === 0}
            key={`latest-report-${incident.reports[0].title}`}
            {...{ incident }}
          />
        ))}
      </Carousel>
    </>
  );
}
