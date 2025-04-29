import React, { useEffect, useState } from 'react';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner, Modal } from 'flowbite-react';
import { MERGE_ENTITIES, SIMILAR_ENTITIES } from '../../graphql/entities';
import { useQuery, useMutation } from '@apollo/client/react/hooks';
import { useTranslation, Trans } from 'react-i18next';
import { useUserContext } from 'contexts/UserContext';

function MergeEntitiesPage() {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const { isRole, loading: loadingAuth } = useUserContext();

  const [threshold, setThreshold] = useState(80);

  const { data: similarData, loading: loadingSimilar } = useQuery(SIMILAR_ENTITIES, {
    variables: { threshold },
  });

  const rawPairs = similarData?.similarEntities || [];

  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    if (!loadingSimilar && rawPairs.length) {
      setPairs(
        rawPairs.map((p) => ({
          primary: { id: p.entityId1, label: p.entityName1 },
          secondary: { id: p.entityId2, label: p.entityName2 },
          score: p.similarity / 100,
        }))
      );
    }
  }, [loadingSimilar, rawPairs]);

  const [mergeEntities, { loading: merging }] = useMutation(MERGE_ENTITIES);

  const [modalOpen, setModalOpen] = useState(false);

  const [modalPair, setModalPair] = useState(null);

  const [keepSide, setKeepSide] = useState('left');

  const openModal = (pair) => {
    setModalPair(pair);
    setKeepSide('left');
    setModalOpen(true);
  };

  const confirmMerge = async () => {
    if (!modalPair) return;
    const primary = keepSide === 'left' ? modalPair.primary : modalPair.secondary;

    const secondary = keepSide === 'left' ? modalPair.secondary : modalPair.primary;

    try {
      await mergeEntities({
        variables: {
          primaryId: primary.id,
          secondaryId: secondary.id,
          keepEntity: keepSide === 'left' ? 1 : 2,
        },
      });
      addToast({
        message: t('Merged {{secondary}} into {{primary}}', {
          secondary: secondary.label,
          primary: primary.label,
        }),
        severity: SEVERITY.success,
      });
      setPairs((prev) =>
        prev.filter((p) => !(p.primary.id === primary.id && p.secondary.id === secondary.id))
      );
    } catch (error) {
      addToast({ message: t('Error merging entities'), severity: SEVERITY.danger, error });
    }
    setModalOpen(false);
    setModalPair(null);
  };

  if (loadingAuth || loadingSimilar) {
    return <Spinner />;
  }

  if (!isRole('incident_editor')) {
    return <div>Not enough permissions</div>;
  }

  return (
    <div className="w-full">
      <h1 className="mb-5">
        <Trans>Merge Entities</Trans>
      </h1>
      {loadingSimilar ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-4">
            <label className="block mb-1">
              {t('Similarity Threshold')} ({threshold}%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={threshold}
              onChange={(e) => setThreshold(parseInt(e.target.value, 10))}
              className="w-full"
            />
          </div>
          {pairs.length === 0 && <div>{t('No similar entities found')}</div>}
          {pairs.slice(0, 20).map((p) => (
            <div
              key={`${p.primary.id}-${p.secondary.id}`}
              className="flex justify-between items-center mb-2"
            >
              <span>
                {p.primary.label} ↔ {p.secondary.label} ({(p.score * 100).toFixed(1)}%)
              </span>
              <Button onClick={() => openModal(p)} disabled={merging} className="ml-2">
                {merging ? <Spinner size="sm" /> : <Trans>Merge</Trans>}
              </Button>
            </div>
          ))}

          <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
            <Modal.Header>
              <Trans>Select entity to keep</Trans>
            </Modal.Header>
            <Modal.Body>
              <div className="grid grid-cols-2 gap-4">
                <label className="flex flex-col items-center p-4 border rounded cursor-pointer">
                  <input
                    type="radio"
                    name="keep"
                    value="left"
                    checked={keepSide === 'left'}
                    onChange={() => setKeepSide('left')}
                    className="mb-2"
                  />
                  {modalPair?.primary.label}
                </label>
                <label className="flex flex-col items-center p-4 border rounded cursor-pointer">
                  <input
                    type="radio"
                    name="keep"
                    value="right"
                    checked={keepSide === 'right'}
                    onChange={() => setKeepSide('right')}
                    className="mb-2"
                  />
                  {modalPair?.secondary.label}
                </label>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button color="gray" onClick={() => setModalOpen(false)}>
                <Trans>Cancel</Trans>
              </Button>
              <Button onClick={confirmMerge} disabled={merging}>
                {merging ? <Spinner size="sm" /> : <Trans>Confirm Merge</Trans>}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
    </div>
  );
}

export default MergeEntitiesPage;
