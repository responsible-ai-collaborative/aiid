import React, { useMemo } from 'react';
import { getTaxonomies } from 'utils/cite';
import Row from '../../elements/Row';
import Col from '../../elements/Col';
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

  return (
    <Row>
      <Col>
        {taxonomies
          .filter((t) => t.publish)
          .map((t) => {
            return (
              <div key={t.namespace}>
                <Taxonomy id={`taxonomy-${t.namespace}`} taxonomy={t} canEdit={false} />
              </div>
            );
          })}
      </Col>
    </Row>
  );
}
