import React from 'react';
import { Card } from 'flowbite-react';
import { Image } from '../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import { LocalizedLink } from 'gatsby-theme-i18n';
import { formatISO, format, parse } from 'date-fns';
import { useTranslation } from 'react-i18next';

const IncidentReportCard = ({
  // This component is designed to be easily usable
  // in various parts of the codebase.
  // Therefore, it allows you to pass data in multiple ways.

  // You can pass an object containing the incident OR the report to be rendered
  incident,
  report,

  // Or you can pass an incident_id or report_number
  // the data of which can be fetched for you.
  incident_id,
  report_number,

  // You can also directly pass the data you want to be rendered.
  // If it already exists in the object you passed or fetched,
  // these take precedence.
  title,
  cloudinary_id,
  image_url,
  reports,
  link,
  date,
  source_domain,
  url,
}) => {
  if (incident && report) {
    throw 'An IncidentReportCard can render an incident or a report, but not both';
  }

  const { t } = useTranslation();

  reports = reports || incident.reports;
  const firstReport = reports && reports.length > 0 ? reports[0] : null;

  title = title || incident?.title || report?.title;
  cloudinary_id = cloudinary_id || report?.cloudinary_id || firstReport?.cloudinary_id;
  image_url = image_url || report?.image_url || firstReport?.image_url;
  report_number = report_number || report?.report_number;
  incident_id = incident_id || incident?.incident_id;
  url = url || report?.url || firstReport?.url;

  date = date || incident?.date || report?.date_published;

  const parsedDate = date ? parse(date, 'yyyy-MM-dd', new Date()) : null;

  if (incident_id) {
    link = `/cite/${incident_id}` + (report_number ? `#${report_number}` : '');
  }
  return (
    <Card style={{ overflow: 'hidden' }}>
      <div className="mb-auto">
        {(cloudinary_id || image_url) && (
          <LocalizedLink to={link} className="-m-6 mb-6 block">
            <Image
              className="object-cover w-full aspect-[16/9]"
              publicID={cloudinary_id || `legacy/${md5(image_url)}`}
              transformation={fill().height(480)}
              alt=""
            />
          </LocalizedLink>
        )}
        <h3 className="text-lg">
          <LocalizedLink to={link}>{title}</LocalizedLink>
        </h3>
        <div className="text-muted-gray text-sm">
          {parsedDate && (
            <>
              <time dateTime={formatISO(parsedDate)}>{format(parsedDate, 'MMM yyyy')}</time> ·{' '}
            </>
          )}
          {reports && reports.length > 0 && (
            <>
              {incident.reports.length} {incident.reports.length == 1 ? t('report') : t('reports')}{' '}
              {source_domain && <a href={url}>{source_domain}</a>}
            </>
          )}
        </div>
      </div>
    </Card>
  );
};

export default IncidentReportCard;
