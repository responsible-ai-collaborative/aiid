import React, { createRef, useEffect, useRef, useState } from 'react';
import { getTaxonomies } from 'utils/cite';
import Row from '../../elements/Row';
import Col from '../../elements/Col';
import Taxonomy from './Taxonomy';
import { useUserContext } from 'contexts/userContext';
import { Button, Card, Dropdown, Spinner } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_CLASSIFICATION } from '../../graphql/classifications';
import { useQuery } from '@apollo/client';

export default function TaxonomiesEditor({ taxa, incidentId = null, reportNumber = null }) {
  const { t } = useTranslation();

  const { isRole, user } = useUserContext();

  const [canEditTaxonomies, setCanEditTaxonomies] = useState(false);

  const canEditTaxonomy = (namespace) =>
    isRole('taxonomy_editor') || isRole('taxonomy_editor_' + namespace.toLowerCase());

  useEffect(() => {
    setCanEditTaxonomies(taxa.nodes.some((t) => canEditTaxonomy(t.namespace)));
  }, [user]);

  const incidentsQuery = incidentId ? { incidents: { incident_id: incidentId } } : {};

  const reportsQuery = reportNumber ? { reports: { report_number: reportNumber } } : {};

  const { data } = useQuery(FIND_CLASSIFICATION, {
    variables: { query: { ...incidentsQuery, ...reportsQuery } },
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
        .filter((t) => t.classificationsArray.length || t.notes)
        .map((t) => ({ ...t, canEdit: canEditTaxonomy(t.namespace), ref: createRef() }));

      taxonomiesListSize.current = list.length;

      setTaxonomiesList(list);
    }
  }, [user, taxonomies]);

  const [selectedTaxonomy, setSelectedTaxonomy] = useState(null);

  const handleClickAddTaxonomy = (namespace) => {
    const taxonomy = taxonomies.find((t) => t.namespace == namespace);

    const canEdit = canEditTaxonomy(namespace);

    setTaxonomiesList((list) => {
      taxonomiesListSize.current = taxonomiesList.length;
      return [...list, { ...taxonomy, canEdit, ref: createRef() }];
    });

    setSelectedTaxonomy(null);
  };

  useEffect(() => {
    if (taxonomiesListSize.current < taxonomiesList.length) {
      taxonomiesList[taxonomiesList.length - 1].ref.current.scrollIntoView();
    }
  }, [taxonomiesList]);

  return (
    <>
      {canEditTaxonomies && (
        <Card className="bg-slate-50">
          <h3>
            <Trans>Classifications Editor</Trans>
            {taxonomies.length == 0 && (
              <>
                <Spinner className="ml-2" />
              </>
            )}
          </h3>

          {taxonomies.length > 0 && (
            <>
              <Row>
                <Col className="flex flex-row">
                  <div className="mr-2">
                    <Dropdown
                      label={selectedTaxonomy || t('Please select a taxonomy')}
                      color={'light'}
                      className="min-w-max mr-4"
                    >
                      {taxonomies
                        .filter(
                          (t) => !taxonomiesList.some((item) => item.namespace == t.namespace)
                        )
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

              <Row>
                <Col>
                  {taxonomiesList.map((t) => {
                    return (
                      <div key={t.namespace} ref={t.ref}>
                        <Taxonomy
                          id={`taxonomy-${t.namespace}`}
                          taxonomy={t}
                          incidentId={incidentId}
                          reportNumber={reportNumber}
                          canEdit={t.canEdit}
                        />
                      </div>
                    );
                  })}
                </Col>
              </Row>
            </>
          )}
        </Card>
      )}
    </>
  );
}
