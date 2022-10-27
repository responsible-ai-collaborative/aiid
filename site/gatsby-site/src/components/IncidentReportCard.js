import React from 'react';
import { Card, Spinner } from 'flowbite-react';
import { Image } from '../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import { useLocalization } from 'gatsby-theme-i18n';
import { formatISO, format, parse } from 'date-fns';
import { useTranslation } from 'react-i18next';
import WebArchiveLink from 'components/ui/WebArchiveLink';
import ReportText from 'components/reports/ReportText';
import TranslationBadge from 'components/i18n/TranslationBadge';
import Link from 'components/ui/Link';

export default function IncidentReportCard(props) {
  let {
    // You can pass an object containing the incident OR the report to be rendered
    incident,
    report,

    // You can also directly pass the data you want to be rendered.
    // If it already exists in the object you passed,
    // these take precedence.
    // You can set the value to `false`
    // to cause it to not be rendered.
    title,
    cloudinary_id,
    image_url,
    reports,
    reportsCount,
    link,
    date,
    date_published,
    date_submitted,
    epoch_date_published,
    epoch_date_submitted,
    source_domain,
    url,
    text,
    report_number,
    language,

    // If the card represents a report,
    // the incident_id is the id of the corresponding incident.
    incident_id,

    // Card state
    loading = false,

    // Card config
    textMaxChars,
    imagePosition,
    dateFormat = 'MMM yyyy',
    truncateTitle = false,

    // React
    children,
    className,
    style,
    id,
    onMouseEnter,
    onMouseLeave,
  } = props;

  if (incident && report) {
    throw 'An IncidentReportCard can render an incident or a report, but not both';
  }

  const { locale } = useLocalization();

  const { t } = useTranslation();

  reports = reports || incident?.reports;
  const firstReport = reports && reports.length > 0 ? reports[0] : null;

  if (reportsCount === undefined && reports?.length) {
    reportsCount = reports.length;
  }

  // We can't do ||= because items are disable by passing `false` as a parameter
  if (title === undefined) {
    title = incident?.title || report?.title;
  }
  if (cloudinary_id === undefined) {
    cloudinary_id = report?.cloudinary_id || firstReport?.cloudinary_id;
  }
  if (image_url === undefined) {
    image_url = report?.image_url || firstReport?.image_url;
  }
  if (report_number === undefined) {
    report_number = report?.report_number;
  }
  if (incident_id === undefined) {
    incident_id = incident?.incident_id || report?.incident_id;
  }
  if (url === undefined) {
    url = report?.url || firstReport?.url;
  }
  if (text === undefined) {
    text = report?.text;
  }
  if (source_domain === undefined) {
    source_domain = report?.source_domain;
  }
  if (date === undefined) {
    date =
      incident?.date ||
      date_published ||
      (epoch_date_published && format(epoch_date_published * 1000, 'yyyy-MM-dd')) ||
      date_submitted ||
      (epoch_date_submitted && format(epoch_date_submitted * 1000, 'yyyy-MM-dd')) ||
      report?.date_published ||
      (report?.epoch_date_published && format(report.epoch_date_published * 1000, 'yyyy-MM-dd')) ||
      report?.date_submitted ||
      (report?.epoch_date_submitted && format(report.epoch_date_submitted * 1000, 'yyyy-MM-dd'));
  }
  if (language === undefined) {
    language = report?.language || locale;
  }

  const parsedDate = date ? parse(date, 'yyyy-MM-dd', new Date()) : null;

  if (children) {
    if (!Array.isArray(children)) {
      children = React.Children.toArray([children]);
    } else {
      children = React.Children.toArray(children);
    }
  }

  if (incident_id) {
    link = `/cite/${incident_id}` + (report_number ? `#r${report_number}` : '');
  } else if (url) {
    link = url;
  }

  const img =
    loading || (!cloudinary_id && !image_url) ? (
      <></>
    ) : (
      <>
        <Image
          className={
            'object-cover w-full sm:aspect-[16/9] rounded-t-lg ' +
            (imagePosition == 'left'
              ? 'md:absolute md:bottom-0 md:top-0 md:left-0 md:w-96 md:max-w-[33%] md:h-full md:rounded-l-lg md:rounded-r-none'
              : 'aspect-[16/9]')
          }
          publicID={cloudinary_id || `legacy/${md5(image_url)}`}
          transformation={fill().width(900)}
          alt=""
        />
      </>
    );

  style ||= {};

  if (!style.maxWidth) {
    style.maxWidth = '100%';
  }

  return (
    <div data-cy={props['data-cy']} {...{ id, className, style, onMouseEnter, onMouseLeave }}>
      <Card style={{ position: 'relative', height: '100%' }}>
        {loading ? (
          <div className="text-center">
            <Spinner size="xl" />
          </div>
        ) : (
          <div
            data-cy="card-inner"
            className={
              'h-full flex justify-start flex-col ' + (imagePosition == 'left' ? 'md:flex-row' : '')
            }
          >
            {(cloudinary_id || image_url) &&
              (link ? (
                <Link
                  to={link}
                  data-cy="image-container"
                  className={
                    '-m-6 mb-6 block ' +
                    (imagePosition == 'left'
                      ? 'md:h-full md:-m-6 md:mr-10 md:w-96 md:max-w-[33%] md:shrink-0'
                      : '')
                  }
                >
                  {img}
                </Link>
              ) : (
                <div
                  data-cy="image-container"
                  className={
                    '-m-6 mb-6 block ' +
                    (imagePosition == 'left'
                      ? 'md:h-full md:-m-6 md:mr-10 md:w-96 md:max-w-[33%] md:shrink-0'
                      : '')
                  }
                >
                  {img}
                </div>
              ))}
            <div data-cy="card-content" className="h-full flex flex-col">
              {children.filter((child) => child.props.position == 'header')}
              <h3
                title={title}
                className="text-lg font-semibold overflow-hidden relative"
                style={{ maxHeight: truncateTitle ? '9rem' : undefined }}
                data-cy="title"
              >
                {link ? (
                  <div className="flex">
                    <Link
                      to={link}
                      data-cy="cite-link"
                      className="text-gray-900 dark:text-white hover:text-primary-blue"
                    >
                      {title}
                    </Link>
                  </div>
                ) : (
                  <>{title}</>
                )}
                {
                  // Makes fifth line fade out
                  truncateTitle && (
                    <div
                      style={{
                        position: 'absolute',
                        top: '7rem',
                        height: '3rem',
                        right: '0px',
                        width: '50%',
                        background: 'linear-gradient(to right, rgba(255, 255, 255, 0), white)',
                      }}
                    />
                  )
                }
              </h3>
              <div data-cy="subtitle" className="text-muted-gray text-sm">
                {[
                  parsedDate && (
                    <time dateTime={formatISO(parsedDate)}>{format(parsedDate, dateFormat)}</time>
                  ),
                  reportsCount > 0 && (
                    <>
                      {reportsCount} {reportsCount == 1 ? t('report') : t('reports')}{' '}
                    </>
                  ),
                  source_domain && <WebArchiveLink url={url}>{source_domain}</WebArchiveLink>,
                ]
                  .filter((item) => item)
                  .reduce((items, item, i) => {
                    if (i > 0) {
                      items.push(<> · </>);
                    }
                    items.push(item);
                    return items;
                  }, [])
                  .map((item, i) => (
                    <span key={i}>{item}</span>
                  ))}
                <TranslationBadge originalLanguage={language} className="my-2 mr-1" />
              </div>
              {text && (
                <div>
                  <ReportText text={text} maxChars={textMaxChars} />
                </div>
              )}
              {children.filter(
                (child) => child.props.position == 'footer' || child.props.position == 'bottomRight'
              )}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

export function CardChild({ children, className, style, position }) {
  if (!position) {
    throw 'CardChild must have specified `position`';
  }
  const positionClassName = {
    footer: 'flex mt-4',
    bottomRight: 'absolute bottom-6 right-6',
  }[position];

  return (
    <div
      data-cy="card-actions"
      style={style}
      className={[positionClassName, className].filter((e) => e).join(' ')}
    >
      {React.Children.toArray(children)}
    </div>
  );
}
