import React from 'react';
import styled from 'styled-components';
import { ListGroup, Card, Spinner, Button, ButtonToolbar } from 'react-bootstrap';
import SimilaritySelector from './SimilaritySelector';
import { LocalizedLink } from 'gatsby-theme-i18n';

const ListContainer = styled(Card)`
  margin: 1em 0;
  .reports {
    max-height: 33.3333vh;
    overflow-y: auto;
  }
`;

const ReportRow = styled(ListGroup.Item)`
  display: flex !important;
  align-items: center;
  > *:first-child {
    flex-shrink: 1;
    margin-right: auto;
  }
  button.set-id {
    margin-left: 1ch;
    flex-shrink: 0 !important;
    width: 8em;
  }
  @media (max-width: 860px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5em;
  }
`;

const ReportToolbar = styled(ButtonToolbar)`
  flex-shrink: 0;
  align-items: center;
`;

const SelectorLabel = styled.label`
  margin-left: 1ch;
  margin-right: 1ch;
`;

const RelatedIncidentsArea = ({
  columnKey,
  header,
  reports,
  incidents,
  loading,
  setFieldValue,
  editSimilar = true,
  editId = true,
  error,
}) => {
  if (!reports && !incidents && !loading) {
    return null;
  }

  return (
    <ListContainer data-cy={`related-${columnKey}`}>
      <ListGroup.Item variant="secondary" key={'header'}>
        {header}
        {loading && <Spinner animation="border" size="sm" className="ms-2" />}
      </ListGroup.Item>
      <div className="reports">
        {(reports || incidents) &&
          (reports || incidents).map((val) => (
            <ReportRow key={val.url || val.incident_id} data-cy="result">
              <span>
                {val?.incident_id && (
                  <>
                    <LocalizedLink to={'/cite/' + val.incident_id}>
                      #{val.incident_id}
                    </LocalizedLink>{' '}
                    –{' '}
                  </>
                )}
                <a href={val.url || '/cite/' + val.incident_id} data-cy="title">
                  {val.title}
                </a>
              </span>
              <ReportToolbar>
                {setFieldValue && editSimilar && (
                  <>
                    <SelectorLabel htmlFor="similar-selector">Related:</SelectorLabel>
                    <SimilaritySelector incident_id={val.incident_id} />
                  </>
                )}
                {val.incident_id && setFieldValue && editId && (
                  <Button
                    data-cy="set-id"
                    className="set-id"
                    onClick={() => setFieldValue && setFieldValue('incident_id', val.incident_id)}
                  >
                    Use&nbsp;ID&nbsp;<span className="incident-id">#{val.incident_id}</span>
                  </Button>
                )}
              </ReportToolbar>
            </ReportRow>
          ))}
        {!loading && (error || reports?.length == 0 || incidents?.length == 0) && (
          <ListGroup.Item>{error ? error : 'No related reports found.'}</ListGroup.Item>
        )}
      </div>
    </ListContainer>
  );
};

export default RelatedIncidentsArea;
