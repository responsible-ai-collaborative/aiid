import React from 'react';
import { faShield, faWarning, faTrash } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import ReactDOMServer from 'react-dom/server';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const riskStatusFeatures = {
  'Not Mitigated': {
    icon: faWarning,
    color: 'red',
  },
  Mitigated: {
    icon: faShield,
    color: 'blue',
  },
  Prevented: {
    icon: faShield,
    color: 'green',
  },
  Unclear: {
    icon: faWarning,
    color: 'gray',
  },
  'Not Applicable': {
    icon: faShield,
    color: 'gray',
  },
};

const riskStatusValues = Object.keys(riskStatusFeatures);

const checkedRiskStatus = (status) => {
  if (!riskStatusValues.includes(status)) {
    throw new Error(`Unknown risk status: "${status}"`);
  }
  return status;
};

const statusIcon = (status) => riskStatusFeatures[checkedRiskStatus(status)].icon || faWarning;

const statusColor = (status) => riskStatusFeatures[checkedRiskStatus(status)].color || 'gray';

const abbreviatedTag = (tag) => tag.replace(/^.*:/g, '');

const Label = (props) => (
  <label {...{ ...props, className: `mb-1 block ${props.className || ''}` }}>
    {props.children}
  </label>
);

// If the tags of a generated risk match those of a manual one,
// we don't display it. This is used to make it easy
// to compare the tags of risks and use them as object keys.
const tagsIdentifier = (risk) => [...risk.tags].sort().join('___');

const joinManualAndGeneratedRisks = (manualRisks, generatedRisks) => {
  const manualRiskTagIds = manualRisks.map((risk) => tagsIdentifier(risk));

  const unannotatedGeneratedRisks = generatedRisks.filter(
    (generatedRisk) => !manualRiskTagIds.includes(tagsIdentifier(generatedRisk))
  );

  return manualRisks.concat(unannotatedGeneratedRisks);
};

const exportJson = (checklist, generatedRisks) => {
  generatedRisks ||= [];

  const json = JSON.stringify({
    ...checklist,
    risks: joinManualAndGeneratedRisks(checklist.risks, generatedRisks),

    // These are auto-generated, they clutter the file,
    // and they're not meaningful externally.
  }).replace(/"__typename":"[A-Za-z]*",/g, '');

  const a = document.createElement('a');

  a.setAttribute('href', 'data:text/json,' + encodeURIComponent(json));
  a.setAttribute('download', `${checklist.name} - Risk Checklist.json`);
  a.click();
};

const rowsToCsv = (rows) => {
  let length = 0;

  for (const row of rows) {
    if (row.length > length) {
      length = row.length;
    }
  }
  return rows
    .map((row) =>
      row
        .concat(Array(length - row.length).fill())
        .map((cell) => `"${String(cell || '').replace(/"/g, '""')}"`)
        .join(',')
    )
    .join('\n');
};

