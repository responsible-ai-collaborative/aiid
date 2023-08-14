import React, { useMemo } from 'react';
import { getTaxonomies } from 'utils/cite';
import Taxonomy from './Taxonomy';

export default function TaxonomiesDisplay({ taxa, classifications }) {
  const taxonomies = useMemo(
    () =>
      getTaxonomies({
        allMongodbAiidprodTaxa: taxa,
        allMongodbAiidprodClassifications: classifications,
      }),
    []
  );

  return taxonomies
    .filter((t) => t.publish)
    .map((t) => {
      return (
        <div key={t.namespace}>
          <Taxonomy id={`taxonomy-${t.namespace}`} taxonomy={t} canEdit={false} />
        </div>
      );
    });
}
