import SearchInput from 'components/forms/SearchInput';
import { navigate } from 'gatsby';
import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

export default function QuickSearch() {
  const [searchTerm, setSearchTerm] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate(`/apps/discover?s=${searchTerm}`);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>Search all incident reports</Card.Title>
        <form onSubmit={submit}>
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            onKeyPress={(e) => {
              e.key === 'Enter' && submit(e);
            }}
          />
        </form>
      </Card.Body>
      <Card.Footer>
        Entering text above will search across more than 1200 incident reports
      </Card.Footer>
    </Card>
  );
}
