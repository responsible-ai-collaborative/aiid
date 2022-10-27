import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from 'flowbite-react';

const NewSimilaritySelector = ({ incident_id }) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div>
      <Button.Group data-cy="similar-selector" id="similar-selector">
        {[
          {
            identifier: 'dissimilar',
            variant: 'failure',
            icon: 'No',
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
            variant: null,
            icon: 'Not sure',
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
            icon: 'Yes',
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
        ].map((button) => {
          let btnProps = {
            size: 'sm',
            'aria-pressed': button.show,
            onClick: button.onClick,
            key: button.icon,
            'data-cy': button.identifier,
          };

          if (button.variant) {
            if (button.show) {
              btnProps.color = button.variant;
            } else {
              btnProps.color = 'light';
            }
          } else if (!button.show) {
            btnProps.color = 'light';
          }

          return (
            <Button {...btnProps} key={button.icon}>
              <p className="text-xs m-0 break-keep whitespace-nowrap">{button.icon}</p>
            </Button>
          );
        })}
      </Button.Group>
    </div>
  );
};

export default NewSimilaritySelector;
