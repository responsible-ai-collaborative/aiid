import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Dropdown, Spinner } from 'flowbite-react';
import { Trans } from 'react-i18next';
import { LocalizedLink } from 'plugins/gatsby-theme-i18n';

import { 
  FIND_CHECKLIST, UPDATE_CHECKLIST, FIND_CHECKLISTS, 
  INSERT_CHECKLIST, DELETE_CHECKLIST
} from '../../graphql/checklists';
import { useQuery, useMutation } from '@apollo/client';

export default function ChecklistsIndex() {

  const [newChecklist] = useMutation(INSERT_CHECKLIST);

  const { data: checklistsData, loading: checklistsLoading } = useQuery(FIND_CHECKLISTS);

  const [checklists, setChecklists] = useState([]);

  useEffect(() => {
    setChecklists(checklistsData?.checklists || []);
  }, [checklistsData]);

  const [deleteChecklist] = useMutation(DELETE_CHECKLIST);

  if (checklistsLoading) {
    return <Spinner />;
  }
  return (
    <>
      <div className={'titleWrapper'}>
        <div className="w-full flex items-center">
          <h1 className="mr-auto"><Trans>Risk Checklists</Trans></h1>
          <Button onClick={() => window.location = '/apps/checklists?id=' + (
            [0,0,0,0].map(() => Math.random().toString(36).slice(-10)).join('')
          )}>
            <Trans>New</Trans>
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        {checklists.map(checklist => (
          <Card>
            <div className="flex items-center">
              <LocalizedLink className="mr-auto" to={`/apps/checklists?id=${checklist.id}`}>
                <h2>{checklist.name}</h2>
              </LocalizedLink>
              <Button onClick={async () => {
                try {
                  await deleteChecklist({ variables: {query: {id: checklist.id}}});
                  setChecklists(checklists => checklists.filter(c => c.id != checklist.id));
                } catch (e) {
                  console.log(e);
                }
              }}>
                <Trans>Delete</Trans>
              </Button>
              {/*
              <Button>
                <Trans>Clone</Trans>
              </Button>
              <Dropdown>
                <Dropdown.Item>
                  <Trans>Export HTML</Trans>
                </Dropdown>
              </Dropdown>
              */}
            </div>
            <ul className="flex">
              {checklist.risks.map((risk) => (
                <li>{risk.name}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </>
  );
}

