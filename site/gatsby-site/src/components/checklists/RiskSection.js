import React, { useEffect, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Select, TextInput, Textarea, Card } from 'flowbite-react';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';

import Tags from 'components/forms/Tags';
import { classy, classyDiv } from 'utils/classy';
import { Label, risksEqual, statusIcon, statusColor } from 'utils/checklists';
import EditableLabel from 'components/checklists/EditableLabel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPercent, faBolt, faHand, faComputer, faHashtag } from '@fortawesome/free-solid-svg-icons';

export default function RiskSection({
  risk,
  values,
  setFieldValue,
  submitForm,
  tags,
  searchTags,
  allPrecedents,
  setRiskSortFunction,
}) {

  const { t } = useTranslation();

  const [showPrecedentFilters, setShowPrecedentFilters] = useState(false);

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

  console.log(`showPrecedentFilters`, showPrecedentFilters);


  return (
    <RiskDetails open={risk.startClosed ? undefined : true} generated={risk.generated}>
      <RiskHeaderSummary generated={risk.generated}>
        <EditableLabel
          title={risk.title}
          onChange={(event) => updateRisk({ title: event.target.value })}
          textClasses={`text-lg font-500 text-${
            risk.generated ? 'gray' : 'red'
          }-700 px-2 whitespace-nowrap text-ellipsis overflow-hidden inline-block`}
          {...{ updateRisk }}
        />
        <HeaderItemsRight>
          {risk.generated ? (
            <HeaderTextWithIcon
              title={t(
                'This risk was generated according to ' +
                  'the tags applied to the system above. ' +
                  'If you remove the matching tags, ' +
                  'this risk will disappear unless you make a manual change'
              )}
              onClick={(event) => {
                event.preventDefault();
                setFieldValue('risks', values.risks.sort(byProperty('generated')));
              }}
            >
              <FontAwesomeIcon icon={faComputer} className="mr-1" />
              Auto-generated
            </HeaderTextWithIcon>
          ) : (
            <HeaderTextWithIcon
              title={t(
                'This risk is edited manually. It will persist through changes to the applied tags.'
              )}
              onClick={(event) => {
                event.preventDefault();
                setFieldValue('risks', values.risks.sort(byProperty('generated')));
              }}
            >
              <FontAwesomeIcon icon={faHand} className="mr-1" />
              Manual
            </HeaderTextWithIcon>
          )}
          {!!risk.precedents?.length && (
            <HeaderTextWithIcon
              className="hidden 2xl:block"
              onClick={(event) => {
                event.preventDefault();
                setFieldValue('risks', values.risks.sort(byNumPrecedents));
              }}
            >
              <FontAwesomeIcon icon={faHashtag} className="mr-1" />
              {/* TODO: Translate/pluralize this correctly */}
              {risk.precedents.length} precedents
            </HeaderTextWithIcon>
          )}
          {!!risk.likelihood && 
            <HeaderTextWithIcon
              color="purple"
              className="hidden xl:block"
              onClick={(event) => {
                event.preventDefault();
                setFieldValue('risks', values.risks.sort(byProperty('likelihood')));
              }}
            >
              <FontAwesomeIcon icon={faPercent} className="mr-1" />
              {risk.likelihood}
            </HeaderTextWithIcon>
          }
          {!!risk.severity && 
            <HeaderTextWithIcon 
              color="orange"
              className="hidden xl:block"
              onClick={(event) => {
                event.preventDefault();
                setFieldValue('risks', values.risks.sort(byProperty('severity')));
              }}
            >
              <FontAwesomeIcon icon={faBolt} className="mr-1" />
              {risk.severity}
            </HeaderTextWithIcon>
          }
          <HeaderTextWithIcon
            className="hidden xl:block"
            color={statusColor(risk.risk_status)}
            onClick={() => {
              event.preventDefault();

              // TODO: Order them in a more meaningful way
              setFieldValue('risks', values.risks.sort(byProperty('risk_status')));
            }}
          >
            <FontAwesomeIcon
              icon={statusIcon(risk.risk_status)}
              className={`mr-1`}
            />
            <span className="inline-block">{risk.risk_status || 'Unassessed'}</span>
          </HeaderTextWithIcon>
          <ProgressCircle progress={progress} className="-mb-1 hidden xl:block" />
        </HeaderItemsRight>
      </RiskHeaderSummary>
      <RiskBody>
        {showPrecedentFilters && (
          <PrecedentsQuery>
            <Label>
              <Trans>Precedents Filter</Trans>
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
        )}
        <Precedents>
          <div className="flex justify-between">
            <Label>Precedents</Label>
            <button>Filter</button>
          </div>
          <PrecedentsList>
            {risk.precedents.map((precedent) => (
              <Card key={precedent.incident_id}>
                <div>
                  <LocalizedLink to={`/cite/${precedent.incident_id}`}>
                    <h3 className="mt-0">{precedent.title}</h3>
                  </LocalizedLink>
                  <p>{precedent.description}</p>
                  {precedent.tags.reduce((content, tag) => (
                    <>
                      {content}, {tag}
                    </>
                  ))}
                </div>
              </Card>
            ))}
          </PrecedentsList>
        </Precedents>
        <RiskFields>
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
          <div className="md:h-full flex flex-col">
            <Label>Risk Notes</Label>
            <Textarea
              className="md:h-full shrink-1"
              value={risk.risk_notes}
              onChange={(event) => updateRisk({ risk_notes: event.target.value })}
            />
          </div>
        </RiskFields>
      </RiskBody>
    </RiskDetails>
  );
}

