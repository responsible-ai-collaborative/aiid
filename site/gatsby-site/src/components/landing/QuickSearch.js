import SearchInput from 'components/forms/SearchInput';
import { navigate } from 'gatsby';
import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';

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

  const [placeHolderText, setPlaceHolderText] = useState('Search 1400+ reports');

  const buttonStyle = { width: '10ch' };

  useEffect(() => {
    const updatePlaceHolder = () => {
      if (document && document.body.scrollWidth > 500) {
        setPlaceHolderText('Search over 1400 reports of AI harms');
      } else if (document && document.body.scrollWidth > 450) {
        setPlaceHolderText('Search 1400+ AI harm reports');
      } else if (document && document.body.scrollWidth > 350) {
        setPlaceHolderText('Search 1400+ reports');
      } else {
        setPlaceHolderText('Search reports');
      }
    };

    updatePlaceHolder();
    if (window) window.addEventListener('resize', updatePlaceHolder);
  });

  return (
    <>
      <Card className={className}>
        <Card.Body>
          <Form onSubmit={submit} id="quickSearch">
            <SearchInput
              size="lg"
              value={searchTerm}
              onChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
              placeHolder={placeHolderText}
              onKeyPress={(e) => {
                e.key === 'Enter' && submit(e);
              }}
            />
            <Row>
              <Col className="d-flex gap-2 justify-content-center">
                <Button
                  size="lg"
                  variant="primary"
                  className="mt-4"
                  type="submit"
                  style={buttonStyle}
                >
                  Search
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-4"
                  type="button"
                  onClick={discover}
                  style={buttonStyle}
                >
                  Discover
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
