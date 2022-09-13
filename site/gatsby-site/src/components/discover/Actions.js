import React from 'react';
import { Spinner } from 'react-bootstrap';
import WebArchiveLink from '../ui/WebArchiveLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNewspaper,
  faIdCard,
  faUserShield,
  faFlag,
  faHashtag,
} from '@fortawesome/free-solid-svg-icons';
import { FIND_REPORT, UPDATE_REPORT } from '../../graphql/reports';
import { useMutation, useQuery } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import { Button } from 'flowbite-react';

function FlagModalContent({ reportNumber }) {
  const { data } = useQuery(FIND_REPORT, {
    variables: { query: { report_number: reportNumber } },
  });

  const [flagReport, { loading }] = useMutation(UPDATE_REPORT, {
    variables: {
      query: {
        report_number: reportNumber,
      },
      set: {
        flag: true,
      },
    },
  });

  const report = data?.report;

  const { t } = useTranslation(['translation', 'actions']);

  return (
    <div className="bootstrap">
      <div className="modal-body" data-cy="flag-modal">
        <div dangerouslySetInnerHTML={{ __html: t('flagReport', { ns: 'actions' }) }} />

        {!report ? (
          <Spinner size="sm" animation="border" />
        ) : report.flag ? (
          <Button disabled data-cy="flag-toggle">
            <Trans>Flagged</Trans>
          </Button>
        ) : (
          <Button color={'failure'} onClick={() => flagReport()} data-cy="flag-toggle">
            <Trans>Flag Report</Trans> {loading && <Spinner size="sm" animation="border" />}
          </Button>
        )}
      </div>
    </div>
  );
}

export default function Actions({
  item,
  toggleFilterByIncidentId = null,
  authorsModal,
  submittersModal,
  flagReportModal,
}) {
  const { t } = useTranslation();

  return (
    <>
      <WebArchiveLink
        url={item.url}
        date={item.date_submitted}
        className="btn btn-link px-1"
        title={t('Authors')}
      >
        <FontAwesomeIcon icon={faNewspaper} className="fa-newspaper" title="Read the Source" />
      </WebArchiveLink>

      <Button
        variant="link"
        title={t('Authors')}
        onClick={() =>
          authorsModal.openFor({
            title: t('Authors'),
            body: () => item.authors.join(', '),
          })
        }
      >
        <FontAwesomeIcon icon={faIdCard} className="fa-id-card" />
      </Button>

      <Button
        variant="link"
        title={t('Submitters')}
        className="px-1"
        onClick={() =>
          submittersModal.openFor({
            title: t('Submitters'),
            body: () => item.submitters.join(', '),
          })
        }
      >
        <FontAwesomeIcon icon={faUserShield} className="fa-user-shield" />
      </Button>

      <Button
        variant="link"
        title={t('Flag Report')}
        className="px-1"
        data-cy="flag-button"
        onClick={() =>
          flagReportModal.openFor({
            title: t('Flag Report'),
            body: () => <FlagModalContent reportNumber={item.report_number} />,
          })
        }
      >
        <FontAwesomeIcon icon={faFlag} className="fa-flag" />
      </Button>

      {toggleFilterByIncidentId && (
        <Button
          variant="link"
          aria-hidden="true"
          className="flex items-center px-1"
          title={t(`Filter by Incident ID #{{id}}`, { id: item.incident_id })}
          onClick={() => toggleFilterByIncidentId(item.incident_id + '')}
        >
          <FontAwesomeIcon icon={faHashtag} className="fa-hashtag" title="Incident ID" />
          {item.incident_id}
        </Button>
      )}
    </>
  );
}