const riskColor = (generated) => (generated ? 'gray-400' : 'red-700');

const RiskBody = classyDiv('grid grid-cols-1 md:grid-cols-2 gap-4 md:min-h-[24rem]');

const RiskDetails = classy(
  'details',
  ({ generated }) => `
  border-${riskColor(generated)} border-l-2 border-r-2 border-t-2 open:border-b-2
  h-0 open:h-fit
  relative max-w-full
  open:p-3 md:open:p-6 open:rounded
  cursor-pointer
`
);
//  [&[open]>summary]:before:content-['⏷']
//        [&>summary]:before:content-['⏵']
//  [&[open]>summary]:before:w-4
//        [&>summary]:before:w-4

const RiskHeaderSummary = classy(
  'summary',
  ({ generated }) => `
  absolute -top-4 left-1 md:left-3 w-full flex px-2 items-center

  before:w-4 before:pl-1 before:bg-white 
  before:text-lg before:text-${riskColor(generated)}
`
);

const HeaderItemsRight = classyDiv(`
  hidden md:flex ml-auto mr-6 px-2 gap-2 bg-white items-center
`);

const HeaderTextWithIcon = classyDiv(({ color }) => `
  inline-flex flex gap-1 items-center
  inline-block bg-${color || 'gray'}-200 px-3 rounded-lg 
  text-${color || 'gray'}-800
`);

const PrecedentsQuery = classyDiv('col-span-2');

const Precedents = classyDiv('col-span-1 flex flex-col h-full');

const RiskFields = classyDiv('col-span-1 flex flex-col gap-2');

const PrecedentsList = classyDiv(`
  flex flex-col gap-3 p-2  
  h-full w-full max-w-full max-h-[30rem]
  overflow-y-auto
  bg-gray-100
  border-1 border-gray-200 
  rounded 
  shadow-inner
`);

const updatePrecedents = async ({ risk, updateRisk, allPrecedents }) => {
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

const byNumPrecedents = (a, b) => a.precedents.length - b.precedents.length;

const isNullish = (x) => [null, undefined, ''].includes(x)

const byProperty = (p) => (a, b) => {
  console.log(`p`, p);
  if ( isNullish(a?.[p]) &&  isNullish(b?.[p])) { return  0; }
  if (!isNullish(a?.[p]) &&  isNullish(b?.[p])) { return -1; }
  if ( isNullish(a?.[p]) && !isNullish(b?.[p])) { return  1; }

  const [numA, numB] = [Number(a[p]), Number(b[p])];
  if (!isNaN(numA) && !isNaN(numB)) return numA - numB

  return String(a[p]).localeCompare(String(b[p]))
}

