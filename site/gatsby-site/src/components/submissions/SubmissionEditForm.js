import { Badge, Button, Card, Checkbox, Dropdown, Label, Select } from 'flowbite-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import SubmissionForm from './SubmissionForm';
import { useFormikContext } from 'formik';
import RelatedIncidents from 'components/RelatedIncidents';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import { useMutation } from '@apollo/client';
import { DELETE_SUBMISSION, PROMOTE_SUBMISSION } from '../../graphql/submissions';
import { incidentSchema, issueSchema, reportSchema } from './schemas';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBarsProgress,
  faCheck,
  faPlusSquare,
  faUser,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';
import { debounce } from 'debounce';
import { STATUS } from 'utils/submissions';
import StepContainer from 'components/forms/SubmissionWizard/StepContainer';
import { useUserContext } from 'contexts/userContext';
import { UPSERT_SUBSCRIPTION } from '../../graphql/subscriptions';
import { SUBSCRIPTION_TYPE } from 'utils/subscriptions';
import isEmpty from 'lodash/isEmpty';
import useLocalizePath from 'components/i18n/useLocalizePath';
import { DropdownItem } from 'flowbite-react/lib/esm/components/Dropdown/DropdownItem';

const SubmissionEditForm = ({ handleSubmit, saving, setSaving, userLoading, userData }) => {
  const [promoting, setPromoting] = useState('');

  const [deleting, setDeleting] = useState(false);

  const { values, touched, setFieldValue, setFieldTouched } = useFormikContext();

  const isNewIncident = !values.incident_ids || values.incident_ids.length === 0;

  const [promoType, setPromoType] = useState('none');

  const localizedPath = useLocalizePath();

  useEffect(() => {
    if (!isEmpty(touched)) {
      setSaving(true);
      saveChanges(values);
    }
  }, [values, touched]);

  const saveChanges = useRef(
    debounce(async (values) => {
      await handleSubmit(values);
      setSaving(false);
    }, 1000)
  ).current;

  const addToast = useToastContext();

  const { i18n, t } = useTranslation(['submitted', 'validation']);

  const [promoteSubmissionToReport] = useMutation(PROMOTE_SUBMISSION, {
    fetchPolicy: 'network-only',
  });

  const [subscribeToNewReportsMutation] = useMutation(UPSERT_SUBSCRIPTION);

  const [deleteSubmission] = useMutation(DELETE_SUBMISSION, {
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

  const { user, isRole } = useUserContext();

  const canEditSubmissions = isRole('submitter') || isRole('incident_editor') || isRole('admin');

  const subscribeToNewReports = async (incident_id) => {
    if (user) {
      await subscribeToNewReportsMutation({
        variables: {
          filter: {
            type: { EQ: SUBSCRIPTION_TYPE.incident },
            userId: { EQ: user.id },
            incident_id: { EQ: incident_id },
          },
          update: {
            type: SUBSCRIPTION_TYPE.incident,
            userId: {
              link: user.id,
            },
            incident_id: {
              link: incident_id,
            },
          },
        },
      });
    }
  };

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

  const promoteToIssue = useCallback(async () => {
    if (!(await validateSchema({ submission: values, schema: issueSchema }))) {
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
      submission: values,
      variables: {
        input: {
          submission_id: values._id,
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
    setTimeout(() => {
      window.location.href = localizedPath({ path: '/apps/submitted' });
    }, 1000);
  }, [values]);

  const promoteToIncident = useCallback(async () => {
    if (!(await validateSchema({ submission: values, schema: incidentSchema }))) {
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
      submission: values,
      variables: {
        input: {
          submission_id: values._id,
          incident_ids: [],
          is_incident_report: true,
        },
      },
    });

    const incident_id = incident_ids[0];

    await subscribeToNewReports(incident_id);

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
    setTimeout(() => {
      window.location.href = localizedPath({ path: '/apps/submitted' });
    }, 1000);
  }, [values]);

  const promoteToReport = useCallback(async () => {
    if (!(await validateSchema({ submission: values, schema: reportSchema }))) {
      return;
    }

    if (
      !confirm(
        t('Sure you want to promote this Submission and link it to Incident {{ incident_id }}?', {
          incident_id: values.incident_id,
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
      submission: values,
      variables: {
        input: {
          submission_id: values._id,
          incident_ids: values.incident_ids || [],
          is_incident_report: true,
        },
      },
    });

    for (const incident_id of incident_ids) {
      await subscribeToNewReports(incident_id);

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
    setTimeout(() => {
      window.location.href = localizedPath({ path: '/apps/submitted' });
    }, 1000);
  }, [values]);

  const rejectReport = async () => {
    await deleteSubmission({ variables: { _id: values._id } });
  };

  const promote = () => {
    if (promoType === 'incident') {
      promoteToIncident();
    } else if (promoType === 'issue') {
      promoteToIssue();
    }
  };

  const reject = async () => {
    if (
      !confirm(
        t(
          'Are you sure you want to reject this submission? This will permanently delete the submission.'
        )
      )
    ) {
      return;
    }
    setDeleting(true);
    await rejectReport();
    setDeleting(false);
    setTimeout(() => {
      window.location.href = localizedPath({ path: '/apps/submitted' });
    }, 1000);
  };

  const [selectedOptions, setSelectedOptions] = useState(values.incident_editors || []);

  const handleSelect = (checked, userId) => {
    let userInfo = userData.users.find((user) => user.userId === userId);

    userInfo = {
      userId: userInfo.userId,
      first_name: userInfo.first_name,
      last_name: userInfo.last_name,
    };
    let selectedOptions = [...values.incident_editors];

    if (checked) {
      selectedOptions = [...selectedOptions, userInfo];
    } else {
      selectedOptions = selectedOptions.filter((option) => option.userId !== userId);
    }
    setSelectedOptions(selectedOptions);

    setFieldValue('incident_editors', selectedOptions);
    setFieldTouched('incident_editors', true);
  };

  return (
    <>
      <StepContainer className="md:w-2/3" childClassName="h-[calc(100vh-230px)] overflow-auto p-6">
        <Badge
          className={`absolute -top-3 z-10 ${
            values.status
              ? STATUS[values.status].color
              : 'bg-orange-100 text-orange-800 dark:bg-orange-200 dark:text-orange-900'
          }`}
        >
          <Trans i18n={i18n} ns="submitted">
            {values.status ? STATUS[values.status].text : STATUS.pendingReview.text}
          </Trans>
        </Badge>
        <SubmissionForm />
        <RelatedIncidents incident={values} setFieldValue={setFieldValue} />
      </StepContainer>
      <div className="flex md:w-1/3 pt-8 pb-6 pl-6 items-center flex-col justify-between">
        <div className="flex w-full flex-col gap-6">
          <div className="flex flex-col w-full items-center gap-2">
            <Label>
              <FontAwesomeIcon icon={faUser} className="mr-2" />
              <Trans i18n={i18n} ns="submitted">
                Editors
              </Trans>
            </Label>
            <div className="editors-dropdown">
              {!userLoading && (
                <Dropdown label={t('Editors')} color={'light'}>
                  {userData.users
                    .filter((user) => user.first_name || user.last_name)
                    .map((user) => {
                      const isChecked =
                        selectedOptions.findIndex((editor) => editor.userId === user.userId) > -1;

                      return (
                        <DropdownItem key={`editors-${user.userId}`}>
                          <div className="flex justify-center items-center gap-2">
                            <Checkbox
                              id={`checkbox-${user.userId}`}
                              checked={isChecked}
                              onClick={(ev) => handleSelect(ev.target.checked, user.userId)}
                            />
                            <Label htmlFor={`checkbox-${user.userId}`}>
                              {user.first_name} {user.last_name}
                            </Label>
                          </div>
                        </DropdownItem>
                      );
                    })}
                </Dropdown>
              )}
            </div>
          </div>

          <div className="flex flex-col w-full items-center gap-2">
            <Label>
              <FontAwesomeIcon icon={faBarsProgress} className="mr-2" />
              <Trans i18n={i18n} ns="submitted">
                Status
              </Trans>
            </Label>
            <Select
              className="w-full"
              value={values.status || 'inReview'}
              onChange={(e) => {
                setSaving(true);
                saveChanges({ ...values, status: e.target.value });
                setFieldValue('status', e.target.value);
              }}
              data-cy="status-select"
            >
              <option value={STATUS.inReview.name} data-cy="status-in-review">
                <Trans i18n={i18n} ns="submitted">
                  {STATUS.inReview.text}
                </Trans>
              </option>
              <option value={STATUS.pendingReview.name} data-cy="status-pending-review">
                <Trans i18n={i18n} ns="submitted">
                  {STATUS.pendingReview.text}
                </Trans>
              </option>
            </Select>
          </div>
        </div>
        <Card className="w-full mt-4">
          {!isNewIncident && (
            <div className="flex flex-col gap-2 w-full mb-2">
              <Button
                onClick={promoteToReport}
                disabled={!canEditSubmissions || deleting || promoting || saving}
                data-cy="promote-to-report-button"
              >
                <FontAwesomeIcon className="mr-2" icon={faCheck} />
                <Trans ns="submitted" id={values.incident_ids[0]}>
                  Add to incident {{ id: values.incident_ids[0] }}
                </Trans>
              </Button>
            </div>
          )}
          <div className="flex flex-col gap-3">
            <Label className="text-center">
              <FontAwesomeIcon icon={faPlusSquare} className="mr-2" />
              <Trans i18n={i18n} ns="submitted">
                Add as new
              </Trans>
            </Label>
            <Select
              defaultValue={promoType}
              className="w-full"
              onChange={(e) => setPromoType(e.target.value)}
              data-cy="promote-select"
            >
              <option value={'none'}>Choose an option</option>
              {isNewIncident && (
                <option value={'incident'} data-cy="promote-incident">
                  <Trans>Incident</Trans>
                </option>
              )}
              <option value={'issue'} data-cy="promote-issue">
                <Trans>Issue</Trans>
              </option>
            </Select>
            <Button
              onClick={promote}
              disabled={
                !canEditSubmissions || deleting || promoting || saving || promoType === 'none'
              }
              data-cy="promote-button"
            >
              <FontAwesomeIcon className="mr-2" icon={faCheck} />
              <Trans i18n={i18n} ns="submitted">
                {promoting ? `Adding as ${promoting}...` : 'Accept'}
              </Trans>
            </Button>

            <Button
              color={'failure'}
              onClick={reject}
              disabled={!canEditSubmissions || deleting || promoting || saving}
              data-cy="reject-button"
            >
              <FontAwesomeIcon className="mr-2" icon={faXmark} />
              <Trans i18n={i18n} ns="submitted">
                {deleting ? 'Deleting...' : 'Reject'}
              </Trans>
            </Button>
          </div>
          {promoting !== '' && (
            <Trans i18n={i18n} ns="submitted">
              Promoting to {promoting}
            </Trans>
          )}
        </Card>
      </div>
    </>
  );
};

export default SubmissionEditForm;
