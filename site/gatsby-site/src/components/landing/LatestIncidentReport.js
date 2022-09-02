import React from 'react';
import md5 from 'md5';
import { format } from 'date-fns';
import { Image } from '../../utils/cloudinary';
import Link from 'components/ui/Link';
import ReportText from 'components/reports/ReportText';
import { Trans } from 'react-i18next';

const LatestIncidentReport = ({ report }) => {
  const { image_url, cloudinary_id, title, text, epoch_date_submitted, incident_id } = report;

  return (
    <div className="flex flex-col items-center bg-white rounded-lg border shadow-md md:flex-row md:max-w-3xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
      <Image
        className={
          'object-cover w-full h-96 rounded-t-lg md:h-auto md:w-48 md:rounded-none md:rounded-l-lg'
        }
        publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
        // transformation={fill().height(480)}
        alt={title}
      />
      <div className="flex flex-col justify-between p-4 leading-normal">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {format(epoch_date_submitted * 1000, 'MMM d, yyyy')}
        </span>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          <ReportText maxChars={240} text={text} />
        </p>
        <div className="flex justify-end">
          <Link
            to={`/cite/${incident_id}`}
            className="inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <Trans>Read More</Trans>
            <svg
              aria-hidden="true"
              className="ml-2 -mr-1 w-4 h-4"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              ></path>
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LatestIncidentReport;
