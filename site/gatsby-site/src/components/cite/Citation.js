import { format } from 'date-fns';
import React from 'react';
import { getFormattedName } from '../../utils/typography';

const Citation = ({ nodes, incidentDate, incident_id }) => {
  let docs = [];

  nodes.forEach(({ node }) => docs.push(node));

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

  const retrievalString = `Retrieved on ${format(
    new Date(),
    'MMMM d, y'
  )} from incidentdatabase.ai/cite/${incident_id}.`;

  return (
    <>
      {submitterCite}. ({incidentDate}) Incident Number {docs[0]['incident_id']}. in McGregor, S.
      (ed.) <em>Artificial Intelligence Incident Database.</em> Responsible AI Collaborative.{' '}
      {retrievalString}
    </>
  );
};

export default Citation;
