import React from 'react';
import { retrievalDate } from '../../utils/date';
import { getFormattedName } from '../../utils/typography';

const Citation = ({ nodes, incident_id }) => {
  let docs = [];

  nodes.forEach(({ node }) => docs.push(node));

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a['submission_date'] > b['submission_date'];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]['submitters'][0]);

  const retrievalString = `Retrieved on ${retrievalDate()} from incidentdatabase.ai/cite/${incident_id}.`;

  var incidentDate = docs[0]['incident_date'];

  return (
    <>
      {submitterCite}. ({incidentDate}) Incident Number {docs[0]['incident_id']}. in McGregor, S.
      (ed.) <em>Artificial Intelligence Incident Database.</em> Responsible AI Collaborative. {retrievalString}
    </>
  );
};

export default Citation;
