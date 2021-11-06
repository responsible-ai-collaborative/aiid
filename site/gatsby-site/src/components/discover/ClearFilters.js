import React from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import { Button } from 'react-bootstrap';

const ClearButton = connectCurrentRefinements(({ items, refine, children }) => {
  return (
    <Button
      className="text-decoration-none"
      variant="link secondary"
      onClick={() => {
        refine(items);
      }}
      disabled={items.length == 0}
    >
      {children}
    </Button>
  );
});

const ClearFilters = ({ children }) => <ClearButton clearsQuery>{children}</ClearButton>;

export default ClearFilters;
