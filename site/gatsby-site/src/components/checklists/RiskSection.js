import React, { useEffect } from 'react';
import { Trans } from 'react-i18next';
import { Select, TextInput, Textarea, Card } from 'flowbite-react';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';

import Tags from 'components/forms/Tags';
import { classy, classyDiv } from 'utils/classy';
import { Label, risksEqual, statusIcon, statusColor } from 'utils/checklists';
import EditableLabel from 'components/checklists/EditableLabel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function RiskSection({
  risk,
  values,
  setFieldValue,
  submitForm,
  tags,
  searchTags,
  allPrecedents,
}) {
  const updateRisk = (attributeValueMap) => {
    const updatedRisks = [...values.risks];

    const updatedRisk = updatedRisks.find((r) => risksEqual(r, risk));

    for (const attribute in attributeValueMap) {
      if (attribute != 'precedents') {
        updatedRisk.generated = false;
      }
      updatedRisk[attribute] = attributeValueMap[attribute];
    }

    setFieldValue('risks', updatedRisks);
    submitForm();
  };

  useEffect(() => {
    updatePrecedents({ risk, updateRisk, allPrecedents });
  }, [JSON.stringify(risk.tags), JSON.stringify(searchTags)]);

  const progress =
    ['risk_notes', 'severity', 'likelihood'].reduce(
      (sum, item) => sum + (risk[item].length > 1 ? 1 : 0),
      0
    ) / 3;

  return (
    <RiskDetails open={risk.startClosed ? undefined : true}>
      <RiskHeaderSummary>
        <EditableLabel
          title={risk.title}
          onChange={(event) => updateRisk({ title: event.target.value })}
          textClasses="text-lg text-red-700 px-2 whitespace-nowrap text-ellipsis overflow-hidden inline-block"
          {...{ updateRisk }}
        />
        <div className="hidden md:flex ml-auto mr-6 px-2 bg-white items-center">
          <FontAwesomeIcon
            icon={statusIcon(risk.risk_status)}
            className={`${statusColor(risk.risk_status)} mr-1`}
          />
          <span>{risk.risk_status || 'Unassessed'}</span>
          <ProgressCircle progress={progress} className="-mb-1 ml-2" />
        </div>
      </RiskHeaderSummary>
      <RiskLayout>
        <PrecedentsQuery>
          <Label>
            <Trans>Precedents Query</Trans>
          </Label>
          <div className="bootstrap">
            <Tags
              id="risk_status"
              value={risk.tags}
              onChange={(value) => updateRisk({ tags: value })}
              options={tags}
            />
          </div>
        </PrecedentsQuery>
        <Precedents>
          <Label>Precedents</Label>
          <PrecedentsList>
            {risk.precedents.map((precedent) => (
              <Card key={precedent.incident_id}>
                <div className="h-64 w-64 overflow-hidden">
                  <LocalizedLink to={`/cite/${precedent.incident_id}`}>
                    <h3 className="mt-0">{precedent.title}</h3>
                  </LocalizedLink>
                  <p>{precedent.description}</p>
                </div>
              </Card>
            ))}
          </PrecedentsList>
        </Precedents>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <RiskInfo>
            <label className="-mb-1" htmlFor="risk_status">
              Risk Status
            </label>
            <Select
              id="risk_status"
              value={risk.risk_status}
              onChange={(event) => updateRisk({ risk_status: event.target.value })}
            >
              {['Not Mitigated', 'Mitigated', 'Prevented', 'Not Applicable', 'Unclear'].map(
                (status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                )
              )}
            </Select>
            <div>
              <Label>Severity</Label>
              <TextInput
                value={risk.severity}
                onChange={(event) => updateRisk({ severity: event.target.value })}
              />
            </div>
            <div>
              <Label>Likelihood</Label>
              <TextInput
                value={risk.likelihood}
                onChange={(event) => updateRisk({ likelihood: event.target.value })}
              />
            </div>
          </RiskInfo>
          <div className="h-full flex flex-col">
            <Label>Risk Notes</Label>
            <Textarea
              className="h-full shrink-1"
              value={risk.risk_notes}
              onChange={(event) => updateRisk({ risk_notes: event.target.value })}
            />
          </div>
        </div>
      </RiskLayout>
    </RiskDetails>
  );
}

var RiskLayout = classyDiv('flex flex-col gap-4');

var RiskDetails = classy(
  'details',
  `
  relative max-w-full
  border-red-700 border-t-1 open:border-1
  open:p-3 md:open:p-6 open:rounded
  [&[open]>summary]:before:content-['⏷']
        [&>summary]:before:content-['⏵']
`
);

var RiskHeaderSummary = classy(
  'summary',
  `
  absolute -top-4 left-1 md:left-3 w-full flex px-2 items-center

  before:w-4 before:pl-1 before:bg-white 
  before:text-lg before:text-red-700
`
);

var RiskInfo = classyDiv('flex flex-col gap-2');

var PrecedentsQuery = classyDiv();

var Precedents = classyDiv();

var PrecedentsList = classyDiv(`
  flex gap-3 p-2  
  h-64 w-full max-w-full 
  overflow-x-auto
  bg-gray-100
  border-1 border-gray-200 
  rounded 
  shadow-inner
`);

var updatePrecedents = async ({ risk, updateRisk, allPrecedents }) => {
  const updatedPrecedents = [];

  for (const precedent of allPrecedents) {
    for (const tag of precedent.tags) {
      if ((risk.tags || []).includes(tag)) {
        updatedPrecedents.push(precedent);
        break;
      }
    }
  }
  updateRisk({ precedents: updatedPrecedents });
};

function ProgressCircle({ progress, className }) {
  const r = 20;

  const c = 2 * r * Math.PI;

  const filledLength = c * progress;

  const clearLength = c - filledLength;

  return (
    <div title={Math.round(progress * 100) + '%'} className={`${className} inline`}>
      <svg width="20" height="20" viewBox="0 0 60 60">
        <circle stroke="#d8dadc" strokeWidth="10" fill="transparent" r={r} cx="30" cy="30" />
        <circle
          stroke="#4084f8"
          strokeWidth="10"
          fill="transparent"
          r={r}
          cx="30"
          cy="30"
          strokeDasharray={`${filledLength} ${clearLength}`}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
    </div>
  );
}
