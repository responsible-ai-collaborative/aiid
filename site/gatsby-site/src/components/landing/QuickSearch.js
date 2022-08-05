import SearchInput from 'components/forms/SearchInput';
import { navigate } from 'gatsby';
import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import styled from 'styled-components';

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 640px;
  margin: auto;
  :after {
    color: var(--bs-gray-600);
    font-size: 1.25rem;
    position: absolute;
    left: 1em;
    top: 50%;
    padding-top: -50%;
    transform: translateY(-50%);
    z-index: 3;
    pointer-events: none;

    content: '${(props) => props.t('Search reports')}';
    @media (min-width: 350px) {
      content: '${(props) => props.t('Search 1600+ reports')}';
    }
    @media (min-width: 450px) {
      content: '${(props) => props.t('Search 1600+ AI harm reports')}';
    }
    @media (min-width: 500px) {
      content: '${(props) => props.t('Search over 1600 reports of AI harms')}';
    }
  }
  &.has-input {
    :after {
      content: '' !important;
    }
  }
`;

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

  const { t } = useTranslation(['translation', 'landing', 'actions']);

  return (
    <>
      <Card className={className}>
        <Card.Body>
          <Form onSubmit={submit} id="quickSearch">
            <SearchInputWrapper t={t} className={searchTerm == '' ? '' : 'has-input'}>
              <SearchInput
                size="lg"
                value={searchTerm}
                onChange={setSearchTerm}
                onClear={() => setSearchTerm('')}
                placeHolder=""
                onKeyPress={(e) => {
                  e.key === 'Enter' && submit(e);
                }}
                aria-label={t('Search over 1600 reports of AI harms')}
              />
            </SearchInputWrapper>
            <Row>
              <Col className="d-flex gap-2 justify-content-center">
                <Button size="lg" variant="primary" className="mt-4" type="submit">
                  <Trans>Search</Trans>
                </Button>

                <Button
                  size="lg"
                  variant="secondary"
                  className="mt-4"
                  type="button"
                  onClick={discover}
                >
                  <Trans>Discover</Trans>
                </Button>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
