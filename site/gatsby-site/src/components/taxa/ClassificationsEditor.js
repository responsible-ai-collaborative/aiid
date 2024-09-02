import React, { createRef, useEffect, useRef, useState } from 'react';
import { getTaxonomies } from 'utils/cite';
import Row from '../../elements/Row';
import Col from '../../elements/Col';
import Taxonomy from './Taxonomy';
import { useUserContext } from 'contexts/userContext';
import { Button, Dropdown, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_CLASSIFICATION } from '../../graphql/classifications';
import { useQuery } from '@apollo/client';
import Card from 'elements/Card';
import { StringParam, useQueryParams, withDefault } from 'use-query-params';

export default function TaxonomiesEditor({
  taxa,
  incidentId = null,
  reportNumber = null,
  className = '',
}) {
  const [query] = useQueryParams({
    edit_taxonomy: withDefault(StringParam, ''),
  });

  const { t } = useTranslation();

  const { isRole, user } = useUserContext();

  const [canEditTaxonomies, setCanEditTaxonomies] = useState(false);

  const canEditTaxonomy = (namespace) =>
    isRole('taxonomy_editor') || isRole('taxonomy_editor_' + namespace.toLowerCase());

  useEffect(() => {
    setCanEditTaxonomies(taxa.nodes.some((t) => canEditTaxonomy(t.namespace)));
  }, [user]);

  const incidentsQuery = incidentId ? { incidents: { EQ: incidentId } } : {};

  const reportsQuery = reportNumber ? { reports: { EQ: reportNumber } } : {};

  const { data } = useQuery(FIND_CLASSIFICATION, {
    variables: { filter: { ...incidentsQuery, ...reportsQuery } },
  });

  const [taxonomies, setTaxonomies] = useState([]);

  useEffect(() => {
    if (data?.classifications) {
      const taxonomies = getTaxonomies({
        allMongodbAiidprodTaxa: taxa,
        allMongodbAiidprodClassifications: { nodes: data.classifications },
      });

      setTaxonomies(taxonomies);
    }
  }, [data]);

  const [taxonomiesList, setTaxonomiesList] = useState([]);

  const taxonomiesListSize = useRef(taxonomiesList.length);

  useEffect(() => {
    if (taxonomies.length && user) {
      const list = taxonomies
        .filter(
          (t) => t.classificationsArray.length || t.notes || query.edit_taxonomy === t.namespace
        )
        .map((t) => ({
          ...t,
          canEdit: canEditTaxonomy(t.namespace),
          ref: createRef(),
          initialEditing: query.edit_taxonomy === t.namespace,
        }));

      taxonomiesListSize.current = list.length;

      setTaxonomiesList(list);
    }
  }, [user, taxonomies]);

  const [selectedTaxonomy, setSelectedTaxonomy] = useState(null);

  const handleClickAddTaxonomy = (namespace) => {
    const taxonomy = taxonomies.find((t) => t.namespace == namespace);

    const canEdit = canEditTaxonomy(namespace);

    if (canEdit) {
      taxonomy.initialEditing = true;
    }

    setTaxonomiesList((list) => {
      taxonomiesListSize.current = taxonomiesList.length;
      return [...list, { ...taxonomy, canEdit, ref: createRef() }];
    });

    setSelectedTaxonomy(null);
  };

  const [scrolledToTaxonomy, setScrolledToTaxonomy] = useState(null);

  useEffect(() => {
    if (taxonomiesListSize.current < taxonomiesList.length) {
      taxonomiesList[taxonomiesList.length - 1].ref.current.scrollIntoView();
    }

    if (
      scrolledToTaxonomy !== query.edit_taxonomy &&
      taxonomiesList.some((t) => t.namespace === query.edit_taxonomy)
    ) {
      setScrolledToTaxonomy(query.edit_taxonomy);
      // TODO: this has a race condition where the ref is not yet set
      taxonomiesList.find((t) => t.namespace === query.edit_taxonomy).ref.current?.scrollIntoView();
    }
  }, [taxonomiesList]);

  return (
    canEditTaxonomies && (
      <Card className={'shadow-card ' + className} data-cy="classifications-editor">
        <Card.Header className="items-center justify-between">
          <h4>
            <Trans>Classifications Editor</Trans>
          </h4>
          {taxonomies.length == 0 && (
            <>
              <Spinner className="ml-2" />
            </>
          )}
        </Card.Header>

        {taxonomies.length > 0 && (
          <Card.Body>
            <Row>
              <Col className="flex flex-row">
                <div className="mr-2">
                  <Dropdown
                    label={selectedTaxonomy || t('Select a taxonomy')}
                    color={'light'}
                    className="min-w-max mr-4"
                  >
                    {taxonomies
                      .filter((t) => !taxonomiesList.some((item) => item.namespace == t.namespace))
                      .filter(
                        (t) =>
                          isRole('taxonomy_editor') ||
                          isRole('taxonomy_editor_' + t.namespace.toLowerCase())
                      )
                      .map(({ namespace }) => (
                        <Dropdown.Item
                          key={namespace}
                          onClick={() => setSelectedTaxonomy(namespace)}
                          className={`${namespace === selectedTaxonomy ? 'bg-blue-100' : ''}`}
                        >
                          <span>{namespace}</span>
                        </Dropdown.Item>
                      ))}
                  </Dropdown>
                </div>

                <Button
                  onClick={() => handleClickAddTaxonomy(selectedTaxonomy)}
                  disabled={!selectedTaxonomy}
                >
                  <Trans>Add</Trans>
                </Button>
              </Col>
            </Row>

            {taxonomiesList.map((t) => {
              return (
                <div key={t.namespace} ref={t.ref}>
                  <Taxonomy
                    id={`taxonomy-${t.namespace}`}
                    taxonomy={t}
                    incidentId={incidentId}
                    reportNumber={reportNumber}
                    canEdit={t.canEdit}
                    initialEditing={t.initialEditing}
                  />
                </div>
              );
            })}
          </Card.Body>
        )}
      </Card>
    )
  );
}
