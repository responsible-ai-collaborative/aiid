import React, { useState, useEffect } from 'react';
import { Modal, Spinner, Button } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { MERGE_ENTITIES, FIND_ENTITY } from '../../graphql/entities';
import { useLazyQuery, useMutation } from '@apollo/client/react/hooks';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { ExternalLink } from 'react-feather';

export default function SimilarMergeModal({
  show,
  onClose,
  primaryId,
  secondaryId,
  onMergeComplete,
}) {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const [keepSide, setKeepSide] = useState('left');

  const [loadPrimary, { data: primaryData, loading: loadingPrimary }] = useLazyQuery(FIND_ENTITY);

  const [loadSecondary, { data: secondaryData, loading: loadingSecondary }] =
    useLazyQuery(FIND_ENTITY);

  useEffect(() => {
    if (primaryId) {
      console.log('Loading primary entity with ID:', primaryId);
      loadPrimary({ variables: { filter: { entity_id: { EQ: primaryId } } } });
    }
  }, [primaryId, loadPrimary]);

  useEffect(() => {
    if (secondaryId) {
      loadSecondary({ variables: { filter: { entity_id: { EQ: secondaryId } } } });
    }
  }, [secondaryId, loadSecondary]);

  const loadingEntities = loadingPrimary || loadingSecondary;

  const [mergeEntities, { loading: merging }] = useMutation(MERGE_ENTITIES);

  const primaryEntityName = primaryData?.entity?.name || '';

  const secondaryEntityName = secondaryData?.entity?.name || '';

  const keptEntityName = keepSide === 'left' ? primaryEntityName : secondaryEntityName;

  const deletedEntityName = keepSide === 'left' ? secondaryEntityName : primaryEntityName;

  const confirmMerge = async () => {
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
    } catch (error) {
      if (error instanceof Error) {
        addToast({
          message: t('Error merging entities') + `:${error.message}`,
          severity: SEVERITY.danger,
          error,
        });
      } else {
        addToast({ message: t('Error merging entities'), severity: SEVERITY.danger, error });
      }
    } finally {
      onClose();
    }
  };

  const handleMergeClick = () => {
    const message = t(
      'Are you sure you want to merge entity "{{deleted}}" into "{{kept}}"? \n\nThis operation is not reversible.',
      { deleted: deletedEntityName, kept: keptEntityName }
    );

    if (window.confirm(message)) {
      confirmMerge();
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
                className={`flex flex-col items-start p-4 border rounded cursor-pointer ${
                  keepSide === 'left' ? 'border-blue-500 border-2' : ''
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="keep"
                    value="left"
                    checked={keepSide === 'left'}
                    onChange={() => setKeepSide('left')}
                    className="mr-2"
                  />
                  <span className="font-medium">{primaryEntityName}</span>
                </div>
                <a
                  href={`/entities/${primaryId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 mt-2 hover:underline flex items-center"
                >
                  {`/${primaryId}`}
                  <ExternalLink size={14} className="ml-1" />
                </a>
              </label>
              <label
                className={`flex flex-col items-start p-4 border rounded cursor-pointer ${
                  keepSide === 'right' ? 'border-blue-500 border-2' : ''
                }`}
              >
                <div className="flex items-center">
                  <input
                    type="radio"
                    name="keep"
                    value="right"
                    checked={keepSide === 'right'}
                    onChange={() => setKeepSide('right')}
                    className="mr-2"
                  />
                  <span className="font-medium">{secondaryEntityName}</span>
                </div>
                <a
                  href={`/entities/${secondaryId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-gray-600 mt-2 hover:underline flex items-center"
                >
                  {`/${secondaryId}`}
                  <ExternalLink size={14} className="ml-1" />
                </a>
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
        <Button onClick={handleMergeClick} disabled={merging}>
          {merging ? <Spinner size="sm" /> : <Trans>Merge</Trans>}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
