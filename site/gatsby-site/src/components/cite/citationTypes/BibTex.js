import React from 'react';
import { getFormattedName } from '../../../utils/typography';
import { format } from 'date-fns';
import useToastContext, { SEVERITY } from '../../../hooks/useToast';
import { Button } from 'flowbite-react';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const BibTex = ({ nodes, incidentDate, incident_id, editors }) => {
  const addToast = useToastContext();

  const docs = [...nodes];

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a['submission_date'] > b['submission_date'];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]['submitters'][0]);

  const firstEditor = editors[0];

  const nameFragments = firstEditor.split(' ');

  const editorLastName = nameFragments[nameFragments.length - 1];

  const editorFirstName = nameFragments[0];

  const bibTex =
    '@article {' +
    `
      aiid:${incident_id},
      author = {${submitterCite}},
      editor = {${editorLastName}, ${editorFirstName}},
      journal = {AI Incident Database},
      publisher = {Responsible AI Collaborative},
      title = {Incident Number ${incident_id}},
      url = {https://incidentdatabase.ai/cite/${incident_id}},
      year = {${incidentDate.substring(0, 4)}},
      urldate = {${format(new Date(), 'MMMM d, y')}}`.replace(/^ +/, '\t') +
    '\n' +
    '}';

  const jsx = <code style={{ whiteSpace: 'pre' }}>{bibTex}</code>;

  return (
    <>
      <h2>BibTex Citation</h2>
      <div>{jsx}</div>
      <div className="flex justify-end">
        <Button
          onClick={() => {
            navigator.clipboard.writeText(bibTex);
            addToast({
              message: 'BibTeX copied to clipboard',
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

export default BibTex;
