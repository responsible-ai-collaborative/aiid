import React from 'react';
import LatestIncidentReport from 'components/landing/LatestIncidentReport';
import { Carousel } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleLeft, faArrowCircleRight } from '@fortawesome/free-solid-svg-icons';

export default function LatestReports({ latestReports }) {
  return (
    <>
      <div className="flex flex-col items-center">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900  dark:text-white w-full p-6 hover:text-primary-blue">
          <Trans ns="landing">Latest Incident Reports</Trans>
        </h5>
        <Carousel
          className="latest-reports-carousel"
          slide={false}
          slideInterval={5000}
          leftControl={
            <FontAwesomeIcon icon={faArrowCircleLeft} className="h-8 w-8 text-gray-800" />
          }
          rightControl={
            <FontAwesomeIcon icon={faArrowCircleRight} className="h-8 w-8 text-gray-800" />
          }
        >
          {latestReports.map((report) => (
            <LatestIncidentReport report={report} key={`latest-report-${report.title}`} />
          ))}
        </Carousel>
      </div>
    </>
  );
}
