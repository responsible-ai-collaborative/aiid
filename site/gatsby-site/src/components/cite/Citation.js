import { format } from 'date-fns';
import React, { useEffect, useState } from 'react';
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

  return (
    <>
      {submitterCite}. ({incidentDate}) Incident Number {incident_id}. in {editorLastName},{' '}
      {editorFirstNameInitial} (ed.) <em>Artificial Intelligence Incident Database.</em> Responsible
      AI Collaborative. {retrievalString}
    </>
  );
};

export default Citation;
