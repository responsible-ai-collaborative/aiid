import React, { useState, useEffect } from 'react';
import { Card, Button, Dropdown, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';
import { useQuery, useMutation } from '@apollo/client';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  DeleteButton,
  removeTypename,
  statusIcon,
  statusColor,
  exportJson,
} from 'utils/checklists';
import { FIND_CHECKLISTS, INSERT_CHECKLIST, DELETE_CHECKLIST } from '../../graphql/checklists';

export default function ChecklistsIndex() {
  const { t } = useTranslation();

  const [insertChecklist] = useMutation(INSERT_CHECKLIST);

  const [deleteChecklist] = useMutation(DELETE_CHECKLIST);

  const { data: checklistsData, loading: checklistsLoading } = useQuery(FIND_CHECKLISTS);

  const [checklists, setChecklists] = useState([]);

  useEffect(() => {
    setChecklists(checklistsData?.checklists || []);
  }, [checklistsData]);

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
          <Button
            onClick={() => {
              window.location = '/apps/checklists?id=' + generateID();
            }}
          >
            <Trans>New</Trans>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4 bg-gray-100 border-1 border-gray-200 rounded shadow-inner p-4">
        {checklists.map((checklist) => (
          <Card key={checklist.id}>
            <div className="flex items-center gap-2 flex-wrap">
              <LocalizedLink className="mr-auto" to={`/apps/checklists?id=${checklist.id}`}>
                <h2 className="mb-0">{checklist.name}</h2>
              </LocalizedLink>
              <Button
                color="light"
                onClick={async () => {
                  const newChecklist = {
                    ...checklist,
                    _id: undefined,
                    id: generateID(),
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
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <Trans>Clone</Trans>
              </Button>
              <Button color="light" onClick={() => alert('Coming soon')}>
                <Trans>Subscribe</Trans>
              </Button>
              <DeleteButton
                type="button"
                onClick={async () => {
                  try {
                    await deleteChecklist({ variables: { query: { id: checklist.id } } });
                    setChecklists((checklists) => checklists.filter((c) => c.id != checklist.id));
                  } catch (e) {
                    console.log(e);
                  }
                }}
              >
                <Trans>Delete</Trans>
              </DeleteButton>
              <Dropdown label="Export">
                <Dropdown.Item onClick={() => exportJson(checklist)}>
                  <Trans>JSON</Trans>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alert('Coming soon')}>
                  <Trans>HTML</Trans>
                </Dropdown.Item>
                <Dropdown.Item onClick={() => alert('Coming soon')}>
                  <Trans>CSV</Trans>
                </Dropdown.Item>
              </Dropdown>
            </div>
            <ul className="flex gap-2 flex-wrap">
              {checklist.risks
                .filter((r) => r.risk_status != 'Not Applicable')
                .map((risk) => (
                  <li key={risk.id} className="flex items-center gap-1 text-gray-600">
                    <FontAwesomeIcon
                      icon={statusIcon(risk.risk_status)}
                      className={`-mt-1 ${statusColor(risk.risk_status)}`}
                      title={risk.risk_status}
                    />
                    {risk.title}
                  </li>
                ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}

var generateID = () => [0, 0, 0, 0].map(() => Math.random().toString(36).slice(-10)).join('');
