import React, { useEffect, useState } from 'react';
import useToastContext, { SEVERITY } from '../../hooks/useToast';
import { Button, Spinner, Card } from 'flowbite-react';
import { SIMILAR_ENTITIES } from '../../graphql/entities';
import { useQuery } from '@apollo/client/react/hooks';
import { useTranslation, Trans } from 'react-i18next';
import { useUserContext } from 'contexts/UserContext';
import SimilarMergeModal from 'components/entities/SimilarMergeModal';
import AnyMerge from 'components/entities/AnyMerge';

function MergeEntitiesPage() {
  const { t } = useTranslation('entities');

  const addToast = useToastContext();

  const { isRole, loading: loadingAuth } = useUserContext();

  const [threshold, setThreshold] = useState(90);

  const [inputThreshold, setInputThreshold] = useState(threshold);

  const PAGE_SIZE = 1000;

  const [loadingMore, setLoadingMore] = useState(false);

  const [hasMore, setHasMore] = useState(true);

  const {
    data: similarData,
    loading: loadingSimilar,
    error: loadingError,
    fetchMore,
    refetch,
  } = useQuery(SIMILAR_ENTITIES, {
    variables: { threshold, offset: 0, limit: PAGE_SIZE },
    notifyOnNetworkStatusChange: true,
  });

  const [modalOpen, setModalOpen] = useState(false);

  const [modalPair, setModalPair] = useState(null);

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
    if (!loadingSimilar && similarData?.similarEntities && pairs.length === 0) {
      setPairs(
        similarData.similarEntities.pairs.map((p) => ({
          primary: { id: p.entityId1, label: p.entityName1 },
          secondary: { id: p.entityId2, label: p.entityName2 },
          score: p.similarity / 100,
        }))
      );
      setHasMore(similarData.similarEntities.hasMore);
    }
  }, [loadingSimilar, similarData, pairs.length]);

  useEffect(() => {
    setInputThreshold(threshold);
  }, [threshold]);

  const openModal = (pair) => {
    setModalPair(pair);
    setModalOpen(true);
  };

  const handleMergeComplete = async () => {
    setPairs([]);
    setHasMore(true);

    await refetch({ threshold, offset: 0, limit: PAGE_SIZE });

    setModalOpen(false);
    setModalPair(null);
  };

  const loadMore = async () => {
    setLoadingMore(true);

    const currentCount = pairs.length;

    const { data: moreData } = await fetchMore({
      variables: { threshold, offset: currentCount, limit: PAGE_SIZE },
    });

    const newPairs = moreData.similarEntities.pairs.map((p) => ({
      primary: { id: p.entityId1, label: p.entityName1 },
      secondary: { id: p.entityId2, label: p.entityName2 },
      score: p.similarity / 100,
    }));

    setPairs((prev) => [...prev, ...newPairs]);
    setHasMore(moreData.similarEntities.hasMore);

    setLoadingMore(false);
  };

  if (loadingAuth || (!similarData && loadingSimilar)) {
    return <Spinner />;
  }

  if (!isRole('incident_editor')) {
    return <div>Not enough permissions</div>;
  }

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold mb-5">
        <Trans ns="entities">Entity Merge Tool</Trans>
      </h1>
      {loadingSimilar && pairs.length === 0 ? (
        <Spinner />
      ) : (
        <>
          {/* Merge any entity section */}
          <section className="mb-8">
            <AnyMerge />
          </section>
          {/* Duplicate candidates section */}
          <section className="mb-8">
            <Card className="mb-4">
              <h2 className="text-xl font-semibold mb-2">
                <Trans ns="entities">Potential Duplicate Entities</Trans>
              </h2>
              <p className="text-sm text-gray-600 mb-0 mt-0">
                {t(
                  'This list shows potentially duplicate entities based on name similarity. Higher percentages indicate stronger likelihood of being the same entity.'
                )}
              </p>
              <label className="block mb-1">
                {t('Similarity Matching Threshold')} ({threshold}%)
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
                    // apply new threshold and reset list for refetch
                    setThreshold(inputThreshold);
                    setHasMore(true);
                    setPairs([]);
                  }}
                >
                  {t('Update')}
                </Button>
              </div>

              <hr className="my-4 border-gray-200" />

              <h3 className="text-lg font-medium mb-3">{t('Entity Pairs to Review')}</h3>
              <p className="text-sm text-gray-600 mt-0 mb-0">
                {t(
                  'Review these potential matches and merge entities that represent the same organization or individual.'
                )}
              </p>
              <div className="mt-4">
                {pairs.length === 0 ? (
                  <div>{t('No matching entities found at current threshold')}</div>
                ) : (
                  pairs.map((p) => (
                    <div
                      key={`${p.primary.id}-${p.secondary.id}`}
                      className="flex justify-between items-center mb-2"
                    >
                      <span>
                        {p.primary.label} ↔ {p.secondary.label} ({(p.score * 100).toFixed(1)}%)
                      </span>
                      <Button onClick={() => openModal(p)} className="ml-2">
                        <Trans ns="entities">Merge</Trans>
                      </Button>
                    </div>
                  ))
                )}
              </div>
              {hasMore && (
                <div className="m-auto mt-4">
                  <Button onClick={loadMore} disabled={loadingMore}>
                    {loadingMore ? <Spinner size="sm" /> : <Trans ns="entities">Load more</Trans>}
                  </Button>
                </div>
              )}
            </Card>
          </section>
        </>
      )}

      <SimilarMergeModal
        show={modalOpen && modalPair}
        onClose={() => setModalOpen(false)}
        primaryId={modalPair?.primary.id}
        secondaryId={modalPair?.secondary.id}
        onMergeComplete={handleMergeComplete}
      />
    </div>
  );
}

export default MergeEntitiesPage;
