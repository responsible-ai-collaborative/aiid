import React, { useEffect } from 'react';
import { useFormikContext } from 'formik';
import { Button } from 'flowbite-react';
import { useTranslation } from 'react-i18next';

const SimilaritySelector = ({
  incident_id,
  notSureList,
  addToNotSureList,
  removeFromNotSureList,
}) => {
  const { values, setFieldValue } = useFormikContext();

  const { t } = useTranslation();

  /* This useEffect is specific for the IncidentForm since it uses two instances of relatedIncidentsArea which can't communicate with each other
   * When a user selects an incident as similar or dissimilar in one instance, the other instance should remove it from the notSureList
   */
  useEffect(() => {
    values?.editor_similar_incidents?.forEach((incident) => {
      if (notSureList.includes(incident)) {
        removeFromNotSureList(incident);
      }
    });

    values?.editor_dissimilar_incidents?.forEach((incident) => {
      if (notSureList.includes(incident)) {
        removeFromNotSureList(incident);
      }
    });
  }, [values.editor_similar_incidents, values.editor_dissimilar_incidents]);

  return (
    <div>
      <Button.Group data-cy="similar-selector" id="similar-selector">
        {[
          {
            identifier: 'dissimilar',
            variant: 'failure',
            text: t('No'),
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
            text: t('Not sure'),
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
            text: t('Yes'),
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
        ].map((button, index) => {
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

          if (index === 1) {
            btnProps.className = 'rounded-none';
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
