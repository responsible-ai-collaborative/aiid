import React from 'react';
import styled from 'styled-components';
import { ListGroup, Card, Spinner, Button } from 'react-bootstrap';
import { useFormikContext } from 'formik';

const ListContainer = styled(Card)`
  margin: 1em 0;
`;

const ReportRow = styled(ListGroup.Item)`
  display: flex !important;
  align-items: center;
  a:first-child {
    flex-shrink: 1;
    margin-right: auto;
  }
  Button {
    margin-left: 1ch;
    flex-shrink: 0 !important;
    width: 8em;
  }
  @media (max-width: 400px) {
    Button {
      width: unset;
    }
    Button .incident-id {
      display: block;
    }
  }
`;

const RelatedIncidentsArea = ({ columnKey, header, reports, loading, editable, error }) => {
  if (!reports && !loading) {
    return null;
  }

  const { setFieldValue } = editable ? useFormikContext() : { setFieldValue: null };

  return (
    <ListContainer data-cy={`related-${columnKey}`}>
      <ListGroup.Item variant="secondary" key={'header'}>
        {header}
        {loading && <Spinner animation="border" size="sm" className="ms-2" />}
      </ListGroup.Item>
      {reports &&
        reports.map((val) => (
          <ReportRow key={val.url} data-cy="result">
            <a href={val.url} target="_blank" rel="noreferrer">
              {val.title}
            </a>
            {val.incident_id && editable && (
              <Button
                onClick={() => setFieldValue && setFieldValue('incident_id', val.incident_id)}
              >
                Use&nbsp;ID&nbsp;<span className="incident-id">#{val.incident_id}</span>
              </Button>
            )}
          </ReportRow>
        ))}
      {!loading && reports?.length == 0 && (
        <ListGroup.Item>{error ? error : 'No related reports found.'}</ListGroup.Item>
      )}
    </ListContainer>
  );
};

export default RelatedIncidentsArea;
