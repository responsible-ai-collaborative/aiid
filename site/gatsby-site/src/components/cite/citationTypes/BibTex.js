import React from 'react';
import { getFormattedName } from '../../../utils/typography';
import { format } from 'date-fns';
import useToastContext, { SEVERITY } from '../../../hooks/useToast';
import { Button } from 'flowbite-react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Trans, useTranslation } from 'react-i18next';

const BibTex = ({ nodes, incidentDate, incident_id, incidentTitle, editors }) => {
  const addToast = useToastContext();

  const { t } = useTranslation();

  const docs = [...nodes];

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a['submission_date'] > b['submission_date'];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]['submitters'][0]);

  const [firstEditor] = editors;

  const { first_name, last_name } = firstEditor;

  const bibTex =
    '@article {' +
    `
      aiid:${incident_id},
      author = {${submitterCite}},
      editor = {${last_name}, ${first_name}},
      journal = {AI Incident Database},
      publisher = {Responsible AI Collaborative},
      title = {Incident Number ${incident_id}: ${incidentTitle}},
      url = {https://incidentdatabase.ai/cite/${incident_id}},
      year = {${incidentDate.substring(0, 4)}},
      urldate = {${format(new Date(), 'MMMM d, y')}},
      note = {Retrieved ${format(new Date(), 'MMMM yyyy')} from 
        \\url{https://incidentdatabase.ai/cite/${incident_id}}}`.replace(/^ +/, '\t') +
    '\n' +
    '}';

  const jsx = <code style={{ whiteSpace: 'pre-wrap' }}>{bibTex}</code>;

  return (
    <>
      <h2>
        <Trans>BibTex Citation</Trans>
      </h2>
      <div data-cy="bibtex-format">{jsx}</div>
      <div className="flex justify-end">
        <Button
          color={'gray'}
          onClick={() => {
            navigator.clipboard.writeText(bibTex);
            addToast({
              message: 'BibTeX copied to clipboard',
              severity: SEVERITY.success,
            });
          }}
        >
          <FontAwesomeIcon
            icon={faCopy}
            className="fas fa-times"
            style={{ marginRight: '1ch' }}
            title={t('Copy')}
          />
          <Trans>Copy</Trans>
        </Button>
      </div>
    </>
  );
};

export default BibTex;
