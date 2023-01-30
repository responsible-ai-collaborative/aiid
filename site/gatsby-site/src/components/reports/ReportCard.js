import React, { useRef, useState } from 'react';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { useUserContext } from 'contexts/userContext';
import ReportText from 'components/reports/ReportText';
import WebArchiveLink from 'components/ui/WebArchiveLink';
import { Button, Tooltip } from 'flowbite-react';
import { Trans } from 'react-i18next';
import Markdown from 'react-markdown';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Actions from 'components/discover/Actions';
import TranslationBadge from 'components/i18n/TranslationBadge';
import { Badge } from 'flowbite-react';
import { RESPONSE_TAG } from 'utils/entities';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { hasVariantData } from 'utils/variants';

const ReportCard = ({ item, className = '', incidentId }) => {
  const { isRole, loading } = useUserContext();

  const [expanded, setExpanded] = useState(false);

  const ref = useRef(null);

  const authors = item.authors.join(', ');

  return (
    <div
      className={`flex flex-col items-center bg-white rounded-lg border  shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800 ${className}}`}
      id={`r${item.report_number}`}
      ref={ref}
      data-cy="incident-report-card"
    >
      <div
        className={`${
          expanded ? 'md:hidden' : ''
        } flex self-stretch justify-center items-center md:border-r md:w-1/3`}
      >
        <Image
          className="img-fluid rounded-start h-full w-full max-w-full rounded-t-lg md:rounded-l-lg md:rounded-r-none border-r object-cover"
          publicID={item.cloudinary_id ? item.cloudinary_id : `legacy/${md5(item.image_url)}`}
          alt={item.title}
          transformation={fill().height(480)}
        />
      </div>
      <div
        className={`flex flex-col justify-between leading-normal p-4 ${expanded ? '' : 'md:w-2/3'}`}
      >
        <div className="flex items-center w-full justify-between">
          <div>
            <LocalizedLink to={`#r${item.report_number}`} className="max-w-full cursor-pointer">
              <h5 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white w-full hover:text-primary-blue">
                <Trans ns="landing">{item.title}</Trans>
              </h5>
            </LocalizedLink>
            <WebArchiveLink url={item.url} className="text-dark-gray">
              {item.source_domain} &middot;{' '}
              {item.date_published ? item.date_published.substring(0, 4) : 'Needs publish date'}
            </WebArchiveLink>
            <div className="mt-1 flex w-fit">
              <TranslationBadge className="mx-2" originalLanguage={item.language} />
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
          {!loading && isRole('incident_editor') && (
            <Button
              data-cy="edit-report"
              size={'xs'}
              color="light"
              href={`/cite/edit?report_number=${item.report_number}&incident_id=${incidentId}`}
            >
              <Trans>Edit</Trans>
            </Button>
          )}
        </div>
        <div>
          <ReportText text={item.text} maxChars={expanded ? null : 240} />
        </div>
        {expanded && hasVariantData(item) && (
          <div className="flex w-full flex-col mt-3 gap-2">
            <div className="font-bold flex items-center gap-2">
              <Trans ns="variants">Input and circumstances</Trans>
              <Tooltip
                content={
                  <Trans ns="variants">
                    Provide the relevant details producing the incident. Examples include the input
                    prompts to a chatbot or a description of the circumstances leading to injuries
                    sustained from a robot.
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
            <div data-cy="variant-text_inputs" className="border-1 rounded-lg px-3">
              <Markdown>{item.text_inputs}</Markdown>
            </div>
            <div className="font-bold flex items-center gap-2">
              <Trans ns="variants">Output and outcomes</Trans>
              <Tooltip
                content={
                  <Trans ns="variants">
                    Provide the relevant details surrounding the incident. Examples include output
                    text from a chatbot or the nature of injuries sustained from a robot.
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
            <div data-cy="variant-text_outputs" className="border-1 rounded-lg px-3">
              <Markdown>{item.text_outputs}</Markdown>
            </div>
          </div>
        )}
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              setExpanded(!expanded);
              if (expanded) {
                ref.current.scrollIntoView({ behavior: 'smooth' });
              }
            }}
            className="text-blue-700 border mt-4 ml-1 hover:bg-blue-700 hover:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-lg text-xs p-1.5 text-center inline-flex items-center mr-2  dark:text-blue-500 dark:hover:text-white dark:focus:ring-blue-800"
            data-cy={`${expanded ? 'collapse' : 'expand'}-report-button`}
          >
            <Trans>{expanded ? 'Collapse' : 'Expand'}</Trans>
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
        {expanded && (
          <div className="flex w-full flex-row justify-around items-center text-dark-gray">
            <Actions item={item} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
