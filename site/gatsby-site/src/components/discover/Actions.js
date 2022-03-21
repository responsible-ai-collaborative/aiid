import React from 'react';
import { Button, Spinner } from 'react-bootstrap';
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

  return (
    <div className="modal-body" data-cy="flag-modal">
      <p>Is there a problem with this content? Examples of &quot;problems`&quot;` include,</p>
      <ul>
        <li>The text contents of the report are not parsed properly</li>
        <li>The authors of the report are not associated with the report</li>
        <li>The report is associated with the wrong incident</li>
        <li>The text contents of the report are not parsed properly</li>
      </ul>
      <p>
        Flagged content will still be displayed within the database, but a database editor will
        periodically review the incident reports that have been flagged. Please note that the
        content contained within incident reports (e.g., the commentary within a news article) does
        not need to be correct or consistent across articles. If an article is wrong, misleading, or
        fraudulent, the best response is to submit additional incident reports that correct the
        record. The incident database is meant to capture the complete state of knowledge and
        discourse for incidents, not as an arbiter of what happened in individual incidents. In
        future versions of the database it will additionally be possible to apply tags to incident
        reports to classNameify their content.
      </p>
      <p>Please do NOT flag content if,</p>
      <ul>
        <li>You disagree with the report</li>
        <li>The linked report has disappeared from the web</li>
        <li>The report should not be considered an `&quot;`incident`&quot;`</li>
      </ul>

      {!report ? (
        <Spinner size="sm" animation="border" />
      ) : report.flag ? (
        <Button className="w-100" variant="danger" disabled data-cy="flag-toggle">
          Flagged
        </Button>
      ) : (
        <Button
          className="w-100"
          variant="danger"
          onClick={() => flagReport()}
          data-cy="flag-toggle"
        >
          Flag Report {loading && <Spinner size="sm" animation="border" />}
        </Button>
      )}
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
  return (
    <>
      <WebArchiveLink
        url={item.url}
        date={item.date_submitted}
        className="btn btn-link px-1"
        title={'Authors'}
      >
        <FontAwesomeIcon icon={faNewspaper} className="fa-newspaper" title="Read the Source" />
      </WebArchiveLink>

      <Button
        variant="link"
        title="Authors"
        onClick={() =>
          authorsModal.openFor({
            title: 'Authors',
            body: () => item.authors.join(', '),
          })
        }
      >
        <FontAwesomeIcon icon={faIdCard} className="fa-id-card" />
      </Button>

      <Button
        variant="link"
        title="Submitters"
        className="px-1"
        onClick={() =>
          submittersModal.openFor({
            title: 'Submitters',
            body: () => item.submitters.join(', '),
          })
        }
      >
        <FontAwesomeIcon icon={faUserShield} className="fa-user-shield" />
      </Button>

      <Button
        variant="link"
        title="Flag Report"
        className="px-1"
        data-cy="flag-button"
        onClick={() =>
          flagReportModal.openFor({
            title: 'Submitters',
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
          className="d-flex align-items-center px-1"
          title={`Filter by Incident ID #${item.incident_id}`}
          onClick={() => toggleFilterByIncidentId(item.incident_id + '')}
        >
          <FontAwesomeIcon icon={faHashtag} className="fa-hashtag" title="Incident ID" />
          {item.incident_id}
        </Button>
      )}
    </>
  );
}
