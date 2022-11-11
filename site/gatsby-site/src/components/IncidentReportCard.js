import React from 'react';
import { Card, Spinner } from 'flowbite-react';
import { Image } from '../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import { formatISO, format, parse } from 'date-fns';
import { useTranslation } from 'react-i18next';
import WebArchiveLink from 'components/ui/WebArchiveLink';
import ReportText from 'components/reports/ReportText';
import TranslationBadge from 'components/i18n/TranslationBadge';
import Link from 'components/ui/Link';

export default function IncidentReportCard(props) {
  let {
    title,
    cloudinary_id,
    image_url,
    reports,
    reportsCount,
    link,
    date,
    parsedDate,
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

  if (!cloudinary_id && cloudinary_id !== false && reports?.length > 0) {
    for (const report of reports) {
      cloudinary_id ||= report.cloudinary_id;
    }
  }
  console.log(`title`, title);
  console.log(`language`, language);

  parsedDate = date && !parsedDate ? parse(date, 'yyyy-MM-dd', new Date()) : null;

  if (incident_id) {
    link = `/cite/${incident_id}` + (report_number ? `#r${report_number}` : '');
  } else if (url) {
    link = url;
  }

  if (children) {
    if (Array.isArray(children)) {
      children = React.Children.toArray(children);
    } else {
      children = React.Children.toArray([children]);
    }
  }

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
            {(cloudinary_id || image_url) && (
              <CardImage {...{ imagePosition, cloudinary_id, image_url, link }} />
            )}
            <div data-cy="card-content" className="h-full flex flex-col">
              {children.filter((child) => child.props.position == 'header')}

              <CardTitle {...{ title, truncateTitle, maxLength: 80, link }} />
              <Subtitle
                {...{ parsedDate, reportsCount, source_domain, url, language, dateFormat }}
              />
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

function CardImage({ imagePosition, cloudinary_id, image_url, link }) {
  return (
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
      <Image
        className={
          'object-cover w-full sm:aspect-[16/9] rounded-t-lg ' +
          (imagePosition == 'left'
            ? 'md:absolute md:bottom-0 md:top-0 md:left-0 md:w-96 md:max-w-[33%] md:h-full md:rounded-l-lg md:rounded-r-none'
            : 'aspect-[16/9] max-h-[50vh]')
        }
        publicID={cloudinary_id || (image_url && `legacy/${md5(image_url)}`)}
        transformation={fill().width(900)}
        alt=""
      />
    </Link>
  );
}

function CardTitle({ title, truncateTitle, maxLength, link }) {
  let truncatedTitle = null;

  if (truncateTitle) {
    for (const word of title.split(' ')) {
      const extendedTitle = truncatedTitle ? truncatedTitle + ' ' + word : word;

      if (extendedTitle.length <= maxLength) {
        truncatedTitle = extendedTitle;
      } else {
        truncatedTitle += '…';
        break;
      }
    }
  }

  return (
    <h3 title={title} className="text-lg font-semibold overflow-hidden relative" data-cy="title">
      <Link
        to={link}
        data-cy="cite-link"
        className="text-gray-900 dark:text-white hover:text-primary-blue"
      >
        {truncateTitle ? truncatedTitle : title}
      </Link>
    </h3>
  );
}

function Subtitle({ parsedDate, reportsCount, source_domain, url, language, dateFormat }) {
  const { t } = useTranslation();

  return (
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
      {language && <TranslationBadge originalLanguage={language} className="my-2 mr-1" />}
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
