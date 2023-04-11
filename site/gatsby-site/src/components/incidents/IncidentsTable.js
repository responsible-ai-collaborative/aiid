import { useUserContext } from 'contexts/userContext';
import React, { useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import IncidentEditModal from './IncidentEditModal';
import { useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import { Button, ToggleSwitch } from 'flowbite-react';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';

function ListCell({ cell }) {
  return (
    <div>
      {cell.value?.map((v, i) => {
        const isLast = i === cell.value.length - 1;

        const segments = v.split(' ');

        const entity_id = segments.pop();

        const name = segments.join(' ');

        if (entity_id) {
          return (
            <Link key={`entity-${name}`} to={`/entities/${entity_id}`} data-cy="cell-entity-link">
              {name}
              {!isLast ? ', ' : ''}
            </Link>
          );
        } else {
          return (
            <>
              {name} {!isLast ? ', ' : ''}
            </>
          );
        }
      })}
    </div>
  );
}

export default function IncidentsTable({ data, isLiveData, setIsLiveData }) {
  const [incidentIdToEdit, setIncindentIdToEdit] = useState(0);

  const { isLoggedIn, isRole } = useUserContext();

  const { t } = useTranslation();

  const defaultColumn = React.useMemo(
    () => ({
      className: 'w-[120px]',
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const columns = React.useMemo(() => {
    const columns = [
      {
        title: t('Incident ID'),
        accessor: 'incident_id',
        Cell: ({ row: { values } }) => (
          <a className="flex" href={`/cite/${values.incident_id}`}>
            Incident {values.incident_id}
          </a>
        ),
      },
      {
        className: 'w-[240px]',
        title: t('Title'),
        accessor: 'title',
      },
      {
        className: 'w-[240px]',
        title: t('Description'),
        accessor: 'description',
      },
      {
        title: t('Date'),
        accessor: 'date',
      },
      {
        title: t('Alleged Deployer of AI System'),
        id: 'AllegedDeployerOfAISystem',
        accessor: (data) =>
          data.AllegedDeployerOfAISystem?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
      {
        title: t('Alleged Developer of AI System'),
        id: 'AllegedDeveloperOfAISystem',
        accessor: (data) =>
          data.AllegedDeveloperOfAISystem?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
      {
        title: t('Alleged Harmed or Nearly Harmed Parties'),
        id: 'AllegedHarmedOrNearlyHarmedParties',
        accessor: (data) =>
          data.AllegedHarmedOrNearlyHarmedParties?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
    ];

    if (isRole('incident_editor')) {
      columns.push({
        title: t('Actions'),
        id: 'actions',
        className: 'w-[120px]',
        Cell: ({ row: { values } }) => (
          <Button
            color={'gray'}
            data-cy="edit-incident"
            variant="link"
            onClick={() => setIncindentIdToEdit(values.incident_id)}
          >
            Edit
          </Button>
        ),
      });
    }

    return columns;
  }, [isLoggedIn]);

  const table = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useSortBy,
    usePagination
  );

  return (
    <>
      <div className="flex justify-start ml-4 mb-2 pt-1">
        <ToggleSwitch
          checked={isLiveData}
          label={t('Show Live data')}
          onChange={(checked) => {
            setIsLiveData(checked);
          }}
          name="live-data-switch"
        />
      </div>

      <Table table={table} />

      <IncidentEditModal
        show={incidentIdToEdit !== 0}
        onClose={() => setIncindentIdToEdit(0)}
        incidentId={incidentIdToEdit}
      />
    </>
  );
}