const exportHtml = (checklist, generatedRisks) => {
  generatedRisks ||= [];
  const html =
    '<!doctype html>' +
    ReactDOMServer.renderToStaticMarkup(
      <html lang="en">
        <head>
          <meta charset="utf-8" />
          <title>{checklist.name}</title>
        </head>
        <body>
          <h1 className="name">{checklist.name}</h1>
          <section className="about_system">
            <h2 className="title">About System</h2>
            <div className="about text" style={{ whiteSpace: 'pre-wrap' }}>
              {checklist.about}
            </div>
            <section className="all_tags">
              {[
                { title: 'Goal', key: 'tags_goals' },
                { title: 'Method', key: 'tags_methods' },
                { title: 'Other', key: 'tags_other' },
              ].map(
                (type) =>
                  checklist[type.key]?.length > 0 && (
                    <section key={type.key} className={`tags ${type.key}`}>
                      <h3 className="title">{type.title} Tags</h3>
                      <ul className="value">
                        {checklist[type.key].map((tag) => (
                          <li key={tag} className="tag">
                            {tag}
                          </li>
                        ))}
                      </ul>
                    </section>
                  )
              )}
            </section>
          </section>
          <section className="risks">
            <h2 className="title">Risks</h2>
            {joinManualAndGeneratedRisks(checklist.risks, generatedRisks).map((risk) => (
              <section key={risk.tags.join(',')} className="risk">
                <h3>{risk.title}</h3>
                {risk.tags?.length > 0 && (
                  <section className="tags">
                    <h4 className="title">Tags</h4>
                    <ul className="value">
                      {risk.tags.map((tag) => (
                        <li key={tag} className="tag">
                          {tag}
                        </li>
                      ))}
                    </ul>
                  </section>
                )}
                {risk.status && (
                  <section className="risk_status">
                    <h4 className="title">Status</h4>
                    <div className="value">{risk.risk_status}</div>
                  </section>
                )}
                {risk.likelihood && (
                  <section className="likelihood">
                    <h4 className="title">Likelihood</h4>
                    <div className="value">{risk.likelihood}</div>
                  </section>
                )}
                {risk.severity && (
                  <section className="severity">
                    <h4 className="title">Severity</h4>
                    <div className="value">{risk.severity}</div>
                  </section>
                )}
                {risk.risk_notes && (
                  <section className="notes">
                    <h4 className="title">Notes</h4>
                    <div className="value text" style={{ whiteSpace: 'pre-wrap' }}>
                      {risk.risk_notes}
                    </div>
                  </section>
                )}
                {risk.precedents?.length > 0 && (
                  <section className="precedents">
                    <h4 className="title">Precedents</h4>
                    {risk.precedents.map((precedent) => (
                      <section key={precedent.incident_id} className="precedent">
                        <h5 className="title">
                          <a href={`https://incidentdatabase.ai/cite/${precedent.incident_id}`}>
                            {precedent.incident_id}. {precedent.title}
                          </a>
                        </h5>
                        <div className="text description" style={{ whiteSpace: 'pre-wrap' }}>
                          {precedent.description}
                        </div>
                      </section>
                    ))}
                  </section>
                )}
              </section>
            ))}
          </section>
        </body>
      </html>
    );

  const a = document.createElement('a');

  a.setAttribute('href', 'data:text/html,' + encodeURIComponent(html));
  a.setAttribute('download', `${checklist.name} - Risk Checklist.html`);
  a.click();
};

const exportCsv = (checklist, generatedRisks) => {
  generatedRisks ||= [];

  const allRisks = joinManualAndGeneratedRisks(checklist.risks, generatedRisks);

  console.log(`allRisks`, allRisks);

  const rows = [
    ['Title', checklist.name],
    ['About', checklist.about],
    ['Goals Tags', (checklist.tags_goals || []).join(', ')],
    ['Methods Tags', (checklist.tags_methods || []).join(', ')],
    ['Other Tags', (checklist.tags_other || []).join(', ')],
    [''],
    ['== Risks =='],
    [''],
    ['Title', 'Tags', 'Status', 'Severity', 'Likelihood', 'Precedents', 'Notes'],
    ...allRisks.map((r) => [
      r.title,
      r.tags,
      r.risk_status,
      r.severity,
      r.likelihood,
      (r.precedents || []).map((p) => p.incident_id).join(', '),
      r.risk_notes,
    ]),
  ];

  const csv = rowsToCsv(rows);

  const a = document.createElement('a');

  a.setAttribute('href', 'data:text/csv,' + encodeURIComponent(csv));
  a.setAttribute('download', `${checklist.name} - Risk Checklist.csv`);
  a.click();
};

const DeleteButton = (props) => (
  <button
    data-testid="delete-risk"
    {...{
      ...props,
      className: `
    text-sm text-center font-medium
    px-5 py-2.5 rounded-lg border
    whitespace-nowrap

    text-red-700
    border-gray-300

    hover:text-white
    hover:bg-red-800
    hover:border-red-800

    focus:ring-4
    focus:outline-none
    focus:ring-red-300

    dark:border-gray-600
    dark:text-red-500
    dark:hover:text-white
    dark:hover:bg-red-600
    dark:focus:ring-red-900
  `,
    }}
  >
    <FontAwesomeIcon icon={faTrash} className="mr-2" />
    {props.children}
  </button>
);

const shouldBeGrouped = (tag1, tag2) => {
  if (tag1 == tag2) return true;
  if (tag1.slice(0, 3) == 'GMF' && tag2.slice(0, 3) == 'GMF') {
    const removeKnownPotential = (tag) => tag.replace('GMF:Known', '').replace('GMF:Potential', '');

    if (removeKnownPotential(tag1) == removeKnownPotential(tag2)) {
      return true;
    }
  }
  return false;
};

const generateId = () => uuidv4();

export {
  abbreviatedTag,
  Label,
  DeleteButton,
  tagsIdentifier,
  checkedRiskStatus,
  statusIcon,
  statusColor,
  exportJson,
  exportCsv,
  exportHtml,
  shouldBeGrouped,
  generateId,
};
