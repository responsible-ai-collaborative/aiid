import { useLazyQuery } from '@apollo/client';
import Label from 'components/forms/Label';
import { useField } from 'formik';
import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { FIND_INCIDENT } from '../../graphql/incidents';
import * as POP_OVERS from '../ui/PopOvers';

export default function IncidentIdField({ name, placeHolder = '', className = '' }) {
  const [findIncident, { data: incident, loading: loadingIncident }] = useLazyQuery(FIND_INCIDENT);

  const validate = async (value) => {
    if (value) {
      const result = await findIncident({ variables: { query: { incident_id: value } } });

      if (!result.data?.incident) {
        return `Incident ID ${value} not found!`;
      }
    }
  };

  const [{ value, onChange, onBlur }, { error }] = useField({ validate, name });

  useEffect(() => {
    validate(value);
  }, []);

  return (
    <Form.Group className={className}>
      <Label popover={POP_OVERS[name]} label={'Incident ID'} />
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

      {value !== '' && !error && (
        <div className="pt-1">
          {loadingIncident && <div className="small">Searching...</div>}

          {incident?.incident && (
            <>
              <div className="small">{incident.incident.date}</div>
              <a href={`/cite/${incident.incident.incident_id}`}> {incident.incident.title}</a>
            </>
          )}
        </div>
      )}
    </Form.Group>
  );
}
