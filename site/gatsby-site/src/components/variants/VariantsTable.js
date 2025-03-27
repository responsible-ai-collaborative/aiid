import { useUserContext } from 'contexts/UserContext';
import React, { useState } from 'react';
import Markdown from 'react-markdown';
import { getUnixTime } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan, faCheck, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { useMutation } from '@apollo/client';
import {
  useBlockLayout,
  useFilters,
  usePagination,
  useResizeColumns,
  useSortBy,
  useTable,
} from 'react-table';
import VariantEditModal from './VariantEditModal';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Trans, useTranslation } from 'react-i18next';
import { VariantStatusBadge } from './VariantList';
import { VARIANT_STATUS } from 'utils/variants';
import { DELETE_VARIANT, UPDATE_VARIANT } from '../../graphql/variants';
import { LINK_REPORTS_TO_INCIDENTS } from '../../graphql/reports';
import { Button } from 'flowbite-react';
import Table, { DefaultColumnFilter, DefaultColumnHeader } from 'components/ui/Table';

export default function VariantsTable({ data, refetch, setLoading }) {
  const { loading, isRole } = useUserContext();

  const { t } = useTranslation(['variants']);

  const addToast = useToastContext();

  const [variantIdToEdit, setVariantIdToEdit] = useState(0);

  const [incidentId, setIncidentId] = useState(0);

  const [deleteVariant] = useMutation(DELETE_VARIANT);

  const [linkReportsToIncidents] = useMutation(LINK_REPORTS_TO_INCIDENTS);

  const [updateVariant] = useMutation(UPDATE_VARIANT);

  const defaultColumn = React.useMemo(
    () => ({
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const handleDelete = async ({ report_number }) => {
    if (confirm(t('Do you want to delete this variant?'))) {
      try {
        setLoading(true);

        await deleteVariant({
          variables: {
            filter: { report_number: { EQ: report_number } },
          },
        });

        await linkReportsToIncidents({
          variables: {
            input: {
              incident_ids: [],
              report_numbers: [report_number],
            },
          },
        });

        addToast({
          message: t('Variant successfully deleted. Your changes will be live within 24 hours.'),
          severity: SEVERITY.success,
        });

        await refetch();
      } catch (e) {
        addToast({
          message: (
            <label className="capitalize">{t(e.error || 'An unknown error has occurred')}</label>
          ),
          severity: SEVERITY.danger,
          error: e,
        });
      }
    }
  };

  const handleSubmit = async ({ report_number, tags, status }) => {
    try {
      setLoading(true);

      let newTags = tags.filter((tag) => !tag.startsWith('variant:'));

      newTags.push(status);

      const updated = {
        tags: newTags,
      };

      const today = new Date();

      updated.date_modified = today;
      updated.epoch_date_modified = getUnixTime(today);

      await updateVariant({
        variables: {
          filter: { report_number: { EQ: report_number } },
          update: { set: { ...updated } },
        },
      });

      addToast({
        message: t('Variant successfully updated. Your edits will be live within 24 hours.'),
        severity: SEVERITY.success,
      });

      await refetch();
    } catch (e) {
      addToast({
        message: (
          <label className="capitalize">{t(e.error || 'An unknown error has occurred')}</label>
        ),
        severity: SEVERITY.danger,
        error: e,
      });
    }
  };

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
        title: t('Incident Title'),
        accessor: 'title',
        width: 240,
      },
      {
        className: 'min-w-[240px]',
        title: t('Tags'),
        accessor: 'tags',
        width: 240,
      },
      {
        title: t('Status'),
        className: 'min-w-[150px]',
        accessor: 'status',
        width: 150,
        Cell: ({ row: { values } }) => (
          <div className="flex justify-center">
            <VariantStatusBadge status={values.status} />
          </div>
        ),
      },
      {
        title: t('Description of Incident Circumstances'),
        className: 'min-w-[450px]',
        accessor: 'text',
        width: 450,
        disableFilters: false,
        Cell: ({ row: { values } }) => (
          <div>
            <Markdown className="variants-markdown overflow-auto">{values.text}</Markdown>
          </div>
        ),
      },
      {
        title: t('Inputs / Outputs'),
        className: 'min-w-[450px]',
        accessor: 'inputs_outputs',
        width: 450,
        disableFilters: false,
        Cell: ({ row: { values } }) => (
          <div className="flex flex-col gap-2 w-full">
            {values.inputs_outputs?.map(
              (input_output, index) =>
                input_output != '' && (
                  <div
                    className={`overflow-auto border-1 rounded-lg px-3 ${
                      index % 2 == 1 ? 'bg-gray-200' : ''
                    }`}
                    key={`inputs_outputs.${index}`}
                    data-cy="variant-inputs-outputs"
                  >
                    <Markdown>{input_output}</Markdown>
                  </div>
                )
            )}
          </div>
        ),
      },
    ];

    if (isRole('incident_editor')) {
      // @ts-ignore
      columns.push({
        title: t('Actions'),
        accessor: 'report_number',
        className: 'min-w-[500px]',
        disableFilters: true,
        disableSortBy: true,
        width: 500,
        Cell: ({ row: { values } }) => (
          <div className="flex gap-2 items-center">
            <Button
              color={'success'}
              onClick={() =>
                handleSubmit({
                  report_number: values.report_number,
                  tags: values.tags,
                  status: VARIANT_STATUS.approved,
                })
              }
              className="flex gap-2 disabled:opacity-50"
              data-cy="approve-variant-btn"
            >
              <Trans ns="variants">Approve</Trans>
              <FontAwesomeIcon icon={faCheck} className="ml-2" />
            </Button>
            <Button
              color={'gray'}
              data-cy="edit-variant-btn"
              onClick={() => {
                setVariantIdToEdit(values.report_number);
                setIncidentId(values.incident_id);
              }}
            >
              <Trans>Edit</Trans>
              <FontAwesomeIcon icon={faEdit} className="ml-2" />
            </Button>
            <Button
              color="failure"
              onClick={() =>
                handleSubmit({
                  report_number: values.report_number,
                  tags: values.tags,
                  status: VARIANT_STATUS.rejected,
                })
              }
              className="flex gap-2 disabled:opacity-50"
              data-cy="reject-variant-btn"
            >
              <Trans ns="variants">Reject</Trans>
              <FontAwesomeIcon icon={faBan} className="ml-2" />
            </Button>
            <Button
              color="failure"
              onClick={() => handleDelete({ report_number: values.report_number })}
              data-cy="delete-variant-btn"
            >
              <Trans>Delete</Trans>
              <FontAwesomeIcon icon={faTrash} className="ml-2" />
            </Button>
          </div>
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
      initialState: {
        filters: [
          {
            id: 'status',
            value: 'Unreviewed',
          },
        ],
        hiddenColumns: ['tags'],
      },
    },
    useFilters,
    useSortBy,
    useBlockLayout,
    useResizeColumns,
    usePagination
  );

  return (
    <>
      {/* eslint-disable react/jsx-key */}
      <Table table={table} />

      <VariantEditModal
        show={variantIdToEdit !== 0}
        onClose={() => setVariantIdToEdit(0)}
        reportNumber={variantIdToEdit}
        refetch={refetch}
        incidentId={incidentId}
      />
    </>
  );
}
