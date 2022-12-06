import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import Card from '../../elements/Card';
import { Trans, useTranslation } from 'react-i18next';
import { Spinner, Tooltip } from 'flowbite-react';
import { getVariantStatus, VARIANT_STATUS } from 'utils/variants';
import Markdown from 'react-markdown';

const VariantStatusBadge = ({ status }) => {
  let badgeClass;

  switch (status) {
    case VARIANT_STATUS.approved:
      badgeClass = 'bg-green-100 text-green-800 dark:bg-green-200 dark:text-green-800';
      break;

    case VARIANT_STATUS.rejected:
      badgeClass = 'bg-red-100 text-red-800 dark:bg-red-200 dark:text-red-800';
      break;

    default:
      badgeClass = 'bg-blue-100 text-blue-800 dark:bg-blue-200 dark:text-blue-800';
      break;
  }

  return (
    <div className={`${badgeClass} text-xs font-semibold px-2.5 py-0.5 rounded capitalize`}>
      <Trans>{status}</Trans>
    </div>
  );
};

const VariantCard = ({ variant }) => {
  const { t } = useTranslation();

  return (
    <Card data-cy="variant-card" className="relative p-4 overflow-hidden flex">
      <div className="flex">
        <VariantStatusBadge status={getVariantStatus(variant)} />
      </div>
      <div className="flex w-full flex-row items-center mt-2 gap-4">
        <div className="w-1/2">
          <div className="font-bold flex items-center gap-2">
            <Trans>Input and circumstances</Trans>
            <Tooltip
              content={t(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
              )}
              trigger="click"
            >
              <FontAwesomeIcon
                icon={faQuestionCircle}
                style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
                className="far fa-question-circle"
              />
            </Tooltip>
          </div>
          <div className="border-1 rounded-lg px-3 mt-2">
            <Markdown>{variant.text_inputs}</Markdown>
          </div>
        </div>
        <div className="w-1/2">
          <div className="font-bold flex items-center gap-2">
            <Trans>Output and outcomes</Trans>
            <Tooltip
              content={t(
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
              )}
              trigger="click"
            >
              <FontAwesomeIcon
                icon={faQuestionCircle}
                style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
                className="far fa-question-circle"
              />
            </Tooltip>
          </div>
          <div className="border-1 rounded-lg px-3 mt-2">
            <Markdown>{variant.text_outputs}</Markdown>
          </div>
        </div>
      </div>
    </Card>
  );
};

const VariantList = ({ variants, loading }) => {
  return (
    <div className="my-6">
      {loading && <Spinner />}

      {!loading && variants.length > 0 && (
        <>
          <h1>
            <Trans>Variants</Trans>
          </h1>
          <div>
            <Trans>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
            </Trans>
          </div>
          <div className={'flex flex-col gap-5 mt-5'}>
            {variants.map((variant) => (
              <VariantCard variant={variant} key={`variant-${variant.report_number}`} />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default VariantList;
