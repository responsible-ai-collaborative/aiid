import React, { useState } from 'react';
import { Spinner, Button, Card } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_ENTITIES, MERGE_ENTITIES } from '../../graphql/entities';
import { useQuery, useMutation } from '@apollo/client/react/hooks';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

export default function AnyMerge() {
  const { t } = useTranslation();

  const addToast = useToastContext();

  const keepSide = 'left';

  const { data: allEntitiesData, loading: loadingEntities } = useQuery(FIND_ENTITIES);

  const [mergeEntities, { loading: merging }] = useMutation(MERGE_ENTITIES);

  const [primary, setPrimary] = useState('');

  const [secondary, setSecondary] = useState('');

  const confirmMerge = async () => {
    const primaryId = primary;

    const secondaryId = secondary;

    const keepEntityInt = keepSide === 'left' ? 1 : 2;

    try {
      await mergeEntities({ variables: { primaryId, secondaryId, keepEntity: keepEntityInt } });
      addToast({ message: t('Merged successfully'), severity: SEVERITY.success });
    } catch (error) {
      addToast({ message: t('Error merging entities'), severity: SEVERITY.danger, error });
    }
  };

  const entities = allEntitiesData?.entities || [];

  const primaryEntityName = entities.find((e) => e.entity_id === primary)?.name || '';

  const secondaryEntityName = entities.find((e) => e.entity_id === secondary)?.name || '';

  const keptEntityName = keepSide === 'left' ? primaryEntityName : secondaryEntityName;

  const deletedEntityName = keepSide === 'left' ? secondaryEntityName : primaryEntityName;

  return (
    <Card>
      <h2 className="text-xl font-semibold mb-0">
        <Trans>Merge Any Two Entities</Trans>
      </h2>
      <p className="text-sm text-gray-600 mb-0 mt-0">
        {t(
          'Select two entities to merge. All references to the deleted entity will be updated to use the kept entity.'
        )}
      </p>
      {loadingEntities ? (
        <Spinner />
      ) : (
        <>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="entity1" className="block mb-1">
                <Trans>Primary Entity (Kept)</Trans>
              </label>
              <select
                id="entity1"
                value={primary}
                onChange={(e) => setPrimary(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">
                  <Trans>Select primary entity</Trans>
                </option>
                {entities.map((e) => (
                  <option key={e.entity_id} value={e.entity_id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="entity2" className="block mb-1">
                <Trans>Secondary Entity (Deleted)</Trans>
              </label>
              <select
                id="entity2"
                value={secondary}
                onChange={(e) => setSecondary(e.target.value)}
                className="border rounded px-2 py-1 w-full"
              >
                <option value="">
                  <Trans>Select secondary entity</Trans>
                </option>
                {entities.map((e) => (
                  <option key={e.entity_id} value={e.entity_id}>
                    {e.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          {primary && secondary && (
            <p className="font-medium text-red-600">
              <Trans>
                Warning: This will delete entity &quot;{deletedEntityName}&quot; and update all
                references to use &quot;{keptEntityName}&quot;.
              </Trans>
            </p>
          )}
          <div className="flex space-x-2">
            <Button onClick={confirmMerge} disabled={!primary || !secondary || merging}>
              {merging ? <Spinner size="sm" /> : <Trans>Confirm Merge</Trans>}
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}
