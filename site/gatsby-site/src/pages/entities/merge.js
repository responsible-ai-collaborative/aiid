import React, { useEffect, useState } from 'react';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner, Modal, Card } from 'flowbite-react';
import { MERGE_ENTITIES, SIMILAR_ENTITIES, FIND_ENTITIES } from '../../graphql/entities';
import { useQuery, useMutation } from '@apollo/client/react/hooks';
import { useTranslation, Trans } from 'react-i18next';
import { useUserContext } from 'contexts/UserContext';

function MergeEntitiesPage() {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const { isRole, loading: loadingAuth } = useUserContext();

  const [threshold, setThreshold] = useState(80);

  const [inputThreshold, setInputThreshold] = useState(threshold);

  const PAGE_SIZE = 1000;

  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const {
    data: similarData,
    loading: loadingSimilar,
    error: loadingError,
    fetchMore,
  } = useQuery(SIMILAR_ENTITIES, {
    variables: { threshold, offset: 0, limit: PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });

  const { data: allEntitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const [selectedPrimary, setSelectedPrimary] = useState('');

  const [selectedSecondary, setSelectedSecondary] = useState('');

  useEffect(() => {
    if (loadingError) {
      addToast({
        message: t('Error loading similar entities'),
        severity: SEVERITY.danger,
        error: loadingError,
      });
    }
  }, [loadingError, addToast, t]);

  const [pairs, setPairs] = useState([]);

  useEffect(() => {
    if (!loadingSimilar && similarData?.similarEntities) {
      setPairs(
        similarData.similarEntities.map((p) => ({
          primary: { id: p.entityId1, label: p.entityName1 },
          secondary: { id: p.entityId2, label: p.entityName2 },
          score: p.similarity / 100,
        }))
      );
    }
  }, [loadingSimilar, similarData]);

  useEffect(() => {
    setInputThreshold(threshold);
  }, [threshold]);

  const [mergeEntities, { loading: merging }] = useMutation(MERGE_ENTITIES);

  const [modalOpen, setModalOpen] = useState(false);

  const [modalPair, setModalPair] = useState(null);

  const [keepSide, setKeepSide] = useState('left');

  const openModal = (pair) => {
    setModalPair(pair);
    setKeepSide('left');
    setSelectedPrimary(pair.primary.id);
    setSelectedSecondary(pair.secondary.id);
    setModalOpen(true);
  };

  const confirmMerge = async () => {
    if (!modalPair) return;
    const primaryId = selectedPrimary;

    const secondaryId = selectedSecondary;

    const primaryEntity = allEntitiesData.entities.find((e) => e.entity_id === primaryId);

    const secondaryEntity = allEntitiesData.entities.find((e) => e.entity_id === secondaryId);

    const keepEntityInt = keepSide === 'left' ? 1 : 2;

    try {
      await mergeEntities({ variables: { primaryId, secondaryId, keepEntity: keepEntityInt } });
      addToast({
        message: t('Merged {{secondary}} into {{primary}}', {
          secondary: secondaryEntity?.name,
          primary: primaryEntity?.name,
        }),
        severity: SEVERITY.success,
      });
      setPairs((prev) =>
        prev.filter(
          (p) =>
            !(p.primary.id === modalPair.primary.id && p.secondary.id === modalPair.secondary.id)
        )
      );
    } catch (error) {
      addToast({ message: t('Error merging entities'), severity: SEVERITY.danger, error });
    }
    setModalOpen(false);
    setModalPair(null);
  };

  // Load more similar entities
  const loadMore = async () => {
    setLoadingMore(true);
    try {
      const currentCount = similarData.similarEntities.length;

      const { data: moreData } = await fetchMore({
        variables: { threshold, offset: currentCount, limit: PAGE_SIZE },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            similarEntities: [...prev.similarEntities, ...fetchMoreResult.similarEntities],
          };
        },
      });

      if (moreData.similarEntities.length < PAGE_SIZE) setHasMore(false);
    } catch (err) {
      // optionally handle load more error
    } finally {
      setLoadingMore(false);
    }
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
          <Card className="mb-4">
            <label className="block mb-1">
              {t('Similarity Threshold')} ({threshold}%)
            </label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                min={0}
                max={100}
                value={inputThreshold}
                onChange={(e) => setInputThreshold(parseInt(e.target.value, 10) || 0)}
                className="border rounded px-2 py-1 w-20"
              />
              <Button
                onClick={() => {
                  setThreshold(inputThreshold);
                  setHasMore(true);
                }}
              >
                {t('Update')}
              </Button>
            </div>
          </Card>
          {pairs.length === 0 && <div>{t('No similar entities found')}</div>}
          {pairs.map((p) => (
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
          {hasMore && (
            <div className="text-center mt-4">
              <Button onClick={loadMore} disabled={loadingMore}>
                {loadingMore ? <Spinner size="sm" /> : <Trans>Load more</Trans>}
              </Button>
            </div>
          )}
          <Modal show={modalOpen} onClose={() => setModalOpen(false)}>
            <Modal.Header>
              <Trans>Select entities and keep one</Trans>
            </Modal.Header>
            <Modal.Body>
              {loadingEntities ? (
                <Spinner />
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block mb-1">{t('Entity 1')}</label>
                      <select
                        value={selectedPrimary}
                        onChange={(e) => setSelectedPrimary(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      >
                        {allEntitiesData.entities.map((e) => (
                          <option key={e.entity_id} value={e.entity_id}>
                            {e.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1">{t('Entity 2')}</label>
                      <select
                        value={selectedSecondary}
                        onChange={(e) => setSelectedSecondary(e.target.value)}
                        className="border rounded px-2 py-1 w-full"
                      >
                        {allEntitiesData.entities.map((e) => (
                          <option key={e.entity_id} value={e.entity_id}>
                            {e.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <label className="flex items-center p-4 border rounded cursor-pointer">
                      <input
                        type="radio"
                        name="keep"
                        value="left"
                        checked={keepSide === 'left'}
                        onChange={() => setKeepSide('left')}
                        className="mr-2"
                      />
                      {allEntitiesData.entities.find((e) => e.entity_id === selectedPrimary)?.name}
                    </label>
                    <label className="flex items-center p-4 border rounded cursor-pointer">
                      <input
                        type="radio"
                        name="keep"
                        value="right"
                        checked={keepSide === 'right'}
                        onChange={() => setKeepSide('right')}
                        className="mr-2"
                      />
                      {
                        allEntitiesData.entities.find((e) => e.entity_id === selectedSecondary)
                          ?.name
                      }
                    </label>
                  </div>
                </>
              )}
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
