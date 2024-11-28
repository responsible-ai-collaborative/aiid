import React, { useState } from 'react';
import { Spinner, Button } from 'flowbite-react';
import WebArchiveLink from '../ui/WebArchiveLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
  faClockRotateLeft,
} from '@fortawesome/free-solid-svg-icons';
import { FIND_REPORT, FLAG_REPORT } from '../../graphql/reports';
import { useMutation, useQuery } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import CustomButton from '../../elements/Button';
import { Modal } from 'flowbite-react';
import useLocalizePath from 'components/i18n/useLocalizePath';

function FlagModalContent({ reportNumber }) {
  const { data } = useQuery(FIND_REPORT, {
    variables: {
      filter: { report_number: { EQ: reportNumber } },
    },
  });

  const [flagReportMutation, { loading }] = useMutation(FLAG_REPORT);

  const flagReport = async () => {
    await flagReportMutation({
      variables: {
        report_number: reportNumber,
        input: true,
      },
    });
  };

  const report = data?.report;

  const { t } = useTranslation(['translation', 'actions']);

  return (
    <div className="tw-modal-body">
      <div dangerouslySetInnerHTML={{ __html: t('flagReport', { ns: 'actions' }) }} />

      <div className="flex justify-center w-full pt-6">
        {!report ? (
          <Spinner />
        ) : report.flag ? (
          <Button color="warning" disabled data-cy="flag-toggle">
            <Trans>Flagged</Trans>
          </Button>
        ) : (
          <Button color="warning" onClick={() => flagReport()} data-cy="flag-toggle">
            {loading && (
              <div className="mr-2">
                <Spinner size="sm" color="warning" light={true} />
              </div>
            )}
            <Trans>Flag Report</Trans>
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Actions({ item, toggleFilterByIncidentId = null }) {
  const { t } = useTranslation();

  const localizePath = useLocalizePath();

  const [showAuthors, setShowAuthors] = useState(false);

  const [showSubmitters, setShowSubmitters] = useState(false);

  const [showFlag, setShowFlag] = useState(false);

  return (
    <div className="flex flex-wrap">
      <WebArchiveLink
        url={item.url}
        date={item.date_submitted}
        className="btn btn-link px-1"
        title={t('Authors')}
        datePublished={item.epoch_date_published}
        incidentDate={item.epoch_incident_date}
        dateSubmitted={item.epoch_date_submitted}
      >
        <FontAwesomeIcon
          titleId="report-source"
          icon={faNewspaper}
          className="fa-newspaper"
          title={t('Read the Source')}
        />
      </WebArchiveLink>

      <CustomButton
        variant="link"
        title={t('Authors')}
        onClick={() => setShowAuthors(true)}
        className="text-black"
      >
        <FontAwesomeIcon title={t('Authors')} icon={faIdCard} className="fa-id-card" />
      </CustomButton>

      {showAuthors && (
        <Modal show={showAuthors} onClose={() => setShowAuthors(false)}>
          <Modal.Header>
            <Trans>Authors</Trans>
          </Modal.Header>
          <Modal.Body>
            <>{item.authors.join(', ')}</>
          </Modal.Body>
        </Modal>
      )}

      <CustomButton
        variant="link"
        title={t('Submitters')}
        className="px-1 text-black"
        onClick={() => setShowSubmitters(true)}
      >
        <FontAwesomeIcon titleId="report-shield" icon={faUserShield} className="fa-user-shield" />
      </CustomButton>

      {showSubmitters && (
        <Modal show={showSubmitters} onClose={() => setShowSubmitters(false)}>
          <Modal.Header>
            <Trans>Submitters</Trans>
          </Modal.Header>
          <Modal.Body>
            <>{item.submitters.join(', ')}</>
          </Modal.Body>
        </Modal>
      )}

      <CustomButton
        variant="link"
        title={t('View History')}
        className="px-1 text-black"
        data-cy="report-history-button"
        href={localizePath({
          path: `/cite/history?report_number=${item.report_number}&incident_id=${item.incident_id}`,
        })}
      >
        <FontAwesomeIcon titleId="report-history" icon={faClockRotateLeft} />
      </CustomButton>

      <CustomButton
        variant="link"
        title={t('Flag Report')}
        className="px-1 text-black"
        data-cy="flag-button"
        onClick={() => setShowFlag(true)}
      >
        <FontAwesomeIcon titleId="report-flag" icon={faFlag} className="fa-flag" />
      </CustomButton>

      {showFlag && (
        <Modal
          show={showFlag}
          onClose={() => setShowFlag(false)}
          data-cy={'flag-report-' + item.report_number}
        >
          <Modal.Header>
            <Trans>Flag Report</Trans>
          </Modal.Header>
          <Modal.Body>
            <FlagModalContent reportNumber={item.report_number} />
          </Modal.Body>
        </Modal>
      )}

      {toggleFilterByIncidentId && item.is_incident_report && (
        <CustomButton
          variant="link"
          aria-hidden="true"
          className="flex items-center px-1"
          title={t(`Filter by Incident ID #{{id}}`, { id: item.incident_id })}
          onClick={() => toggleFilterByIncidentId(item.incident_id + '')}
        >
          <FontAwesomeIcon
            titleId="report-hashtag"
            icon={faHashtag}
            className="fa-hashtag"
            title={t('Incident ID')}
          />
          {item.incident_id}
        </CustomButton>
      )}
    </div>
  );
}
