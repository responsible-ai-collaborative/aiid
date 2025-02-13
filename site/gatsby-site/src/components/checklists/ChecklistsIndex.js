import React, { useState, useEffect } from 'react';
import { Button, Tooltip } from 'flowbite-react';
import Card from 'elements/Card';
import Select from 'elements/Select';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckToSlot,
  faEnvelope,
  faPlusCircle,
  faClone,
} from '@fortawesome/free-solid-svg-icons';
import gql from 'graphql-tag';
import { format, parseISO } from 'date-fns';

import CardSkeleton from 'elements/Skeletons/Card';
import { useUserContext } from 'contexts/UserContext';
import ExportDropdown from 'components/checklists/ExportDropdown';
import {
  DeleteButton,
  statusIcon,
  statusColor,
  generateId,
  abbreviatedTag,
} from 'utils/checklists';
import { FIND_CHECKLISTS, INSERT_CHECKLIST, DELETE_CHECKLIST } from '../../graphql/checklists';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

const ChecklistsIndex = ({ users }) => {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const { loading, user } = useUserContext();

  const loggedIn = !loading && user;

  const [insertChecklist] = useMutation(INSERT_CHECKLIST);

  /************************** Get Checklists **************************/
  const {
    data: checklistsData,
    loading: checklistsLoading,
    error: checklistsErrors,
  } = useQuery(FIND_CHECKLISTS, {
    variables: { filter: { owner_id: { EQ: user?.id } } },
    skip: !user?.id,
  });

  useEffect(() => {
    if (checklistsErrors) {
      addToast({
        message: t('Could not fetch checklists'),
        severity: SEVERITY.danger,
        error: checklistsErrors,
      });
    }
  }, [checklistsErrors]);

  // In useState so that on deleting a checklist,
  // we can remove it from display immediately.
  const [checklists, setChecklists] = useState([]);

  useEffect(() => {
    setChecklists(checklistsData?.checklists || []);
  }, [checklistsData]);

  const riskQueryableChecklists = (checklistsData?.checklists || []).filter(
    (c) => allTags(c).length > 0
  );

  /***************************** Get Risks ****************************/
  const skipRisksQuery = !riskQueryableChecklists.length > 0;

  // We want to query the risks for each checklist.
  // To do that, we construct multiple labeled risk queries:
  //
  // Example
  // -------------------------------------------------------------------
  // query {
  //   GMFKnownAITechnologyTransformer:
  //   risks(input: {tags: ["GMF:Known AI Technology:Transformer"]}) {
  //     tags
  //     title
  //   }
  //   GMFKnownAITechnicalFailureUnderspecification:
  //   risks(input: {tags: ["GMF:Known AI Technical Failure:Underspecification"]}) {
  //     tags
  //     title
  //   }
  // }
  const riskQuery = skipRisksQuery
    ? // Since we're constructing the query with riskQueryableChecklists.map(),
      // if riskQueryableChecklists is empty,
      // then the resulting constructed query string is 'query { }'.
      // This is not valid graphql, so gql() will throw an exception if we pass it.
      // But we have to pass it something, because
      // useQuery() will throw an exception if gets something
      // other than a graphql document returned by gql().
      // It doesn't care if { skip: true } is set,
      // it always typechecks its arguments.
      // So instead, we just pass a dummy query
      // that's valid graphql won't run.
      'query { thisWontRunBut { useQueryMakesUseProvideValidGraphQL } }'
    : `query {
        ${riskQueryableChecklists
          .map(
            (c) => `
            ${identifier(c)}:
            risks(input: { tags: [${tagsQuery(c)}] }) {
              tags
              title
            }`
          )
          .join('\n')}
      }
    `;

  const { data: risksData, error: risksErrors } = useQuery(gql(riskQuery), {
    skip: skipRisksQuery,
  });

  if (risksErrors) {
    addToast({
      message: t('Failure searching for risks.'),
      severity: SEVERITY.danger,
      error: risksErrors,
    });
  }

  /************************ Prepare Display ***************************/
  const [sortBy, setSortBy] = useState('alphabetical');

  const sortFunction = {
    alphabetical: sortByProperty('name'),
    'oldest-first': sortByProperty('date_created'),
    'newest-first': sortByProperty('date_created', { reverse: true }),
    'last-updated': sortByProperty('date_updated', { reverse: true }),
  }[sortBy];

  const displayedChecklists = checklists
    .filter((checklist) => checklist.owner_id == user.id)
    .map((checklist) => {
      const generatedRisks = risksData?.[identifier(checklist)] || [];

      const manualRisks = checklist.risks;

      const newGeneratedRisks = generatedRisks.filter((generatedRisk) =>
        manualRisks.every((manualRisk) => manualRisk.title != generatedRisk.title)
      );

      return { ...checklist, risks: manualRisks.concat(newGeneratedRisks) };
    })
    .sort(sortFunction || sortFunction['alphabetical']);

  return (
    <>
      <div className={'titleWrapper'}>
        <div className="w-full flex items-center flex-wrap gap-2">
          <h1 className="mr-auto">
            <Trans>Risk Checklists</Trans>
          </h1>
          <div className="flex gap-2 items-center">
            <label htmlFor="sort-by">Sort</label>
            <Select id="sort-by" onChange={(evt) => setSortBy(evt.target.value)}>
              <option value="alphabetical">Alphabetical</option>
              <option value="oldest-first">Oldest First</option>
              <option value="newest-first">Newest First</option>
              <option value="last-updated">Last Updated</option>
            </Select>
            {loggedIn && (
              <Button
                id="new-checklist-button"
                onClick={async () => {
                  const now = new Date();

                  const newChecklist = {
                    id: generateId(),
                    date_created: now,
                    date_updated: now,
                    owner_id: user.id,
                    name: 'Unspecified System',
                    about: '',
                    tags_goals: [],
                    tags_methods: [],
                    tags_other: [],
                    risks: [],
                  };

                  try {
                    await insertChecklist({
                      variables: { checklist: newChecklist },
                    });
                  } catch (error) {
                    addToast({
                      message: t('Could not create checklist.'),
                      severity: SEVERITY.danger,
                      error,
                    });
                    return;
                  }
                  window.location = '/apps/checklists?id=' + newChecklist.id;
                }}
              >
                <FontAwesomeIcon icon={faPlusCircle} className="mr-2" />
                <Trans>New</Trans>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-gray-100 border-1 border-gray-200 rounded shadow-inner p-4">
        {checklistsLoading &&
          Array(12)
            .fill()
            .map((_, i) => (
              <CardSkeleton
                key={i}
                image={false}
                lines={4}
                maxWidthSmall={false}
                className="bg-white"
              />
            ))}
        {!checklistsLoading &&
          displayedChecklists.map((checklist) => (
            <CheckListCard
              key={checklist}
              owner={users.find((u) => u.userId == checklist.owner_id)}
              {...{ checklist, setChecklists }}
            />
          ))}
        {!checklistsLoading && (!displayedChecklists || displayedChecklists.length == 0) && (
          <div className="text-xl text-center my-16 text-gray-300">
            <FontAwesomeIcon icon={faCheckToSlot} size="5x" />
            <br />
            <p className="text-gray-400">
              {loggedIn ? (
                <Trans>You haven’t made any checklists (yet).</Trans>
              ) : (
                <Trans>
                  <LocalizedLink className="text-gray-600 underline" to="/login">
                    Sign in
                  </LocalizedLink>{' '}
                  to create checklists.
                </Trans>
              )}
            </p>
          </div>
        )}
      </div>
    </>
  );
};

const CheckListCard = ({ checklist, setChecklists, owner }) => {
  const { t } = useTranslation();

  const { user } = useUserContext();

  const addToast = useToastContext();

  const [insertChecklist] = useMutation(INSERT_CHECKLIST);

  const [deleteChecklist] = useMutation(DELETE_CHECKLIST);

  let dateCreatedYmd;

  let dateCreatedYmdHm;

  let dateUpdatedYmdHm;

  if (checklist.date_created) {
    dateCreatedYmd = format(parseISO(checklist.date_created), 'yyyy-MM-dd');
    dateCreatedYmdHm = format(parseISO(checklist.date_created), 'yyyy-MM-dd hh:mm');
  }

  if (checklist.date_updated) {
    dateUpdatedYmdHm = format(parseISO(checklist.date_updated), 'yyyy-MM-dd hh:mm');
  }

  return (
    <Card data-cy="checklist-card" className="bg-white shadow" key={checklist.id}>
      <div className="flex items-center gap-2 flex-wrap border-b border-gray-200 p-4">
        <LocalizedLink className="mr-auto" to={`/apps/checklists?id=${checklist.id}`}>
          <h2 className="mb-0">{checklist.name}</h2>
        </LocalizedLink>
        <div className="flex gap-2 flex-wrap">
          <Button
            color="light"
            onClick={async () => {
              const newChecklist = {
                ...checklist,
                _id: undefined,
                id: generateId(),
                name: checklist.name + t(' (Clone)'),
              };

              try {
                await insertChecklist({
                  variables: { checklist: newChecklist },
                });
                setChecklists((checklists) => {
                  const newChecklists = [...checklists];

                  newChecklists.splice(checklists.indexOf(checklist), 0, newChecklist);
                  return newChecklists;
                });
              } catch (error) {
                addToast({
                  message: t('Could not clone checklist.'),
                  severity: SEVERITY.danger,
                  error,
                });
              }
            }}
          >
            <FontAwesomeIcon icon={faClone} className="mr-2" />
            <Trans>Clone</Trans>
          </Button>
          <Button color="light" onClick={() => alert('Coming soon')}>
            <FontAwesomeIcon icon={faEnvelope} className="mr-2" />
            <Trans>Subscribe</Trans>
          </Button>
          {user.id == checklist.owner_id && (
            <DeleteButton
              type="button"
              onClick={async () => {
                try {
                  await deleteChecklist({ variables: { filter: { id: { EQ: checklist.id } } } });
                  setChecklists((checklists) => checklists.filter((c) => c.id != checklist.id));
                } catch (error) {
                  addToast({
                    message: t('Could not delete checklist.'),
                    severity: SEVERITY.danger,
                    error,
                  });
                }
              }}
            >
              <Trans>Delete</Trans>
            </DeleteButton>
          )}
          <ExportDropdown {...{ checklist }} />
        </div>
      </div>
      <div className="p-4 leading-6">
        <div className="flex float-right text-gray-700 fit-content">
          {[
            owner && owner.first_name && owner.last_name && (
              <>
                {owner.first_name} {owner.last_name}
              </>
            ),
            checklist.date_created && (
              <>
                {' '}
                <Tooltip
                  content={
                    <>
                      Created {dateCreatedYmdHm}
                      <br />
                      Updated {dateUpdatedYmdHm}
                    </>
                  }
                >
                  <time dateTime={checklist.date_created}>{dateCreatedYmd}</time>
                </Tooltip>
              </>
            ),
          ]
            .filter((e) => e)
            .reduce(
              (result, fragment, i) =>
                i == 0 ? (
                  <>{fragment}</>
                ) : (
                  <>
                    {result} • {fragment}
                  </>
                ),
              []
            )}
        </div>

        {checklist?.risks && (
          <ul className="inline">
            {checklist.risks
              .filter((r) => r.risk_status != 'Not Applicable')
              .map((risk) => (
                <li key={risk.id} className="inline-flex items-center gap-1 text-gray-600 mx-1">
                  <FontAwesomeIcon
                    icon={statusIcon(risk.risk_status || 'Unclear')}
                    className={`text-${statusColor(risk.risk_status || 'Unclear')}-600`}
                    title={risk.risk_status || 'Unclear'}
                  />
                  {risk.title || abbreviatedTag(risk.tag)}
                </li>
              ))}
          </ul>
        )}
        {(!checklist?.risks || checklist?.risks.length == 0) && (
          <span className="text-gray-700">No risks identified</span>
        )}
      </div>
    </Card>
  );
};

const allTags = (checklist) => [
  ...checklist.tags_goals,
  ...checklist.tags_methods,
  ...checklist.tags_other,
];

const identifier = (checklist) =>
  allTags(checklist)
    .sort()
    .join()
    .replace(/[^A-Za-z]/g, '');

const tagsQuery = (classification) =>
  allTags(classification)
    .map((tag) => `"${tag}"`)
    .join(', ');

const sortByProperty = (property, config) => (A, B) => {
  const defaultValue = config?.defaultValue;

  const reverse = config?.reverse || false;

  const a = A?.[property] || defaultValue;

  const b = B?.[property] || defaultValue;

  let result;

  if (a == b) result = 0;
  if (a > b) result = 1;
  if (a < b) result = -1;

  return reverse ? -result : result;
};

export default ChecklistsIndex;
