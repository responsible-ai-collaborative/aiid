import React, { useState, useEffect } from 'react';
import { Spinner, Button, Select } from 'flowbite-react';
import Card from 'elements/Card';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useUserContext } from '../../contexts/userContext';
import ExportDropdown from 'components/checklists/ExportDropdown';
import {
  DeleteButton,
  removeTypename,
  statusIcon,
  statusColor,
  generateId,
} from 'utils/checklists';
import { FIND_CHECKLISTS, INSERT_CHECKLIST, DELETE_CHECKLIST } from '../../graphql/checklists';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

const ChecklistsIndex = ({ users }) => {
  const { t } = useTranslation();

  const { user } = useUserContext();

  const addToast = useToastContext();

  const [insertChecklist] = useMutation(INSERT_CHECKLIST);

  const { data: checklistsData, loading: checklistsLoading } = useQuery(FIND_CHECKLISTS);

  const [checklists, setChecklists] = useState([]);

  const [sortFunction, setSortFunction] = useState(sortAlphabetical);

  useEffect(() => {
    setChecklists(checklistsData?.checklists || []);
  }, [checklistsData]);

  const loggedIn = user?.providerType != 'anon-user';

  const displayedChecklists = checklists
    .filter((checklist) => checklist.owner_id == user.id)
    .sort(sortFunction || sortAlphabetical);

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
            <label for="sort-by">Sort</label>
            <Select 
              id="sort-by"
              onChange={
                (evt) => setSortFunction(
                  { alphabetical: sortAlphabetical,
                    chronological: sortChronological
                  }[evt.target.value]
                )
              }
            >
              <option value="alphabetical">Alphabetical</option>
              <option value="chronological">Newest First</option>
            </Select>
            {loggedIn && (
              <Button
                id="new-checklist-button"
                onClick={async () => {
                  const newChecklist = {
                    id: generateId(),
                    date_created: new Date(),
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
      <div>
        {owner && owner.first_name && owner.last_name && (
          <span className="float-right text-gray-700 m-4">
            by {owner.first_name} {owner.last_name}
          </span>
        )}
        <ul className="flex gap-2 flex-wrap p-4">
          {(checklist.risks || [])
            .filter((r) => r.risk_status != 'Not Applicable')
            .map((risk) => (
              <li key={risk.id} className="flex items-center gap-1 text-gray-600 mx-1">
                <FontAwesomeIcon
                  icon={statusIcon(risk.risk_status)}
                  className={`text-${statusColor(risk.risk_status)}-600`}
                  title={risk.risk_status}
                />
                {risk.title}
              </li>
            ))}
        </ul>
      </div>
    </Card>
  );
};

const sortAlphabetical = (A, B) => {
  const a = A?.name || 'Unspecified System';

  const b = B?.name || 'Unspecified System';

  if (a == b) return 0;
  if (a > b) return 1;
  if (a < b) return -1;
}
const sortChronological = (A, B) => {
  const a = A?.date_created || 'Unspecified System';

  const b = B?.date_created || 'Unspecified System';

  if (a == b) return 0;
  if (a > b) return 1;
  if (a < b) return -1;
}

export default ChecklistsIndex;

