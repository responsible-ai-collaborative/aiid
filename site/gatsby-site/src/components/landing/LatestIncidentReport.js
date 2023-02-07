import React, { useState, useEffect } from 'react';
import md5 from 'md5';
import { format } from 'date-fns';
import { Image } from '../../utils/cloudinary';
import Link from 'components/ui/Link';
import ReportText from 'components/reports/ReportText';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';

const LatestIncidentReport = ({ report }) => {
  const { image_url, cloudinary_id, title, text, epoch_date_submitted, incident_id } = report;

  const { t } = useTranslation();

  const [formattedDate, setFormattedDate] = useState(null);

  useEffect(() => setFormattedDate(format(epoch_date_submitted * 1000, 'MMM d, yyyy')), []);

  return (
    <div className="flex flex-col items-center bg-white rounded-lg border  shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800">
      <div className="flex self-stretch justify-center items-center md:border-r md:max-w-sm">
        <LocalizedLink to={`/cite/${incident_id}`} className="text-primary-blue max-w-full h-full">
          <Image
            className={
              'img-fluid rounded-start h-full w-full max-w-full rounded-t-lg md:rounded-l-lg md:rounded-r-none border-r object-cover'
            }
            publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
            alt={title}
            itemIdentifier={t('Incident {{id}}', { id: incident_id }).replace(' ', '.')}
          />
        </LocalizedLink>
      </div>
      <div className="flex flex-col justify-between leading-normal">
        <LocalizedLink to={`/cite/${incident_id}`} className="max-w-full cursor-pointer">
          <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white w-full p-6 hover:text-primary-blue">
            <Trans ns="landing">Latest Incident Report</Trans>
          </h5>
        </LocalizedLink>
        <div className="px-6 pb-6">
          <LocalizedLink to={`/cite/${incident_id}`} className="max-w-full cursor-pointer">
            <h5 className="text-base font-bold tracking-tight text-gray-900 dark:text-white relative block hover:text-primary-blue">
              {title}
            </h5>
          </LocalizedLink>
          <span className="text-sm text-gray-500 dark:text-gray-400">{formattedDate}</span>
          <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            <ReportText maxChars={240} text={text} />
          </div>
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
    </div>
  );
};

export default LatestIncidentReport;
