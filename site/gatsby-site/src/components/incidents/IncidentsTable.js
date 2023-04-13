import { useUserContext } from 'contexts/userContext';
import React, { useState } from 'react';
import { useBlockLayout, useFilters, usePagination, useResizeColumns, useTable } from 'react-table';
import IncidentEditModal from './IncidentEditModal';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import { Button, Dropdown, Pagination, TextInput, ToggleSwitch } from 'flowbite-react';

function DefaultColumnFilter({
  column: { Header, canFilter, filterValue, preFilteredRows, setFilter },
}) {
  const count = preFilteredRows.length;

  const { t } = useTranslation();

  if (!canFilter) {
    return <h6 className="whitespace-nowrap overflow-hidden text-ellipsis">{Header}</h6>;
  }

  return (
    <div>
      <h6 className="whitespace-nowrap overflow-hidden text-ellipsis">{Header}</h6>
      <TextInput
        data-cy={`input-filter-${Header}`}
        className="w-100"
        type="text"
        placeholder={t(`Search {{count}} records...`, { count })}
        value={filterValue || ''}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
      />
    </div>
  );
}

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

  const [currentPage, setCurrentPage] = useState(1);

  const { isLoggedIn, isRole } = useUserContext();

  const { t } = useTranslation();

  const defaultColumn = React.useMemo(
    () => ({
      minWidth: 30,
      width: 220,
      maxWidth: 640,
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const columns = React.useMemo(() => {
    const columns = [
      {
        Header: t('Incident ID'),
        accessor: 'incident_id',
        Cell: ({ row: { values } }) => (
          <a className="flex" href={`/cite/${values.incident_id}`}>
            Incident {values.incident_id}
          </a>
        ),
      },
      {
        Header: <Trans>Title</Trans>,
        accessor: 'title',
      },
      {
        Header: <Trans>Description</Trans>,
        accessor: 'description',
      },
      {
        Header: <Trans>date</Trans>,
        accessor: 'date',
      },
      {
        Header: <Trans>Alleged Deployer of AI System</Trans>,
        id: 'AllegedDeployerOfAISystem',
        accessor: (data) =>
          data.AllegedDeployerOfAISystem?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
      {
        Header: <Trans>Alleged Developer of AI System</Trans>,
        id: 'AllegedDeveloperOfAISystem',
        accessor: (data) =>
          data.AllegedDeveloperOfAISystem?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
      {
        Header: <Trans>Alleged Harmed or Nearly Harmed Parties</Trans>,
        id: 'AllegedHarmedOrNearlyHarmedParties',
        accessor: (data) =>
          data.AllegedHarmedOrNearlyHarmedParties?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
    ];

    if (isRole('incident_editor')) {
      columns.push({
        Header: 'Actions',
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

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    pageOptions,
    pageCount,
    gotoPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      defaultColumn,
    },
    useFilters,
    useBlockLayout,
    useResizeColumns,
    usePagination
  );

  return (
    <>
      {/* eslint-disable react/jsx-key */}

      <div className="incidents-table inline-block border-spacing-0" {...getTableProps()}>
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
        <div className="bg-white sticky z-2 w-fit top-0 shadow-incidents-table">
          {headerGroups.map((headerGroup) => (
            <div {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <div
                  {...column.getHeaderProps()}
                  className="td border-bottom border-right px-3 py-2"
                >
                  {column.render('Filter')}
                  <div
                    className={`inline-block bg-[#6c757d] w-2 h-full absolute right-0 top-0 translate-x-1/2 z-2 touch-none`}
                    {...column.getResizerProps()}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>

        <div {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <div {...row.getRowProps()} className="tr" data-cy="row">
                {row.cells.map((cell) => {
                  return (
                    <div
                      {...cell.getCellProps()}
                      className="td border-end border-bottom"
                      data-cy="cell"
                    >
                      {cell.render('Cell')}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex gap-2 justify-start items-center mt-3">
        {pageCount > 1 && (
          <Pagination
            className="incidents-pagination mb-0"
            onPageChange={(page) => {
              gotoPage(page - 1);
              setCurrentPage(page);
            }}
            currentPage={currentPage}
            showIcons={true}
            totalPages={pageCount}
          />
        )}

        <span>
          <Trans
            i18nKey="paginationKey"
            defaults="Page <bold>{{currentPageIndex}} of {{pageOptionsLength}}</bold>"
            values={{ currentPageIndex: pageIndex + 1, pageOptionsLength: pageOptions.length }}
            components={{ bold: <strong /> }}
          />
        </span>
        <Dropdown
          label={t(pageSize === 9999 ? 'Show all' : `Show ${pageSize}`)}
          style={{ width: 120 }}
          size="sm"
          value={pageSize}
        >
          {[10, 50, 100, 9999].map((pageSize) => (
            <Dropdown.Item
              key={pageSize}
              onClick={() => {
                setPageSize(Number(pageSize));
                setCurrentPage(1);
              }}
            >
              {pageSize === 9999 ? <Trans>Show all</Trans> : <Trans>Show {{ pageSize }}</Trans>}
            </Dropdown.Item>
          ))}
        </Dropdown>
      </div>

      <IncidentEditModal
        show={incidentIdToEdit !== 0}
        onClose={() => setIncindentIdToEdit(0)}
        incidentId={incidentIdToEdit}
      />
    </>
  );
}
