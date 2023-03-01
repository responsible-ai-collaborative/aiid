import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { Button } from 'flowbite-react';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import React, { useEffect, useState } from 'react';
import { Trans } from 'react-i18next';
import { getFormattedName } from '../../utils/typography';

const Citation = ({ nodes, incidentDate, incident_id, editors }) => {
  const docs = [...nodes];

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    if (a['epoch_date_submitted'] < b['epoch_date_submitted']) {
      return -1;
    }
    if (a['epoch_date_submitted'] > b['epoch_date_submitted']) {
      return 1;
    }
    return 0;
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]['submitters'][0]);

  const [retrievalString, setRetrievalString] = useState('');

  const addToast = useToastContext();

  useEffect(() => {
    const text = `Retrieved on ${format(
      new Date(),
      'MMMM d, y'
    )} from incidentdatabase.ai/cite/${incident_id}.`;

    setRetrievalString(text);
  }, []);

  const firstEditor = editors[0];

  const nameFragments = firstEditor.split(' ');

  const editorLastName = nameFragments[nameFragments.length - 1];

  const editorFirstNameInitial = nameFragments[0][0] + '.';

  const text = `${submitterCite}. (${incidentDate}) Incident Number ${incident_id}. in ${editorLastName},${' '}
  ${editorFirstNameInitial} (ed.) <em>Artificial Intelligence Incident Database.</em> Responsible
  AI Collaborative. ${retrievalString}`;

  return (
    <>
      <h2>
        <Trans>Suggested Citation Format</Trans>
      </h2>
      {text}
      <div className="flex justify-end">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(text);
            addToast({
              message: 'Citation format copied to clipboard',
              severity: SEVERITY.success,
            });
          }}
        >
          <FontAwesomeIcon icon={faCopy} className="fas fa-times" style={{ marginRight: '1ch' }} />
          Copy
        </Button>
      </div>
    </>
  );
};

export default Citation;
