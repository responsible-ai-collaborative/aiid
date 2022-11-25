import React, { useRef, useState } from 'react';
import md5 from 'md5';
import { Image } from 'utils/cloudinary';
import { fill } from '@cloudinary/base/actions/resize';
import { useUserContext } from 'contexts/userContext';
import ReportText from 'components/reports/ReportText';
import WebArchiveLink from 'components/ui/WebArchiveLink';
import { Button } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { LocalizedLink } from 'gatsby-theme-i18n';
import Actions from 'components/discover/Actions';

const ReportCard = ({ item }) => {
  const { isRole, loading } = useUserContext();

  const [fullText, setFullText] = useState(false);

  const ref = useRef(null);

  return (
    <div
      className="flex flex-col items-center bg-white rounded-lg border  shadow-md md:flex-row dark:border-gray-700 dark:bg-gray-800"
      id={`r${item.report_number}`}
      ref={ref}
    >
      <div
        className={`${
          fullText ? 'md:hidden' : ''
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
        className={`flex flex-col justify-between leading-normal p-4 ${fullText ? '' : 'md:w-2/3'}`}
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
          </div>
          {!loading && isRole('incident_editor') && (
            <Button
              data-cy="edit-report"
              size={'xs'}
              color="light"
              href={`/cite/edit?report_number=${item.report_number}`}
            >
              <Trans>Edit</Trans>
            </Button>
          )}
        </div>
        <div>
          <ReportText text={item.text} maxChars={fullText ? null : 240} />
        </div>
        <div className="flex justify-end mt-4">
          {!fullText && (
            <Button size={'xs'} onClick={() => setFullText(true)}>
              <Trans>Expand</Trans>
              <svg
                aria-hidden="true"
                className="ml-2 -mr-1 w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 10.293a1 1 0 010 1.414l-6 6a1 1 0 01-1.414 0l-6-6a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l4.293-4.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </Button>
          )}
        </div>
        {fullText && (
          <div className="flex w-full flex-row justify-around items-center text-dark-gray">
            <Actions item={item} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportCard;
