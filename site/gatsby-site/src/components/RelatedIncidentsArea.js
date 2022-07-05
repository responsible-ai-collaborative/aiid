import React from 'react';
import styled from 'styled-components';
import { ListGroup, Card, Spinner, Button, ButtonGroup, ButtonToolbar } from 'react-bootstrap';
import { useFormikContext } from 'formik';

const ListContainer = styled(Card)`
  margin: 1em 0;
  .reports {
    max-height: 80vh;
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
  Button.set-id {
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

const SimilarSelector = styled(ButtonGroup)`
  margin-left: 1ch;
`;

const SimilarityButton = styled(Button)`
  transition: 0.2s ease-in all !important;
  opacity: 0.8 !important;
  width: 2.5em;
  padding-left: 0px !important;
  padding-right: 0px !important;
  text-align: center;

  :disabled {
    opacity: 1 !important;
    box-shadow: inset 0px 0px 4px 4px rgba(0, 0, 0, 0.05);
  }
`;

const ReportToolbar = styled(ButtonToolbar)`
  flex-shrink: 0;
  align-items: center;
`;

const RelatedIncidentsArea = ({
  columnKey,
  header,
  reports,
  loading,
  editable,
  editId = true,
  error,
}) => {
  if (!reports && !loading) {
    return null;
  }

  const { values, setFieldValue } = editable ? useFormikContext() : { setFieldValue: null };

  return (
    <ListContainer data-cy={`related-${columnKey}`}>
      <ListGroup.Item variant="secondary" key={'header'}>
        {header}
        {loading && <Spinner animation="border" size="sm" className="ms-2" />}
      </ListGroup.Item>
      <div className="reports">
        {reports &&
          reports.map((val) => (
            <ReportRow key={val.url} data-cy="result">
              <span>
                {val?.incident_id && (
                  <>
                    <a href={'/cite/' + val.incident_id}>#{val.incident_id}</a> –{' '}
                  </>
                )}
                <a href={val.url} target="_blank" rel="noreferrer">
                  {val.title}
                </a>
              </span>
              <ReportToolbar>
                {editable && (
                  <>
                    <label htmlFor="similar-selector">Related: </label>
                    <SimilarSelector data-cy="similar-selector" id="similar-selector">
                      {[
                        {
                          identifier: 'dissimilar',
                          variant: 'danger',
                          icon: 'x',
                          show:
                            values.editor_dissimilar_incidents &&
                            values.editor_dissimilar_incidents.includes(val.incident_id),
                          onClick: () => {
                            setFieldValue(
                              'editor_dissimilar_incidents',
                              (values.editor_dissimilar_incidents || []).concat([val.incident_id])
                            );
                            setFieldValue(
                              'editor_similar_incidents',
                              (values.editor_similar_incidents || []).filter(
                                (id) => id != val.incident_id
                              )
                            );
                          },
                        },
                        {
                          identifier: 'unspecified',
                          variant: 'secondary',
                          icon: '?',
                          show:
                            !values.editor_similar_incidents ||
                            !values.editor_dissimilar_incidents ||
                            (!values.editor_similar_incidents.includes(val.incident_id) &&
                              !values.editor_dissimilar_incidents.includes(val.incident_id)),
                          onClick: () => {
                            setFieldValue(
                              'editor_similar_incidents',
                              (values.editor_similar_incidents || []).filter(
                                (id) => id != val.incident_id
                              )
                            );
                            setFieldValue(
                              'editor_dissimilar_incidents',
                              (values.editor_dissimilar_incidents || []).filter(
                                (id) => id != val.incident_id
                              )
                            );
                          },
                        },
                        {
                          identifier: 'similar',
                          variant: 'success',
                          icon: '✓',
                          show:
                            values.editor_similar_incidents &&
                            values.editor_similar_incidents.includes(val.incident_id),
                          onClick: () => {
                            setFieldValue(
                              'editor_similar_incidents',
                              (values.editor_similar_incidents || []).concat([val.incident_id])
                            );
                            setFieldValue(
                              'editor_dissimilar_incidents',
                              (values.editor_dissimilar_incidents || []).filter(
                                (id) => id != val.incident_id
                              )
                            );
                          },
                        },
                      ].map((button) => (
                        <SimilarityButton
                          variant={button.show ? button.variant : 'secondary'}
                          aria-pressed={button.show}
                          disabled={button.show}
                          onClick={button.onClick}
                          key={button.icon}
                          data-cy={button.identifier}
                        >
                          {button.icon}
                        </SimilarityButton>
                      ))}
                    </SimilarSelector>
                  </>
                )}
                {val.incident_id && editable && editId && (
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
        {!loading && reports?.length == 0 && (
          <ListGroup.Item>{error ? error : 'No related reports found.'}</ListGroup.Item>
        )}
      </div>
    </ListContainer>
  );
};

export default RelatedIncidentsArea;
