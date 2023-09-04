import { Button, Dropdown, Modal, Spinner } from 'flowbite-react';
import React, { useState } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import gql from 'graphql-tag';
import { useQuery } from '@apollo/client';
import ReactMarkdown from 'react-markdown';

const FIND_TAXONOMY_NAMES = gql`
  {
    taxas {
      namespace
      description
    }
  }
`;

export default function AddTaxonomyModal({ onClose, onTaxonomySelected }) {
  const { t } = useTranslation();

  const { data, loading } = useQuery(FIND_TAXONOMY_NAMES);

  const [selectedTaxonomy, setSelectedTaxonomy] = useState(null);

  function handleClickAddTaxonomy(selectedTaxonomy) {
    onTaxonomySelected(selectedTaxonomy);
    onClose();
  }

  return (
    <Modal show={true} onClose={() => onClose(false)} data-cy="taxonomy-modal">
      <Modal.Header>
        <Trans>Add Taxonomy</Trans>
      </Modal.Header>
      <Modal.Body>
        {loading && <Spinner />}

        {!loading && data?.taxas && (
          <>
            <Dropdown
              label={selectedTaxonomy || t('Select a taxonomy')}
              color={'light'}
              className="min-w-max mr-4"
            >
              {data.taxas.map(({ namespace }) => (
                <Dropdown.Item
                  key={namespace}
                  onClick={() => setSelectedTaxonomy(namespace)}
                  className={`${namespace === selectedTaxonomy ? 'bg-blue-100' : ''}`}
                >
                  <span>{namespace}</span>
                </Dropdown.Item>
              ))}
            </Dropdown>
            {data.taxas
              .filter(({ namespace }) => namespace === selectedTaxonomy)
              .map(({ namespace, description }) => (
                <div
                  key={namespace}
                  className="mt-2 max-h-240 overflow-y-scroll border rounded-sm p-2"
                >
                  <ReactMarkdown className="react-markdown prose max-w-full">
                    {description}
                  </ReactMarkdown>
                </div>
              ))}
          </>
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button
          onClick={() => handleClickAddTaxonomy(selectedTaxonomy)}
          disabled={!selectedTaxonomy}
        >
          <Trans>Add</Trans>
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
