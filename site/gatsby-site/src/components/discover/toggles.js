import React from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { Form } from 'react-bootstrap';

export const ToggleDisplayIssues = connectRefinementList(({ currentRefinement, refine, id }) => {
  return (
    <Form.Check
      type="switch"
      id={id}
      checked={currentRefinement.includes('false')}
      onClick={() => {
        if (currentRefinement.includes('false') && currentRefinement.includes('true')) {
          refine(['true']);
        } else {
          refine(['true', 'false']);
        }
      }}
      className="tw-switch ml-2"
    />
  );
});

export const ToggleOnlyIssues = connectRefinementList(({ currentRefinement, refine, id }) => {
  return (
    <Form.Check
      type="switch"
      id={id}
      checked={currentRefinement.length == 1 && currentRefinement.includes('false')}
      onClick={() => {
        if (currentRefinement.includes('true')) {
          refine(['false']);
        } else {
          refine(['true']);
        }
      }}
      className="tw-switch ml-2"
    />
  );
});
