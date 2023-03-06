import { faCopy, faQuestionCircle } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { format } from 'date-fns';
import { Button, Tooltip } from 'flowbite-react';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { getFormattedName } from '../../../utils/typography';

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

  const { t } = useTranslation();

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

  const text = `${submitterCite}. (${incidentDate}) Incident Number ${incident_id}. in ${editorLastName}, ${editorFirstNameInitial} (ed.) <i>Artificial Intelligence Incident Database.</i> Responsible AI Collaborative. ${retrievalString}`;

  return (
    <>
      <div className="flex items-center">
        <h2 className="mb-0 mr-2 align-middle">
          <Trans>Suggested Citation Format</Trans>
        </h2>
        <Tooltip
          content={t(
            'Citing this specific format will make it possible for the Incident Database to find your research and include it on this page.'
          )}
          placement="top"
        >
          <FontAwesomeIcon
            icon={faQuestionCircle}
            style={{ color: 'rgb(210, 210, 210)', cursor: 'pointer' }}
            className="far fa-question-circle"
          />
        </Tooltip>
      </div>
      <div data-cy="suggested-citation-format" dangerouslySetInnerHTML={{ __html: text }} />
      <div className="flex justify-end">
        <Button
          color={'gray'}
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
