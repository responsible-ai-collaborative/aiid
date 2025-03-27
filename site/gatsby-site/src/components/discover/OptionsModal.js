import React, { useState } from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import { AccordionFilter } from './Filter';
import Stats from './Stats';
import ClearFilters from './ClearFilters';
import { Trans } from 'react-i18next';
import DisplayModeSwitch from './DisplayModeSwitch';
import Button from 'elements/Button';
import DisplayOptions from './DisplayOptions';
import { Accordion, Modal } from 'flowbite-react';
import { graphql, useStaticQuery } from 'gatsby';
import { useRange, useRefinementList } from 'react-instantsearch';

const VirtualRefinementList = ({ attribute }) => {
  useRefinementList({ attribute });

  return null;
};

const VirtualRange = ({ attribute }) => {
  useRange({ attribute });

  return null;
};

const componentsMap = {
  refinement: VirtualRefinementList,
  classifications: VirtualRefinementList,
  range: VirtualRange,
};

function VirtualFilters() {
  return (
    <>
      {REFINEMENT_LISTS.map((list) => {
        const Component = componentsMap[list.type];

        return <Component key={list.attribute} attribute={list.attribute} />;
      })}
    </>
  );
}

function OptionsModal() {
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => setShowModal(false);

  const {
    taxa: { nodes: taxa },
  } = useStaticQuery(graphql`
    query FiltersTaxaQuery {
      taxa: allMongodbAiidprodTaxa(filter: { namespace: { in: ["CSETv1", "CSETv0", "GMF"] } }) {
        nodes {
          namespace
          field_list {
            short_name
          }
        }
      }
    }
  `);

  return (
    <div>
      <div className="my-4 md:hidden flex justify-between">
        <div className="flex items-center">
          <Stats />
        </div>
        <div className="flex justify-end">
          <ClearFilters>
            <Trans>Clear</Trans>
          </ClearFilters>
          <Button variant="link" onClick={() => setShowModal(true)}>
            <Trans>Options</Trans>
          </Button>
        </div>
      </div>

      <VirtualFilters />

      <Modal show={showModal} onClose={handleClose}>
        <Modal.Header>
          <Trans>Search Options</Trans>
        </Modal.Header>
        <Modal.Body>
          <div>
            <div className="tw-options-modal-hbox">
              <DisplayOptions />
              <DisplayModeSwitch />
            </div>
            <Accordion>
              {REFINEMENT_LISTS.map((list) => (
                <AccordionFilter
                  key={list.attribute}
                  attribute={list.attribute}
                  {...list}
                  taxa={taxa}
                />
              ))}
            </Accordion>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            <Trans>Close</Trans>
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default OptionsModal;
