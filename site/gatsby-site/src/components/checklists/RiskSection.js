import React, { useEffect, useState, useRef } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { Select, TextInput, Textarea, Card } from 'flowbite-react';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import debounce from 'lodash/debounce';

import Tags from 'components/forms/Tags';
import { Label, risksEqual, statusIcon, statusColor } from 'utils/checklists';
import EditableLabel from 'components/checklists/EditableLabel';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPercent,
  faBolt,
  faHand,
  faComputer,
  faHashtag,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';

export default function RiskSection({
  risk,
  tags,
  searchTags,
  allPrecedents,
  removeRisk,
  updateRisk,
  changeSort,
  userIsOwner,
}) {
  const { t } = useTranslation();

  const [showPrecedentFilters, setShowPrecedentFilters] = useState(!risk.generated);

  const [precedents, setPrecedents] = useState([]);

  const debouncedUpdateRisk = useRef(debounce(updateRisk, 2000)).current;

  useEffect(() => {
    updatePrecedents({ risk, setPrecedents, allPrecedents });
  }, [JSON.stringify(risk.tags), JSON.stringify(searchTags)]);

  const progress =
    ['risk_notes', 'severity', 'likelihood'].reduce(
      (sum, item) => sum + (risk[item].length > 1 ? 1 : 0),
      0
    ) / 3;

  return (
    <RiskDetails open={risk.startClosed ? undefined : true} generated={risk.generated}>
      <RiskHeaderSummary generated={risk.generated}>
        <HeaderItemsGroup>
          <EditableLabel
            title={risk.title}
            onChange={(event) => debouncedUpdateRisk(risk, { title: event.target.value })}
            textClasses={`text-lg font-500 text-${
              risk.generated ? 'gray' : 'red'
            }-700 px-2 whitespace-nowrap text-ellipsis overflow-hidden inline-block`}
            disabled={!userIsOwner}
            {...{ updateRisk }}
          />
          {!risk.generated && userIsOwner && (
            <button onClick={() => removeRisk((r) => risksEqual(risk, r))} disabled={!userIsOwner}>
              <FontAwesomeIcon title="Delete Risk" icon={faTrash} className="mr-1" />
            </button>
          )}
        </HeaderItemsGroup>
        <HeaderItemsGroup className="ml-auto mr-6">
          {risk.generated ? (
            <HeaderTextWithIcon
              onClick={changeSort(byProperty('generated'))}
              title={t(
                'This risk was generated according to ' +
                  'the tags applied to the system above. ' +
                  'If you remove the matching tags, ' +
                  'this risk will disappear unless you make a manual change'
              )}
            >
              <FontAwesomeIcon icon={faComputer} className="mr-1" />
              <span className="md:hidden">Auto</span>
              <span className="hidden md:inline">Auto-generated</span>
            </HeaderTextWithIcon>
          ) : (
            <HeaderTextWithIcon
              onClick={changeSort(byProperty('generated'))}
              title={t(
                'This risk is edited manually. It will persist through changes to the applied tags.'
              )}
            >
              <FontAwesomeIcon icon={faHand} className="mr-1" />
              Manual
            </HeaderTextWithIcon>
          )}
          {!!precedents?.length && (
            <HeaderTextWithIcon
              color="lime"
              className="hidden 2xl:block"
              onClick={changeSort(byNumPrecedents)}
            >
              <FontAwesomeIcon icon={faHashtag} className="mr-1" />
              {/* TODO: Translate/pluralize this correctly */}
              {precedents.length} precedents
            </HeaderTextWithIcon>
          )}
          {!!risk.likelihood && (
            <HeaderTextWithIcon
              color="purple"
              className="hidden xl:block"
              onClick={changeSort(byProperty('likelihood'))}
            >
              <FontAwesomeIcon icon={faPercent} className="mr-1" />
              {risk.likelihood}
            </HeaderTextWithIcon>
          )}
          {!!risk.severity && (
            <HeaderTextWithIcon
              color="orange"
              className="hidden xl:block"
              onClick={changeSort(byProperty('severity'))}
            >
              <FontAwesomeIcon icon={faBolt} className="mr-1" />
              {risk.severity}
            </HeaderTextWithIcon>
          )}
          <HeaderTextWithIcon
            className="hidden xl:block"
            color={statusColor(risk.risk_status)}
            onClick={changeSort(byProperty('risk_status'))}
          >
            <FontAwesomeIcon icon={statusIcon(risk.risk_status)} className={`mr-1`} />
            <span className="inline-block">{risk.risk_status || 'Unassessed'}</span>
          </HeaderTextWithIcon>
          <ProgressCircle progress={progress} className="-mb-1 hidden xl:block" />
        </HeaderItemsGroup>
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
                onChange={(value) => updateRisk(risk, { tags: value })}
                options={tags}
                disabled={!userIsOwner}
                allowNew={false}
              />
            </div>
          </PrecedentsQuery>
        )}
        <Precedents>
          <div className="flex justify-between">
            <Label>Precedents</Label>
            <button
              className="text-gray-600 mb-1"
              onClick={() => setShowPrecedentFilters((value) => !value)}
            >
              {showPrecedentFilters ? <Trans>Hide Filters</Trans> : <Trans>Show Filters</Trans>}
            </button>
          </div>
          <PrecedentsList>
            {precedents.map((precedent) => (
              <Card key={precedent.incident_id}>
                <div>
                  <LocalizedLink to={`/cite/${precedent.incident_id}`}>
                    <h3 className="mt-0">{precedent.title}</h3>
                  </LocalizedLink>
                  <p>{precedent.description}</p>
                  {precedent.tags
                    .filter((tag) => searchTags.includes(tag))
                    .map(
                      (tag) => (
                        <span className="bootstrap rbt-token" key={tag}>
                          {tag}
                        </span>
                      ),
                      []
                    )}
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
            onChange={(event) => updateRisk(risk, { risk_status: event.target.value })}
            disabled={!userIsOwner}
          >
            {['Not Mitigated', 'Mitigated', 'Prevented', 'Not Applicable', 'Unclear'].map(
              (status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              )
            )}
          </Select>
          <RiskSeverity {...{ risk, debouncedUpdateRisk, userIsOwner }} />
          <RiskLikelihood {...{ risk, debouncedUpdateRisk, userIsOwner }} />
          <RiskNotes {...{ risk, debouncedUpdateRisk, userIsOwner }} />
        </RiskFields>
      </RiskBody>
    </RiskDetails>
  );
}

const RiskSeverity = ({ risk, debouncedUpdateRisk, userIsOwner }) => {
  const { t } = useTranslation();

  const [displaySeverity, setDisplaySeverity] = useState(risk.severity);

  return (
    <div>
      <Label>{t('Severity')}</Label>
      <TextInput
        value={displaySeverity}
        disabled={!userIsOwner}
        onChange={(event) => {
          setDisplaySeverity(event.target.value);
          debouncedUpdateRisk(risk, { severity: event.target.value });
        }}
      />
    </div>
  );
};

const RiskLikelihood = ({ risk, debouncedUpdateRisk, userIsOwner }) => {
  const { t } = useTranslation();

  const [displayLikelihood, setDisplayLikelihood] = useState(risk.likelihood);

  return (
    <div>
      <Label>{t('Likelihood')}</Label>
      <TextInput
        value={displayLikelihood}
        disabled={!userIsOwner}
        onChange={(event) => {
          setDisplayLikelihood(event.target.value);
          debouncedUpdateRisk(risk, { likelihood: event.target.value });
        }}
      />
    </div>
  );
};

const RiskNotes = ({ risk, debouncedUpdateRisk, userIsOwner }) => {
  const { t } = useTranslation();

  const [displayNotes, setDisplayNotes] = useState(risk.risk_notes);

  return (
    <div className="md:h-full flex flex-col">
      <Label>{t('Risk Notes')}</Label>
      <Textarea
        className="md:h-full shrink-1"
        value={displayNotes}
        disabled={!userIsOwner}
        onChange={(event) => {
          setDisplayNotes(event.target.value);
          debouncedUpdateRisk(risk, { risk_notes: event.target.value });
        }}
      />
    </div>
  );
};

const RiskBody = (props) => (
  <div
    {...{
      ...props,
      className: `grid grid-cols-1 md:grid-cols-2 gap-4 md:min-h-[24rem] ${props.className}`,
    }}
  >
    {props.children}
  </div>
);

const RiskDetails = (props) => (
  <details
    {...{
      ...props,
      className: ` 
    ${
      props.generated ? 'border-gray-400' : 'border-red-700'
    } border-l-2 border-r-2 border-t-2 open:border-b-2
    h-0 open:h-fit
    relative max-w-full
    open:p-3 md:open:p-6 open:rounded
    cursor-pointer

    [&[open]>summary]:before:content-['⏷']
          [&>summary]:before:content-['⏵']
    [&[open]>summary]:before:w-4
          [&>summary]:before:w-4
    ${props.className}
  `,
    }}
  >
    {props.children}
  </details>
);

const RiskHeaderSummary = (props) => (
  <summary
    {...{
      ...props,
      className: `
    absolute -top-4 left-1 md:left-3 
    w-full px-2 
    flex items-center

    before:w-4 
    before:pl-1 
    before:bg-white 
    before:text-lg 
    ${props.generated ? 'before:text-gray-400' : 'before:text-red-700'}

    ${props.className}
  `,
    }}
  >
    {props.children}
  </summary>
);

const HeaderItemsGroup = (props) => (
  <div
    {...{
      ...props,
      className: `md:flex px-2 gap-2 bg-white items-center ${props.className}`,
    }}
  >
    {props.children}
  </div>
);

const HeaderTextWithIcon = (props) => (
  <div
    {...{
      ...props,
      className: ` 
    inline-flex flex gap-1 items-center
    inline-block bg-${props.color || 'gray'}-200 px-3 rounded-lg 
    text-${props.color || 'gray'}-800
    ${props.className}
  `,
    }}
  >
    {props.children}
  </div>
);

const PrecedentsQuery = (props) => (
  <div {...{ ...props, className: `col-span-2 ${props.className}` }}>{props.children}</div>
);

const Precedents = (props) => (
  <div {...{ ...props, className: `col-span-1 flex flex-col h-full ${props.className}` }}>
    {props.children}
  </div>
);

const RiskFields = (props) => (
  <div {...{ ...props, className: `col-span-1 flex flex-col gap-2 ${props.className}` }}>
    {props.children}
  </div>
);

const PrecedentsList = (props) => (
  <div
    {...{
      ...props,
      className: `
    flex flex-col gap-3 p-2  
    h-full w-full max-w-full max-h-[30rem]
    overflow-y-auto
    bg-gray-100
    border-1 border-gray-200 
    rounded 
    shadow-inner
    ${props.className}
  `,
    }}
  >
    {props.children}
  </div>
);

const updatePrecedents = async ({ risk, setPrecedents, allPrecedents }) => {
  const updatedPrecedents = [];

  for (const precedent of allPrecedents) {
    for (const tag of precedent.tags) {
      if ((risk.tags || []).includes(tag)) {
        updatedPrecedents.push(precedent);
        break;
      }
    }
  }
  setPrecedents(updatedPrecedents);
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

// Sort functions

const byNumPrecedents = (a, b) => a.precedents.length - b.precedents.length;

// Sort the risk sections by one of their properties `p`
// e.g. severity, likelihood, generated
const byProperty = (p) => (a, b) => {
  // Group nulls together at end
  if (isNullish(a?.[p]) && isNullish(b?.[p])) {
    return 0;
  }
  if (!isNullish(a?.[p]) && isNullish(b?.[p])) {
    return -1;
  }
  if (isNullish(a?.[p]) && !isNullish(b?.[p])) {
    return 1;
  }

  // Not applicable should always be last
  if (a[p] == 'Not Applicable' && b[p] != 'Not Applicable') {
    return 1;
  }
  if (a[p] != 'Not Applicable' && b[p] == 'Not Applicable') {
    return -1;
  }

  // Sort numerically if you can.
  const [numA, numB] = [Number(a[p]), Number(b[p])];

  if (!isNaN(numA) && !isNaN(numB)) return numA - numB;

  // Sort alphabetically otherwise.
  return String(a[p]).localeCompare(String(b[p]));
};

const isNullish = (x) => [null, undefined, ''].includes(x);
