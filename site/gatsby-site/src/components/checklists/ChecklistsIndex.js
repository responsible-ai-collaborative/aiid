import React, { useState, useEffect } from 'react';
import { Spinner, Button, Select } from 'flowbite-react';
import Card from 'elements/Card';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import gql from 'graphql-tag';

import { useUserContext } from '../../contexts/userContext';
import ExportDropdown from 'components/checklists/ExportDropdown';
import {
  DeleteButton,
  removeTypename,
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

  const { user } = useUserContext();

  const loggedIn = user?.providerType != 'anon-user';

  const [insertChecklist] = useMutation(INSERT_CHECKLIST);

  /************************** Get Checklists **************************/
  const { data: checklistsData, loading: checklistsLoading } = useQuery(FIND_CHECKLISTS, {
    variables: { query: { owner_id: user?.id } },
    skip: !user?.id,
  });

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
    ? 'query { thisWontRunBut { useQueryMakesUseProvideValidGraphQL } }'
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

  const { data: risksData } = useQuery(gql(riskQuery), { skip: skipRisksQuery });

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

  if (checklistsLoading) {
    return <Spinner />;
  }
  return (
    <>
      <div className={'titleWrapper'}>
        <div className="w-full flex items-center">
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
                <Trans>New</Trans>
              </Button>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-gray-100 border-1 border-gray-200 rounded shadow-inner p-4">
        {displayedChecklists.map((checklist) => (
          <CheckListCard
            key={checklist}
            owner={users.find((u) => u.userId == checklist.owner_id)}
            {...{ checklist, setChecklists }}
          />
        ))}
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

  return (
    <Card data-cy="checklist-card" className="bg-white shadow" key={checklist.id}>
      <div className="flex items-center gap-2 flex-wrap border-b border-gray-200 p-4">
        <LocalizedLink className="mr-auto" to={`/apps/checklists?id=${checklist.id}`}>
          <h2 className="mb-0">{checklist.name}</h2>
        </LocalizedLink>
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
                variables: { checklist: removeTypename(newChecklist) },
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
          <Trans>Clone</Trans>
        </Button>
        <Button color="light" onClick={() => alert('Coming soon')}>
          <Trans>Subscribe</Trans>
        </Button>
        {user.id == checklist.owner_id && (
          <DeleteButton
            type="button"
            onClick={async () => {
              try {
                await deleteChecklist({ variables: { query: { id: checklist.id } } });
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
      <div className="p-4">
        {owner && owner.first_name && owner.last_name && (
          <span className="float-right text-gray-700">
            by {owner.first_name} {owner.last_name}
          </span>
        )}

        {checklist?.risks && (
          <ul className="flex gap-2 flex-wrap">
            {checklist.risks
              .filter((r) => r.risk_status != 'Not Applicable')
              .map((risk) => (
                <li key={risk.id} className="flex items-center gap-1 text-gray-600 mx-1">
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
