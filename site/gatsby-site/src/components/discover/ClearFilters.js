import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import { Button } from 'react-bootstrap';

const ClearButton = connectCurrentRefinements(({ items, refine, children }) => {
  return (
    <div className="bootstrap">
      <Button
        className="no-underline"
        variant="link secondary"
        onClick={() => {
          refine(items);
        }}
        disabled={items.length == 0}
      >
        {children}
      </Button>
    </div>
  );
});

const ClearFilters = ({ children }) => <ClearButton clearsQuery>{children}</ClearButton>;

export default ClearFilters;
