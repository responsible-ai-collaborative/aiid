import { useUserContext } from 'contexts/UserContext';
import React, { useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import IncidentEditModal from './IncidentEditModal';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import { Button, ToggleSwitch } from 'flowbite-react';
import ApiLoginRequired from 'components/ui/ApiLoginRequired';
import useApiAccess from 'hooks/useApiAccess';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  SelectDatePickerFilter,
  filterDate,
  formatDateField,
  sortDateField,
} from 'components/ui/Table';

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

  const { hasApiAccess } = useApiAccess();

  const { loading, isRole } = useUserContext();

  const { t } = useTranslation();

  const defaultColumn = React.useMemo(
    () => ({
      className: 'min-w-[120px]',
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
        className: 'min-w-[240px]',
        title: t('Title'),
        accessor: 'title',
      },
      {
        className: 'min-w-[240px]',
        title: t('Description'),
        accessor: 'description',
      },
      {
        title: t('Date'),
        accessor: 'date',
        Cell: ({ value }) => formatDateField(value),
        Filter: SelectDatePickerFilter,
        sortType: (rowA, rowB) => {
          return sortDateField(rowA, rowB, 'date');
        },
        filter: (rows, id, filterValue) => filterDate(rows, id, filterValue),
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
      {
        title: t('Implicated Systems'),
        id: 'implicated_systems',
        accessor: (data) => data.implicated_systems?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
    ];

    if (isRole('incident_editor')) {
      columns.push({
        title: t('Actions'),
        id: 'actions',
        className: 'min-w-[120px]',
        Cell: ({ row: { values } }) => (
          <Button
            color={'gray'}
            data-cy="edit-incident"
            variant="link"
            onClick={() => setIncindentIdToEdit(values.incident_id)}
          >
            <Trans>Edit</Trans>
          </Button>
        ),
      });
    }

    return columns;
  }, [loading]);

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

  const pageLength = table.page.length;

  const allResultsCount = data.length;

  return (
    <>
      <div className="flex items-center mb-2 flex-wrap gap-2">
        <div className="flex justify-start ml-4 mb-2 pt-1 mr-2">
          {/*
            The table above is rendered from build-time data and needs no session.
            Only live data is read through the API, so the switch is the one control
            here that requires a login. It is left visible but disabled, with the
            reason beside it, rather than hidden — a reader can then see that the
            option exists and why it is unavailable. SEE: server/apiAccess.ts
          */}
          <ToggleSwitch
            checked={isLiveData}
            disabled={!hasApiAccess}
            label={t('Show Live data')}
            onChange={(checked) => {
              setIsLiveData(checked);
            }}
            name="live-data-switch"
          />
        </div>
        {!hasApiAccess && <ApiLoginRequired compact className="mr-2" />}
        <Button color="light" onClick={() => table.setAllFilters([])}>
          Reset filters
        </Button>
      </div>
      <p>
        <Trans>
          Displaying {{ pageLength }} of {{ allResultsCount }} incidents
        </Trans>
      </p>

      <Table table={table} />
      {incidentIdToEdit !== 0 && (
        <IncidentEditModal
          show={true}
          onClose={() => setIncindentIdToEdit(0)}
          incidentId={incidentIdToEdit}
        />
      )}
    </>
  );
}
