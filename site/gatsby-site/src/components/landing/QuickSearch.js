import SearchInput from 'components/forms/SearchInput';
import { navigate } from 'gatsby';
import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';

export default function QuickSearch({ className }) {
  const [searchTerm, setSearchTerm] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate(`/apps/discover?s=${searchTerm}`);
  };

  return (
    <Card className={className}>
      <Card.Body>
        <Form onSubmit={submit} className="mt-4">
          <SearchInput
            size="lg"
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm('')}
            placeHolder="Search all incident reports"
            onKeyPress={(e) => {
              e.key === 'Enter' && submit(e);
            }}
          />

          <Button size="lg" variant="primary" className="mt-4" type="submit">
            Search
          </Button>

          <small className="text-mutted mt-4 d-block">
            Entering text above will search across more than 1200 incident reports
          </small>
        </Form>
      </Card.Body>
    </Card>
  );
}
