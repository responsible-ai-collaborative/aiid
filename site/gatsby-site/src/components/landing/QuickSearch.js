import SearchInput from 'components/forms/SearchInput';
import { navigate } from 'gatsby';
import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import Link from 'components/ui/Link';

export default function QuickSearch({ className }) {
  const [searchTerm, setSearchTerm] = useState('');

  const submit = (e) => {
    e.preventDefault();
    navigate(`/apps/discover?s=${searchTerm}`);
  };

  const discover = (e) => {
    e.preventDefault();
    navigate(`/apps/discover`);
  };

  return (
    <>
      <Card className={className}>
        <Card.Body>
          <Form onSubmit={submit} className="mt-4" id="quickSearch">
            <SearchInput
              size="lg"
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeHolder="Search reports"
              onKeyPress={(e) => {
                e.key === 'Enter' && submit(e);
              }}
            />
            <Row>
              <Col className="d-flex gap-2 justify-content-center">
                <Button size="lg" variant="primary" className="mt-4" type="submit">
                  Search
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-4"
                  type="button"
                  onClick={discover}
                >
                  Discover
                </Button>
              </Col>
            </Row>

            <small className="text-mutted mt-4 d-block">
              Entering text above will search across more than 1300 reports of AI harms
            </small>
          </Form>
        </Card.Body>
      </Card>
      <Card className={className}>
        <Card.Body>
          <h1>
            <Link to="/blog/join-raic">⇨Hiring⇦</Link>
          </h1>
        </Card.Body>
      </Card>
    </>
  );
}
