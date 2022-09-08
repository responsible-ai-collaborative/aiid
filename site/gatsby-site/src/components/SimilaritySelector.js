import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import styled from 'styled-components';
import { useFormikContext } from 'formik';

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

const SimilaritySelector = ({ incident_id }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div className="bootstrap">
      <ButtonGroup data-cy="similar-selector" id="similar-selector">
        {[
          {
            identifier: 'dissimilar',
            variant: 'danger',
            icon: 'x',
            show:
              values.editor_dissimilar_incidents &&
              values.editor_dissimilar_incidents.includes(incident_id),
            onClick: () => {
              setFieldValue(
                'editor_dissimilar_incidents',
                (values.editor_dissimilar_incidents || []).concat([incident_id])
              );
              setFieldValue(
                'editor_similar_incidents',
                (values.editor_similar_incidents || []).filter((id) => id != incident_id)
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
              (!values.editor_similar_incidents.includes(incident_id) &&
                !values.editor_dissimilar_incidents.includes(incident_id)),
            onClick: () => {
              setFieldValue(
                'editor_similar_incidents',
                (values.editor_similar_incidents || []).filter((id) => id != incident_id)
              );
              setFieldValue(
                'editor_dissimilar_incidents',
                (values.editor_dissimilar_incidents || []).filter((id) => id != incident_id)
              );
            },
          },
          {
            identifier: 'similar',
            variant: 'success',
            icon: '✓',
            show:
              values.editor_similar_incidents &&
              values.editor_similar_incidents.includes(incident_id),
            onClick: () => {
              setFieldValue(
                'editor_similar_incidents',
                (values.editor_similar_incidents || []).concat([incident_id])
              );
              setFieldValue(
                'editor_dissimilar_incidents',
                (values.editor_dissimilar_incidents || []).filter((id) => id != incident_id)
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
      </ButtonGroup>
    </div>
  );
};

export default SimilaritySelector;
