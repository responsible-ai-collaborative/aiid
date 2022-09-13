import { useQuery } from '@apollo/client';
import Label from 'components/forms/Label';
import { useField } from 'formik';
import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_INCIDENT } from '../../graphql/incidents';

export default function IncidentIdField({
  name,
  placeHolder = '',
  className = '',
  showIncidentData = true,
}) {
  const { t } = useTranslation(['validation']);

  const validate = async (value) => {
    if (value) {
      const result = await refetch({ query: { incident_id: value } });

      if (!result.data?.incident) {
        return t(`Incident ID {{value}} not found!`, { value });
      }
    }
  };

  const [{ value, onChange, onBlur }, { error }] = useField({ validate, name });

  const {
    data: incident,
    loading: loadingIncident,
    refetch,
  } = useQuery(FIND_INCIDENT, { variables: { query: { incident_id: value } } });

  useEffect(() => {
    validate(value);
  }, []);

  return (
    <div className="bootstrap">
      <Form.Group className={className + ' bootstrap'}>
        <Label popover={name} label={'Incident ID'} />
        <Form.Control
          type="number"
          name={name}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          onWheel={(event) => event.currentTarget.blur()}
          isInvalid={!!error}
          placeholder={placeHolder}
        />
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>

        {showIncidentData && value !== '' && !error && (
          <div className="pt-1">
            {loadingIncident && (
              <div className="small">
                <Trans>Searching...</Trans>
              </div>
            )}

            {incident?.incident && (
              <>
                <div className="small">{incident.incident.date}</div>
                <a href={`/cite/${incident.incident.incident_id}`}> {incident.incident.title}</a>
              </>
            )}
          </div>
        )}
      </Form.Group>
    </div>
  );
}
