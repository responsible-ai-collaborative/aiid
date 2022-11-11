import React from 'react';
import { Card, Spinner } from 'flowbite-react';
import { Image } from '../utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import md5 from 'md5';
import { formatISO, format, parse } from 'date-fns';
import { useTranslation } from 'react-i18next';
import { useLocalization } from 'gatsby-theme-i18n';
import WebArchiveLink from 'components/ui/WebArchiveLink';
import ReportText from 'components/reports/ReportText';
import TranslationBadge from 'components/i18n/TranslationBadge';
import Link from 'components/ui/Link';

/**
 * @typedef {Object} IncidentReportCardProps
 * @property title
 * @property cloudinary_id
 * @property image_url
 * @property reports
 * @property reportsCount
 * @property link
 * @property date
 * @property parsedDate
 * @property source_domain
 * @property url
 * @property text
 * @property report_number
 * @property language
 * @property incident_id
 * @property loading
 * @property textMaxChars
 * @property imagePosition
 * @property dateFormat
 * @property truncateTitle
 * @property children
 * @property className
 * @property style
 * @property id
 * @property onMouseEnter
 * @property onMouseLeave
 *
 * @param {IncidentReportCardProps} props
 */
export default function IncidentReportCard(props) {
  const propsWithDefaults = pickDefaults(props);

  const { loading, imagePosition, className, style, id, onMouseEnter, onMouseLeave } =
    propsWithDefaults;

  return (
    <div data-cy={props['data-cy']} {...{ id, className, style, onMouseEnter, onMouseLeave }}>
      <Card style={{ position: 'relative', height: '100%' }}>
        {loading ? (
          <div className="text-center">
            <Spinner size="xl" />
          </div>
        ) : imagePosition == 'left' ? (
          <HorizontalCardLayout {...propsWithDefaults}>
            <IncidentReportCardBody {...propsWithDefaults} />
          </HorizontalCardLayout>
        ) : (
          <VerticalCardLayout {...propsWithDefaults}>
            <IncidentReportCardBody {...propsWithDefaults} />
          </VerticalCardLayout>
        )}
      </Card>
    </div>
  );
}

function IncidentReportCardBody(props) {
  const {
    children,

    parsedDate,
    dateFormat,
    reportsCount,
    source_domain,
    language,

    text,
    textMaxChars,
    title,
    titleMaxChars,
    link,
    url,
  } = props;

  const { locale } = useLocalization();

  const { t } = useTranslation();

  return (
    <>
      {children.filter((child) => child.props.position == 'header')}

      <CardTitle {...{ title, titleMaxChars, link }} />
      <Subtitle>
        {parsedDate && (
          <time dateTime={formatISO(parsedDate)}>{format(parsedDate, dateFormat)}</time>
        )}
        {reportsCount > 0 && (
          <>
            {reportsCount} {reportsCount == 1 ? t('report') : t('reports')}{' '}
          </>
        )}
        {source_domain && <WebArchiveLink url={url}>{source_domain}</WebArchiveLink>}
        {language && language != locale && (
          <TranslationBadge originalLanguage={language} className="my-2 mr-1" />
        )}
      </Subtitle>
      {text && (
        <div>
          <ReportText text={text} maxChars={textMaxChars} />
        </div>
      )}
      {children.filter(
        (child) => child.props.position == 'footer' || child.props.position == 'bottomRight'
      )}
    </>
  );
}

// Derives the values to display in an IncidentReportCard
function pickDefaults(props) {
  let p = { ...props };

  p.dateFormat ||= 'MMM yyyy';

  p.date ||= p.date_published;
  p.date ||= p.incident_date;

  p.parsedDate = p.date && !p.parsedDate ? parse(p.date, 'yyyy-MM-dd', new Date()) : null;

  p.reportsCount = p.reports?.length;

  if (p.url) {
    p.source_domain = new URL(p.url).hostname.replace(/^www\./, '');
  }

  if (!p.cloudinary_id && p.cloudinary_id !== false && p.reports?.length > 0) {
    for (const report of p.reports) {
      p.cloudinary_id ||= report.cloudinary_id;
    }
  }

  if (p.incident_id && !p.link) {
    p.link = `/cite/${p.incident_id}` + (p.report_number ? `#r${p.report_number}` : '');
  } else if (p.url) {
    p.link = p.url;
  }

  if (p.children) {
    if (Array.isArray(p.children)) {
      p.children = React.Children.toArray(p.children);
    } else {
      p.children = React.Children.toArray([p.children]);
    }
  }

  p.style ||= {};
  if (!p.style.maxWidth) {
    p.style.maxWidth = '100%';
  }

  return p;
}

// The components from here on out should only contain display logic,
// and could potentially be used for things
// that aren't that much like AI incidents.

function HorizontalCardLayout(props) {
  const { dateFormat, cloudinary_id, image_url, link, children } = props;

  console.log('HorizontalCardLayout', `dateFormat`, dateFormat);
  return (
    <div data-cy="card-inner" className="h-full flex justify-start flex-col md:flex-row">
      {(cloudinary_id || image_url) && (
        <Link
          to={link}
          data-cy="image-container"
          className="-m-6 mb-6 block md:h-full md:-m-6 md:mr-10 md:w-96 md:max-w-[33%] md:shrink-0"
        >
          <Image
            className="
              object-cover
              w-full
              rounded-t-lg
              sm:aspect-[16/9]

              md:absolute
              md:bottom-0
              md:top-0
              md:left-0

              md:h-full
              md:w-96
              md:max-w-[33%]

              md:rounded-l-lg
              md:rounded-r-none
            "
            publicID={cloudinary_id || (image_url && `legacy/${md5(image_url)}`)}
            transformation={fill().width(900)}
            alt=""
          />
        </Link>
      )}
      <div data-cy="card-content" className="h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

function VerticalCardLayout(props) {
  const { cloudinary_id, image_url, link, children } = props;

  return (
    <div data-cy="card-inner" className="h-full flex justify-start flex-col">
      {(cloudinary_id || image_url) && (
        <Link to={link} data-cy="image-container" className={'-m-6 mb-6 block'}>
          <Image
            className="object-cover w-full sm:aspect-[16/9] rounded-t-lg aspect-[16/9] max-h-[50vh]"
            publicID={cloudinary_id || (image_url && `legacy/${md5(image_url)}`)}
            transformation={fill().width(900)}
            alt=""
          />
        </Link>
      )}
      <div data-cy="card-content" className="h-full flex flex-col">
        {children}
      </div>
    </div>
  );
}

function CardTitle({ title, titleMaxChars, link }) {
  let truncatedTitle = null;

  if (titleMaxChars) {
    for (const word of title.split(' ')) {
      const extendedTitle = truncatedTitle ? truncatedTitle + ' ' + word : word;

      if (extendedTitle.length <= titleMaxChars) {
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
        {titleMaxChars ? truncatedTitle : title}
      </Link>
    </h3>
  );
}

function Subtitle({ children }) {
  return (
    <div data-cy="subtitle" className="text-muted-gray text-sm">
      {children
        .filter((child) => child)
        .reduce((items, child, i) => {
          if (i > 0) {
            items.push(<> · </>);
          }
          items.push(child);
          return items;
        }, [])
        .map((item, i) => (
          <span key={i}>{item}</span>
        ))}
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
