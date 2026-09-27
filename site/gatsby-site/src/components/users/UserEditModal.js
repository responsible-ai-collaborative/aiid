import React from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { Alert, Modal } from 'flowbite-react';
import { Formik } from 'formik';
import { Trans } from 'react-i18next';
import UserForm, { schema } from './UserForm';
import {
  FIND_USER,
  UPDATE_USER_API_ACCESS,
  UPDATE_USER_PROFILE,
  UPDATE_USER_ROLES,
} from '../../graphql/users';
import { FIND_API_USAGE_SUMMARIES } from '../../graphql/apiUsage';
import DefaultSkeleton from 'elements/Skeletons/Default';
import SubmitButton from 'components/ui/SubmitButton';
import useToastContext, { SEVERITY } from 'hooks/useToast';
import lodash from 'lodash';
import { useUserContext } from 'contexts/UserContext';

const supportedRoles = [
  { name: 'admin', description: 'All permissions' },
  {
    name: 'subscriber',
    description:
      'Can subscribe to incidents, entities, reports, and anything else that is subscribeable',
  },
  { name: 'submitter', description: 'Permitted to submit incidents under their user account' },
  { name: 'incident_editor', description: 'Can edit incidents' },
  { name: 'taxonomy_editor', description: 'Can edit all taxonomies' },
  { name: 'taxonomy_editor_{name}', description: 'Can edit the taxonomy with the specified name' },
];

const RolesTable = ({ roles }) => (
  <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
    <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
      <tr>
        <th scope="col" className="px-4 py-3">
          Role
        </th>
        <th scope="col" className="px-4 py-3">
          Description
        </th>
      </tr>
    </thead>
    <tbody>
      {roles.map((role) => (
        <tr key={role.name} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
          <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
            {role.name}
          </td>
          <td className="px-4 py-2">{role.description}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

/**
 * Read-only view of an account's recorded API usage, so an admin deciding whether
 * to block has the volume in front of them. SEE: server/apiUsage.ts
 */
function ApiUsageSummary({ usage }) {
  return (
    <div className="mt-4 border-t pt-3" data-cy="api-usage-summary">
      <h6 className="text-sm font-semibold mb-2">
        <Trans>API usage</Trans>
      </h6>
      {!usage ? (
        <p className="text-sm text-gray-500">
          <Trans>No API requests recorded for this account.</Trans>
        </p>
      ) : (
        <dl className="text-sm grid grid-cols-2 gap-x-4 gap-y-1">
          <dt className="text-gray-500">
            <Trans>Requests</Trans>
          </dt>
          <dd data-cy="api-usage-count">{usage.count.toLocaleString()}</dd>

          <dt className="text-gray-500">
            <Trans>Active days</Trans>
          </dt>
          <dd>{usage.activeDays.toLocaleString()}</dd>

          <dt className="text-gray-500">
            <Trans>Requests with errors</Trans>
          </dt>
          <dd>{usage.errorCount.toLocaleString()}</dd>

          <dt className="text-gray-500">
            <Trans>Refused while blocked</Trans>
          </dt>
          <dd>{usage.deniedCount.toLocaleString()}</dd>

          <dt className="text-gray-500">
            <Trans>First request</Trans>
          </dt>
          <dd>{usage.firstRequestAt ? new Date(usage.firstRequestAt).toLocaleString() : '—'}</dd>

          <dt className="text-gray-500">
            <Trans>Last request</Trans>
          </dt>
          <dd>{usage.lastRequestAt ? new Date(usage.lastRequestAt).toLocaleString() : '—'}</dd>
        </dl>
      )}
    </div>
  );
}

export default function UserEditModal({ show, onClose, userId, alertTitle = '', alertText = '' }) {
  const {
    data: userData,
    loading,
    error,
  } = useQuery(FIND_USER, {
    variables: { filter: { userId: { EQ: userId } } },
  });

  const { isRole } = useUserContext();

  const [updateUserRoles] = useMutation(UPDATE_USER_ROLES);

  const [updateUserProfile] = useMutation(UPDATE_USER_PROFILE);

  const [updateUserApiAccess] = useMutation(UPDATE_USER_API_ACCESS);

  // Usage is admin-only server-side (SEE: server/fields/apiUsage.ts), so it is
  // only requested when the viewer is an admin.
  const { data: usageData } = useQuery(FIND_API_USAGE_SUMMARIES, {
    variables: { userId },
    skip: !isRole('admin') || !userId,
  });

  const usage = usageData?.apiUsageSummaries?.[0];

  const addToast = useToastContext();

  const handleSubmit = async (values) => {
    try {
      if (!lodash.isEqual(values.roles, userData.user.roles)) {
        await updateUserRoles({ variables: { roles: values.roles, userId } });
      }

      await updateUserProfile({
        variables: {
          userId,
          first_name: values.first_name,
          last_name: values.last_name,
        },
      });

      const blocked = Boolean(values.api_access_blocked);

      const wasBlocked = Boolean(userData.user.api_access_blocked);

      const reason = values.api_access_blocked_reason || null;

      // Records when access was withdrawn: stamped as the block goes on, left alone
      // while it stays on (so editing the reason does not reset the date), and
      // cleared on unblock so a stale timestamp cannot be read as a current one.
      let blockedAt = null;

      if (blocked) {
        blockedAt = wasBlocked ? userData.user.api_access_blocked_at : new Date().toISOString();
      }

      if (blocked !== wasBlocked || reason !== (userData.user.api_access_blocked_reason || null)) {
        await updateUserApiAccess({
          variables: {
            userId,
            api_access_blocked: blocked,
            api_access_blocked_at: blockedAt,
            api_access_blocked_reason: blocked ? reason : null,
          },
        });
      }

      addToast({
        message: <>User updated.</>,
        severity: SEVERITY.success,
      });

      onClose();
    } catch (e) {
      addToast({
        message: <>Error updating user.</>,
        severity: SEVERITY.danger,
        error: e,
      });
    }
  };

  return (
    <Modal show={show} onClose={onClose} data-testid="edit-user-modal" size="lg">
      <Modal.Header>
        <Trans>Edit</Trans>
      </Modal.Header>

      {error && (
        <Modal.Body>
          <Alert color="failure">
            <h5 className="font-bold">Error</h5>
            <span>{error.message}</span>
          </Alert>
        </Modal.Body>
      )}

      {loading && (
        <Modal.Body>
          <DefaultSkeleton />
        </Modal.Body>
      )}

      {userData?.user && (
        <Formik
          initialValues={{ ...userData.user }}
          validationSchema={schema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid, submitForm }) => (
            <>
              <Modal.Body>
                {(alertTitle || alertText) && (
                  <Alert color="info" className="mb-4">
                    <h5>{alertTitle}</h5>
                    <span>{alertText}</span>
                  </Alert>
                )}
                <UserForm />
                {isRole('admin') && <ApiUsageSummary usage={usage} />}
                {isRole('admin') && (
                  <details>
                    <summary className="cursor-pointer text-sm">Supported Roles</summary>
                    <div className="mt-2">
                      <RolesTable roles={supportedRoles} />
                    </div>
                  </details>
                )}
              </Modal.Body>
              <Modal.Footer>
                <SubmitButton
                  loading={isSubmitting}
                  disabled={!isValid}
                  onClick={() => submitForm()}
                >
                  Submit
                </SubmitButton>
              </Modal.Footer>
            </>
          )}
        </Formik>
      )}
    </Modal>
  );
}
