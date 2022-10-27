import React from 'react';
import { connectRefinementList } from 'react-instantsearch-dom';
import { Form } from 'react-bootstrap';

export const ToggleDisplayIssues = connectRefinementList(({ currentRefinement, refine, id }) => {
  const checked = currentRefinement.includes('true') && currentRefinement.includes('false');

  return (
    <Form.Check
      type="switch"
      id={id}
      checked={checked}
      onClick={() => {
        if (checked) {
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
  const checked = currentRefinement.length == 1 && currentRefinement.includes('false');

  return (
    <Form.Check
      type="switch"
      id={id}
      checked={checked}
      onClick={() => {
        if (checked) {
          refine(['true']);
        } else {
          refine(['false']);
        }
      }}
      className="tw-switch ml-2"
    />
  );
});
