import React from 'react';
import md5 from 'md5';
import { Image } from '../../utils/cloudinary';
import ReportText from 'components/reports/ReportText';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import DateLabel from 'components/ui/DateLabel';
import Link from 'components/ui/Link';
import TranslationBadge from 'components/i18n/TranslationBadge';

const LatestIncidentReport = ({ incident, key, isLatest = false }) => {
  const report = incident.reports[0];

  const {
    image_url,
    cloudinary_id,
    title,
    text,
    epoch_date_submitted,
    report_number,
    source_domain,
    url,
  } = report;

  const incident_id = incident.incident_id;

  const { t } = useTranslation();

  const reportLink = `/cite/${incident_id}#r${report_number}`;

  const incidentTitle = `${t('Incident')} ${incident.incident_id}: ${incident.title}`;

  return (
    <Card key={key}>
      <CardImage {...{ reportLink, cloudinary_id, image_url, title, t, incident_id }} />
      <CardBody
        {...{
          report,
          incidentId: incident.incident_id,
          incidentTitle,
          isIncidentTranslated: incident.isTranslated,
          isLatest,
          reportLink,
          epoch_date_submitted,
          url,
          source_domain,
          text,
        }}
      />
    </Card>
  );
};

const Card = (props) => {
  const className = `
       flex flex-col lg:flex-row items-center
       bg-white rounded-lg border shadow-md dark:border-gray-700 dark:bg-gray-800 h-full
  `;

  return <div {...{ ...props, className, children: undefined }}>{props.children}</div>;
};

const CardImage = ({ reportLink, cloudinary_id, image_url, title, t, incident_id }) => {
  return (
    <div className="lg:flex self-stretch shrink-0 lg:w-1/3 justify-center items-center lg:border-r lg:max-w-sm max-h-240 lg:max-h-[100%]">
      <LocalizedLink
        to={reportLink}
        className="hover:no-underline text-primary-blue max-w-full h-full"
      >
        <Image
          className={
            'img-fluid rounded-start h-full w-full max-w-full rounded-t-lg lg:rounded-l-lg lg:rounded-r-none border-r object-cover max-h-240 lg:max-h-[100%]'
          }
          publicID={cloudinary_id ? cloudinary_id : `legacy/${md5(image_url)}`}
          alt={title}
          itemIdentifier={t('Incident {{id}}', { id: incident_id }).replace(' ', '.')}
        />
      </LocalizedLink>
    </div>
  );
};

const CardBody = ({
  report,
  incidentId,
  incidentTitle,
  isIncidentTranslated,
  isLatest,
  reportLink,
  epoch_date_submitted,
  url,
  source_domain,
  text,
}) => {
  return (
    <div className="h-full p-6">
      <LocalizedLink to={`/cite/${incidentId}`} className="text-gray-900">
        <h4 className="text-2xl" data-testid="latest-incident-title">
          {incidentTitle}
        </h4>
      </LocalizedLink>
      {isIncidentTranslated && <TranslationBadge />}
      <ReportPreview
        {...{
          reportLink,
          report,
          isLatest,
          source_domain,
          url,
          epoch_date_submitted,
          text,
        }}
      />
    </div>
  );
};

const ReportPreview = ({
  reportLink,
  report,
  isLatest,
  source_domain,
  url,
  epoch_date_submitted,
  text,
}) => (
  <div className="border-1 rounded-lg p-4 mt-4">
    <LocalizedLink to={reportLink} className="hover:no-underline max-w-full cursor-pointer">
      <h5 className="text-xl">
        “{report.title}”{isLatest && <LatestIncidentBadge />}
      </h5>
    </LocalizedLink>
    <div className="my-3">
      <Link to={url} className="text-sm mr-2" target="_blank">
        {source_domain}
      </Link>
      <DateLabel
        date={epoch_date_submitted * 1000}
        className="text-sm text-gray-500 dark:text-gray-400"
      />
    </div>
    <div
      className="font-normal text-gray-700 dark:text-gray-400 max-h-[6rem] overflow-hidden 
      [&_*]:inline [&_*]:text-base"
    >
      <ReportText maxChars={240} text={text} />
    </div>
    <div className="flex justify-end mt-4">
      <ReadMoreButton {...{ reportLink }} />
    </div>
  </div>
);

const ReadMoreButton = ({ reportLink, className }) => (
  <LocalizedLink
    to={reportLink}
    className={`hover:no-underline inline-flex items-center py-2 px-3 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${
      className || ''
    }`}
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
);

const LatestIncidentBadge = () => (
  <span className="bg-blue-100 text-blue-800 text-sm font-semibold whitespace-nowrap ml-2 px-1.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-900">
    <Trans ns="landing">Latest Incident Report</Trans>
  </span>
);

export default LatestIncidentReport;
