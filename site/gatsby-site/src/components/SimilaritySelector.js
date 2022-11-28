import React from 'react';
import { useFormikContext } from 'formik';
import { Button } from 'flowbite-react';

const SimilaritySelector = ({
  incident_id,
  notSureList,
  addToNotSureList,
  removeFromNotSureList,
}) => {
  const { values, setFieldValue } = useFormikContext();

  return (
    <div>
      <Button.Group data-cy="similar-selector" id="similar-selector">
        {[
          {
            identifier: 'dissimilar',
            variant: 'failure',
            text: 'No',
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
              removeFromNotSureList(incident_id);
            },
          },
          {
            identifier: 'unspecified',
            variant: 'warning',
            text: 'Not sure',
            show: (notSureList || []).includes(incident_id),
            onClick: () => {
              setFieldValue(
                'editor_similar_incidents',
                (values.editor_similar_incidents || []).filter((id) => id != incident_id)
              );
              setFieldValue(
                'editor_dissimilar_incidents',
                (values.editor_dissimilar_incidents || []).filter((id) => id != incident_id)
              );
              addToNotSureList(incident_id);
            },
          },
          {
            identifier: 'similar',
            variant: 'success',
            text: 'Yes',
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
              removeFromNotSureList(incident_id);
            },
          },
        ].map((button) => {
          let btnProps = {
            size: 'xs',
            'aria-pressed': button.show,
            onClick: button.onClick,
            key: button.text,
            'data-cy': button.identifier,
          };

          if (button.show) {
            btnProps.color = button.variant;
          } else {
            btnProps.color = 'light';
          }

          return (
            <Button {...btnProps} key={button.text}>
              <p className="text-xs m-0 break-keep whitespace-nowrap">{button.text}</p>
            </Button>
          );
        })}
      </Button.Group>
    </div>
  );
};

export default SimilaritySelector;
