import { useUserContext } from 'contexts/userContext';
import React, { useCallback, useState } from 'react';
import { useFilters, usePagination, useSortBy, useTable } from 'react-table';
import { Trans, useTranslation } from 'react-i18next';
import Link from 'components/ui/Link';
import { Button, Modal, Spinner } from 'flowbite-react';
import Table, {
  DefaultColumnFilter,
  DefaultColumnHeader,
  SelectDatePickerFilter,
} from 'components/ui/Table';
import { faExpandAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMutation } from '@apollo/client';
import { DELETE_SUBMISSION, PROMOTE_SUBMISSION } from '../../graphql/submissions';
import { incidentSchema, issueSchema, reportSchema } from './schemas';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { arrayToList } from 'utils/typography';
import SubmissionEditModal from './SubmissionEditModal';

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

export default function SubmissionTable({ data }) {
  const [submission, setSubmission] = useState(null);

  const [showMoreInfoModal, setShowMoreInfoModal] = useState(false);

  const [modalContent, setModalContent] = useState({ title: null, content: null });

  const [promoting, setPromoting] = useState('');

  const [isEditing, setIsEditing] = useState(false);

  const { isLoggedIn, isRole } = useUserContext();

  const isSubmitter = isRole('submitter');

  const { i18n, t } = useTranslation(['submitted']);

  const [promoteSubmissionToReport] = useMutation(PROMOTE_SUBMISSION, {
    fetchPolicy: 'network-only',
  });

  const promoteSubmission = ({ submission, variables }) =>
    promoteSubmissionToReport({
      variables,
      fetchPolicy: 'no-cache',
      update: (cache) => {
        cache.modify({
          fields: {
            submissions(refs, { readField }) {
              return refs.filter((s) => submission._id !== readField('_id', s));
            },
          },
        });
      },
    });

  const defaultColumn = React.useMemo(
    () => ({
      className: 'w-[120px]',
      Filter: DefaultColumnFilter,
      Header: DefaultColumnHeader,
    }),
    []
  );

  const [deleteSubmission, { loading: deleting }] = useMutation(DELETE_SUBMISSION, {
    update: (cache, { data }) => {
      // Apollo expects a `deleted` boolean field otherwise manual cache manipulation is needed
      cache.evict({
        id: cache.identify({
          __typename: data.deleteOneSubmission.__typename,
          id: data.deleteOneSubmission._id,
        }),
      });
    },
  });

  const addToast = useToastContext();

  const validateSchema = async ({ submission, schema }) => {
    try {
      await schema.validate(submission);
    } catch (e) {
      const [error] = e.errors;

      addToast({
        message: t(error),
        severity: SEVERITY.danger,
        error: e,
      });

      return false;
    }

    return true;
  };

  const promoteToIssue = useCallback(async (submission) => {
    if (!(await validateSchema({ submission, schema: issueSchema }))) {
      return;
    }

    if (
      !confirm(
        t(
          'Are you sure this is a new issue? Any data entered that is associated with incident records will not be added'
        )
      )
    ) {
      return;
    }

    setPromoting('issue');

    const {
      data: {
        promoteSubmissionToReport: { report_number },
      },
    } = await promoteSubmission({
      submission,
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: [],
          is_incident_report: false,
        },
      },
    });

    addToast({
      message: (
        <Trans i18n={i18n} ns="submitted" report_number={report_number}>
          Successfully promoted submission to Issue {{ report_number }}
        </Trans>
      ),
      severity: SEVERITY.success,
    });

    setPromoting('');
  }, []);

  const promoteToReport = useCallback(async (submission) => {
    if (!(await validateSchema({ submission, schema: reportSchema }))) {
      return;
    }

    if (
      !confirm(
        t('Sure you want to promote this Submission and link it to Incident {{ incident_id }}?', {
          incident_id: submission.incident_id,
        })
      )
    ) {
      return;
    }

    setPromoting('incident');

    const {
      data: {
        promoteSubmissionToReport: { report_number, incident_ids },
      },
    } = await promoteSubmission({
      submission,
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: submission.incident_ids,
          is_incident_report: true,
        },
      },
    });

    for (const incident_id of incident_ids) {
      addToast({
        message: (
          <Trans i18n={i18n} ns="submitted" incident_id={incident_id} report_number={report_number}>
            Successfully promoted submission to Incident {{ incident_id }} and Report{' '}
            {{ report_number }}
          </Trans>
        ),
        severity: SEVERITY.success,
      });
    }

    setPromoting('');
  }, []);

  const promoteToIncident = useCallback(async (submission) => {
    if (!(await validateSchema({ submission, schema: incidentSchema }))) {
      return;
    }

    if (
      !confirm(
        t(
          'Are you sure this is a new incident? This will create a permanent record with all the details you provided about the incident.'
        )
      )
    ) {
      return;
    }

    setPromoting('incident');

    const {
      data: {
        promoteSubmissionToReport: { report_number, incident_ids },
      },
    } = await promoteSubmission({
      submission,
      variables: {
        input: {
          submission_id: submission._id,
          incident_ids: [],
          is_incident_report: true,
        },
      },
    });

    const incident_id = incident_ids[0];

    addToast({
      message: (
        <Trans i18n={i18n} ns="submitted" incident_id={incident_id} report_number={report_number}>
          Successfully promoted submission to Incident {{ incident_id }} and Report{' '}
          {{ report_number }}
        </Trans>
      ),
      severity: SEVERITY.success,
    });

    setPromoting('');
  }, []);

  const rejectReport = async (submission) => {
    await deleteSubmission({ variables: { _id: submission._id } });
  };

  function StringCell({ cell }) {
    return (
      <div className="max-w-[450px] flex flex-col items-start">
        <div className="line-clamp-4 text-ellipsis" style={{ whiteSpace: 'break-spaces' }}>
          {cell.value}
        </div>
        {cell.value?.length > 130 && (
          <FontAwesomeIcon
            onClick={() => {
              setShowMoreInfoModal(true);
              setModalContent({
                title: cell.column.title,
                content: cell.value,
              });
            }}
            icon={faExpandAlt}
            className="mt-2 fas fa-expand-arrows-alt cursor-pointer"
          />
        )}
      </div>
    );
  }

  const columns = React.useMemo(() => {
    const columns = [
      {
        className: 'min-w-[240px]',
        title: t('Source Domain'),
        accessor: 'source_domain',
      },
      {
        className: 'min-w-[240px]',
        title: t('Authors'),
        accessor: 'authors',
      },
      {
        className: 'min-w-[240px]',
        title: t('Submitters'),
        accessor: 'submitters',
      },
      {
        title: t('Incident Date'),
        accessor: 'incident_date',
        Filter: SelectDatePickerFilter,
      },
      {
        title: t('Date Published'),
        accessor: 'date_published',
        Filter: SelectDatePickerFilter,
      },
      {
        title: t('Date Submitted'),
        accessor: 'date_submitted',
        Filter: SelectDatePickerFilter,
      },
      {
        title: t('Date Downloaded'),
        accessor: 'date_downloaded',
        Filter: SelectDatePickerFilter,
      },

      {
        title: t('Date Modified'),
        accessor: 'date_modified',
        Filter: SelectDatePickerFilter,
      },
      {
        className: 'w-[240px]',
        title: t('URL'),
        accessor: 'url',
      },
      {
        className: 'w-[240px]',
        title: t('Language'),
        accessor: 'language',
      },
      {
        className: 'w-[240px]',
        title: t('ID'),
        accessor: '_id',
      },
      {
        title: t('Alleged Deployer of AI System'),
        id: 'deployers',
        accessor: (data) => data.deployers?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
      {
        title: t('Alleged Developer of AI System'),
        id: 'developers',
        accessor: (data) => data.developers?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
      {
        title: t('Alleged Harmed or Nearly Harmed Parties'),
        id: 'harmed_parties',
        accessor: (data) => data.harmed_parties?.map((i) => `${i.name} ${i.id ?? i.entity_id}`),
        Cell: ListCell,
      },
      {
        className: 'min-w-[340px]',
        title: t('Text'),
        accessor: 'text',
        Cell: StringCell,
      },
      {
        className: 'min-w-[340px]',
        title: t('Editor Notes'),
        accessor: 'editor_notes',
        Cell: StringCell,
      },
    ];

    if (isRole('incident_editor')) {
      columns.push({
        title: t('Actions'),
        className: '',
        accessor: 'actions',
        Cell: ({ cell }) => {
          const incident_ids = cell.row.incident_ids ?? [];

          const isNewIncident = incident_ids.length === 0;

          return (
            <div className="flex gap-2">
              <Button
                color={'gray'}
                data-cy="edit-submission"
                onClick={() => {
                  setIsEditing(true);
                  setSubmission(cell.row.original);
                }}
                className="mr-4 text-xs md:text-base whitespace-nowrap"
              >
                Edit
              </Button>
              <Button
                color={'success'}
                data-cy="add-submission-issue"
                onClick={() => promoteToIssue(cell.row.original)}
                className="text-xs md:text-base whitespace-nowrap"
              >
                <Trans>Add as issue</Trans>
              </Button>

              <Button
                color={'success'}
                className="mr-2 text-xs md:text-base whitespace-nowrap"
                disabled={!isSubmitter || promoting}
                onClick={() =>
                  isNewIncident
                    ? promoteToIncident(cell.row.original)
                    : promoteToReport(cell.row.original)
                }
              >
                <div className="flex gap-2">
                  {promoting === 'incident' && <Spinner size="sm" />}
                  {isNewIncident ? (
                    <Trans ns="submitted">Add new Incident</Trans>
                  ) : incident_ids?.length == 1 ? (
                    <Trans ns="submitted" id={incident_ids[0]}>
                      Add to incident {{ id: incident_ids[0] }}
                    </Trans>
                  ) : (
                    <>
                      <Trans ns="submitted" ids={arrayToList(incident_ids || [])}>
                        Add to incidents {{ ids: arrayToList(incident_ids || []) }}
                      </Trans>
                    </>
                  )}
                </div>
              </Button>

              <Button
                color="failure"
                disabled={!isSubmitter || deleting || promoting}
                onClick={() => rejectReport(cell.row.original)}
                className="text-xs md:text-base whitespace-nowrap"
              >
                <div className="flex gap-2">
                  {deleting && <Spinner size="sm" />}
                  {isNewIncident ? (
                    <Trans ns="submitted">Reject New Incident</Trans>
                  ) : (
                    <Trans ns="submitted">Reject New Report</Trans>
                  )}
                </div>
              </Button>
            </div>
          );
        },
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
      <Table table={table} />

      <SubmissionEditModal
        show={isEditing}
        onHide={() => setIsEditing(false)}
        submissionId={submission?._id}
      />
      {showMoreInfoModal && (
        <Modal show={showMoreInfoModal} onClose={() => setShowMoreInfoModal(false)}>
          <Modal.Header>
            <h2>{modalContent.title}</h2>
          </Modal.Header>
          <Modal.Body>
            <div className="overflow-auto max-h-[400px]">{modalContent.content}</div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
}
