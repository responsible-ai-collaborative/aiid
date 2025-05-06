import React, { useState } from 'react';
import { Modal, Spinner, Button } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { MERGE_ENTITIES, FIND_ENTITIES } from '../../graphql/entities';
import { useQuery, useMutation } from '@apollo/client/react/hooks';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

export default function SimilarMergeModal({
  show,
  onClose,
  primaryId,
  secondaryId,
  onMergeComplete,
}) {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const [selectedPrimary] = useState(primaryId);

  const [selectedSecondary] = useState(secondaryId);

  const [keepSide, setKeepSide] = useState('left');

  const { data: allEntitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const [mergeEntities, { loading: merging }] = useMutation(MERGE_ENTITIES);

  const entities = allEntitiesData?.entities || [];

  // Get entity names for display
  const primaryEntityName = entities.find((e) => e.entity_id === selectedPrimary)?.name || '';

  const secondaryEntityName = entities.find((e) => e.entity_id === selectedSecondary)?.name || '';

  // Determine which entity will be kept and which will be deleted based on keepSide
  const keptEntityName = keepSide === 'left' ? primaryEntityName : secondaryEntityName;

  const deletedEntityName = keepSide === 'left' ? secondaryEntityName : primaryEntityName;

  const confirmMerge = async () => {
    const primaryId = selectedPrimary;

    const secondaryId = selectedSecondary;

    const keepEntityInt = keepSide === 'left' ? 1 : 2;

    try {
      await mergeEntities({ variables: { primaryId, secondaryId, keepEntity: keepEntityInt } });

      addToast({
        message: t('Merged {{secondary}} into {{primary}}', {
          secondary: secondaryEntityName,
          primary: primaryEntityName,
        }),
        severity: SEVERITY.success,
      });

      if (onMergeComplete) {
        onMergeComplete(primaryId, secondaryId);
      }

      onClose();
    } catch (error) {
      addToast({ message: t('Error merging entities'), severity: SEVERITY.danger, error });
    }
  };

  return (
    <Modal show={show} onClose={onClose}>
      <Modal.Header>
        <Trans>Merge Duplicate Entities</Trans>
      </Modal.Header>
      <Modal.Body>
        {loadingEntities ? (
          <Spinner />
        ) : (
          <>
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-0 mt-0">
                <Trans>Select which entity to keep:</Trans>
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <label
                className={`items-center p-4 border rounded cursor-pointer ${
                  keepSide === 'left' ? 'border-blue-500 border-2' : ''
                }`}
              >
                <input
                  type="radio"
                  name="keep"
                  value="left"
                  checked={keepSide === 'left'}
                  onChange={() => setKeepSide('left')}
                  className="mr-2"
                />
                {primaryEntityName}
              </label>
              <label
                className={`items-center p-4 border rounded cursor-pointer ${
                  keepSide === 'right' ? 'border-blue-500 border-2' : ''
                }`}
              >
                <input
                  type="radio"
                  name="keep"
                  value="right"
                  checked={keepSide === 'right'}
                  onChange={() => setKeepSide('right')}
                  className="mr-2"
                />
                {secondaryEntityName}
              </label>
            </div>
            <div className="mt-4">
              <p className="font-medium text-red-600 mb-2">
                <Trans>
                  Warning: This will delete entity &ldquo;{deletedEntityName}&rdquo; and update all
                  references to use &ldquo;{keptEntityName}&rdquo;.
                </Trans>
              </p>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button color="gray" onClick={onClose}>
          <Trans>Cancel</Trans>
        </Button>
        <Button onClick={confirmMerge} disabled={merging}>
          {merging ? <Spinner size="sm" /> : <Trans>Confirm Merge</Trans>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
