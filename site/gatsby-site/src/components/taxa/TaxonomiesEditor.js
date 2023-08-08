import React, { useEffect, useMemo, useRef, useState } from 'react';
import { getTaxonomies } from 'utils/cite';
import Row from '../../elements/Row';
import Col from '../../elements/Col';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';
import Taxonomy from './Taxonomy';
import { useUserContext } from 'contexts/userContext';

export default function TaxonomiesEditor({
  taxa,
  classifications,
  incidentId = null,
  reportNumber = null,
}) {
  const { isRole, user } = useUserContext();

  const [query] = useQueryParams({
    edit_taxonomy: withDefault(StringParam, ''),
  });

  const taxonomies = useMemo(
    () =>
      getTaxonomies({
        allMongodbAiidprodTaxa: taxa,
        allMongodbAiidprodClassifications: classifications,
      }),
    []
  );

  const [taxonomiesList, setTaxonomiesList] = useState(
    taxonomies.map((t) => ({ ...t, canEdit: false }))
  );

  const taxonomyDiv = useRef(null);

  useEffect(() => {
    if (query.edit_taxonomy?.length > 0 && taxonomyDiv?.current) {
      if (taxonomyDiv?.current?.scrollIntoView) {
        taxonomyDiv.current.scrollIntoView();
      }
    }
  }, []);

  useEffect(() => {
    setTaxonomiesList((list) =>
      list.map((t) => ({
        ...t,
        canEdit:
          isRole('taxonomy_editor') || isRole('taxonomy_editor_' + t.namespace.toLowerCase()),
      }))
    );
  }, [user]);

  const [taxonomyBeingEdited, setTaxonomyBeingEdited] = useState(
    taxonomies.find((taxonomy) => taxonomy.namespace == query.edit_taxonomy)
  );

  return (
    <>
      {taxonomies.length > 0 && (
        <Row>
          <Col>
            {taxonomiesList
              .filter((t) => t.canEdit || (t.classificationsArray.length > 0 && t.publish))
              .map((t) => {
                const inQuery = query.edit_taxonomy == t.namespace;

                return (
                  <div key={t.namespace} ref={inQuery ? taxonomyDiv : undefined}>
                    <Taxonomy
                      id={`taxonomy-${t.namespace}`}
                      taxonomy={t}
                      incidentId={incidentId}
                      reportNumber={reportNumber}
                      canEdit={t.canEdit}
                      {...{
                        taxonomyBeingEdited,
                        setTaxonomyBeingEdited,
                      }}
                    />
                  </div>
                );
              })}
          </Col>
        </Row>
      )}
    </>
  );
}
