import React, { useState } from 'react';
import { Button, Modal } from 'react-bootstrap';
import { getFormattedName } from '../utils/typography';
import { format } from 'date-fns';

const BibTex = ({ nodes, incidentDate, incident_id }) => {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);

  const handleShow = () => setShow(true);

  let docs = [];

  nodes.forEach(({ node }) => docs.push(node));

  // Sort the docs according to their submit date
  docs.sort(function (a, b) {
    return a['submission_date'] > b['submission_date'];
  });

  // Only return the earliest submitter
  let submitterCite = getFormattedName(docs[0]['submitters'][0]);

  const jsx = (
    <code>
      @article &#123;
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; aiid:{docs[0]['incident_id']},
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; author = &#123;{submitterCite}&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; editor = &#123;McGregor, Sean&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; journal = &#123;AI Incident Database&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; publisher = &#123;Responsible AI Collaborative&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; title = &#123;Incident Number {incident_id}&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; url = &#123;https://incidentdatabase.ai/cite/{incident_id}&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; year = &#123;{incidentDate.substring(0, 4)}&#125;,
      <br />
      &nbsp; &nbsp; &nbsp; &nbsp; urldate = &#123;{format(new Date(), 'MMMM d, y')}&#125;
      <br />
      &#125;
    </code>
  );

  return (
    <>
      <Button variant="outline-primary" onClick={handleShow}>
        BibTex Citation
      </Button>
      <Modal show={show} onHide={handleClose} data-cy="bibtext-modal">
        <Modal.Header closeButton>
          <Modal.Title>BibTex Citation</Modal.Title>
        </Modal.Header>
        <Modal.Body>{jsx}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BibTex;
