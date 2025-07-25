import React, { useEffect, useRef, useState } from 'react';
import md5 from 'md5';
import { Image as CloudinaryImage } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import ReportText from 'components/reports/ReportText';
import WebArchiveLink from 'components/ui/WebArchiveLink';
import { Trans, useTranslation } from 'react-i18next';
import { Tooltip, Badge } from 'flowbite-react';
import Markdown from 'react-markdown';
import Actions from 'components/discover/Actions';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { RESPONSE_TAG } from 'utils/entities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { hasVariantData } from 'utils/variants';
import { format, fromUnixTime } from 'date-fns';

const ReportCard = ({
  item,
  className = '',
  alwaysExpanded = false,
  actions = null,
  reportTitle = null,
  incidentId = null,
  readOnly = false,
  externalExpanded = null,
  onToggleExpanded = null,
}) => {
  item.incident_id = incidentId || item.incident_id;

  const { t } = useTranslation();

  const [internalExpanded, setInternalExpanded] = useState(alwaysExpanded);

  const expanded = externalExpanded !== null ? externalExpanded : internalExpanded;

  const ref = useRef(null);

  const imageRef = useRef(null);

  const authors = item.authors.join(', ');

  const toggleReadMore = () => {
    if (alwaysExpanded) return;

    if (onToggleExpanded) {
      onToggleExpanded(item.report_number, !expanded);
    } else {
      setInternalExpanded(!expanded);
    }

    const card = ref.current;

    if (card && expanded) {
      card.scrollIntoView();
    }
  };

  const toggleReadMoreKeyDown = (e) => {
    if (e.key === 'Enter') {
      toggleReadMore();
    }
  };

  const [isBottomReached, setIsBottomReached] = useState(false);

  useEffect(() => {
    const cardObserver = new IntersectionObserver(
      ([entry]) => {
        setIsBottomReached(entry.isIntersecting);
      },
      { root: null, rootMargin: '0px', threshold: 0.1 }
    );

    const card = ref.current;

    if (card) {
      cardObserver.observe(card);
    }

    const handleScroll = () => {
      const cardRect = card.getBoundingClientRect();

      setIsBottomReached(
        cardRect.bottom <= window.innerHeight || cardRect.top >= window.innerHeight
      );
    };

    window.addEventListener('scroll', handleScroll);

    return () => {
      if (card) {
        cardObserver.unobserve(card);
      }
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const [btnRight, setBtnRight] = useState(0);

  useEffect(() => {
    const card = ref.current;

    const cardRect = card.getBoundingClientRect();

    if (expanded) {
      setIsBottomReached(
        cardRect.bottom <= window.innerHeight || cardRect.top >= window.innerHeight
      );

      const observer = new IntersectionObserver(([entry]) => {
        const { right } = entry.boundingClientRect;

        setBtnRight(window.innerWidth - right);
      });

      if (card) {
        observer.observe(card);
      }

      // Clean up the observer when the component unmounts
      return () => {
        if (card) {
          observer.unobserve(card);
        }
      };
    }
  }, [expanded]);

  return (
    <>
      <div
        className={`inline-block w-full bg-white rounded-lg border  shadow-md dark:border-gray-700 dark:bg-gray-800 ${
          className || ''
        } p-4 relative ${expanded ? 'expanded' : ''}`}
        id={`r${item.report_number}`}
        ref={ref}
        data-testid="incident-report-card"
      >
        <div
          className={`flex self-stretch justify-center items-center w-1/3 float-left pr-4 cursor-default h-36 md:h-40`}
          ref={imageRef}
        >
          <CloudinaryImage
            className={`img-fluid h-full w-full max-w-full object-cover max-h-full rounded-lg`}
            publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
            alt={item.title}
            transformation={fill().height(480)}
            itemIdentifier={t('Report {{report_number}}', {
              report_number: item.report_number,
            }).replace(' ', '.')}
          />
        </div>
        <div className="mt-0 cursor-default select-text">
          <div className="flex">
            {reportTitle ? (
              <>{reportTitle}</>
            ) : (
              <button
                className="w-3/4 text-left"
                onClick={toggleReadMore}
                onKeyDown={toggleReadMoreKeyDown}
              >
                <h5
                  className={`max-w-full text-xl font-bold tracking-tight text-gray-900 dark:text-white w-full ${
                    !alwaysExpanded ? 'cursor-pointer hover:text-primary-blue' : 'cursor-default'
                  }`}
                >
                  <Trans ns="landing">{item.title}</Trans>
                </h5>
              </button>
            )}
          </div>
          <div className="flex justify-between flex-wrap">
            <WebArchiveLink url={item.url} className="text-dark-gray">
              {item.source_domain} &middot;{' '}
              {item.date_published
                ? format(new Date(item.date_published), 'yyyy')
                : item.epoch_date_published
                ? format(fromUnixTime(item.epoch_date_published), 'yyyy')
                : 'Needs publish date'}
            </WebArchiveLink>
            {actions && !readOnly && <>{actions}</>}
          </div>
          <div className="mt-1 flex w-fit">
            {item.isTranslated && (
              <TranslationBadge className="mx-2" originalLanguage={item.language} />
            )}
            {item.tags && item.tags.includes(RESPONSE_TAG) && (
              <div className="flex-1">
                <Badge color={'success'}>
                  <Trans>{{ authors }} post-incident response</Trans>
                </Badge>
              </div>
            )}
            {hasVariantData(item) && (
              <div className="flex-1">
                <Badge color="success" data-cy="responded-badge">
                  <Trans ns="variants">Has Variant data</Trans>
                </Badge>
              </div>
            )}
          </div>
        </div>
        <div className="cursor-default">
          <ReportText text={item.text} maxChars={expanded ? null : 240} />
          {expanded && hasVariantData(item) && (
            <div className="flex w-full flex-col my-4 gap-2">
              <div className="font-bold flex items-center gap-2">
                <Trans ns="variants">Inputs / Outputs</Trans>
                <Tooltip
                  content={
                    <Trans ns="variants">
                      The sequence of data inputs into the intelligent system and outputs produced
                      by the system involved in the incident. For a chatbot, this will generally
                      present a back and forth between a human and the chatbot&apos;s responses.
                    </Trans>
                  }
                  trigger="click"
                  placement="right"
                >
                  <FontAwesomeIcon
                    icon={faQuestionCircle}
                    style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
                    className="far fa-question-circle"
                  />
                </Tooltip>
              </div>
              {item.inputs_outputs.map((input_output, index) => (
                <div
                  className={`border-1 rounded-lg px-3 ${index % 2 == 1 ? 'bg-gray-200' : ''}`}
                  key={`inputs_outputs.${index}`}
                  data-cy="variant-inputs-outputs"
                >
                  <Markdown>{input_output}</Markdown>
                </div>
              ))}
            </div>
          )}
        </div>
        {!alwaysExpanded && (
          <div className="flex justify-end min-h-[35px]">
            <button
              onClick={toggleReadMore}
              className={`text-blue-700 border ml-1 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2  dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800 bg-white ${
                expanded && !isBottomReached ? 'fixed z-10' : ''
              }`}
              style={{ bottom: '35px', right: btnRight }}
              data-cy={`${expanded ? 'collapse' : 'expand'}-report-button`}
            >
              <Trans>{expanded ? 'Collapse' : 'Read More'}</Trans>
              <svg
                aria-hidden="true"
                className="ml-2 -mr-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                {expanded ? (
                  <path
                    fillRule="evenodd"
                    d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  ></path>
                ) : (
                  <path
                    fillRule="evenodd"
                    d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  ></path>
                )}
              </svg>
            </button>
          </div>
        )}
        {expanded && !readOnly && (
          <div className="flex w-full flex-row justify-around items-center text-dark-gray">
            <Actions item={item} />
          </div>
        )}
      </div>
    </>
  );
};

export default ReportCard;
