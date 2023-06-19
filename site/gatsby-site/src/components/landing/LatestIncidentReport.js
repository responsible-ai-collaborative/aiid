import React from 'react';
import md5 from 'md5';
import { Image } from '../../utils/cloudinary';
import ReportText from 'components/reports/ReportText';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import DateLabel from 'components/ui/DateLabel';

const LatestIncidentReport = ({ report, key }) => {
  const {
    image_url,
    cloudinary_id,
    title,
    text,
    epoch_date_submitted,
    incident_id,
    report_number,
  } = report;

  const { t } = useTranslation();

  const reportLink = `/cite/${incident_id}#r${report_number}`;

  return (
    <div
      className="flex flex-col items-center bg-white rounded-lg border  shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800 h-full"
      key={key}
    >
      <div className="flex self-stretch md:w-1/3 justify-center items-center md:border-r md:max-w-sm">
        <LocalizedLink
          to={reportLink}
          className="hover:no-underline text-primary-blue max-w-full h-full"
        >
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
      <div className="flex flex-col md:w-2/3 justify-between leading-normal">
        <div className="py-6 pl-6 pr-12">
          <LocalizedLink to={reportLink} className="hover:no-underline max-w-full cursor-pointer">
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white w-full p-6 hover:text-primary-blue">
              <Trans ns="landing">Latest Incident Report</Trans>
            </h5>
          </LocalizedLink>
          <div className="px-6 pb-6">
            <LocalizedLink to={reportLink} className="hover:no-underline max-w-full cursor-pointer">
              <h5
                className="text-base font-bold tracking-tight text-gray-900 dark:text-white relative block hover:text-primary-blue"
                data-cy="latest-incident-report-title"
              >
                {title}
              </h5>
            </LocalizedLink>
            <DateLabel
              date={epoch_date_submitted * 1000}
              className="text-sm text-gray-500 dark:text-gray-400"
            />
            <div className="mb-3 font-normal text-gray-700 dark:text-gray-400">
              <ReportText maxChars={240} text={text} />
            </div>
            <div className="flex justify-end">
              <LocalizedLink
                to={reportLink}
                className="hover:no-underline inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
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
              </LocalizedLink>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LatestIncidentReport;
