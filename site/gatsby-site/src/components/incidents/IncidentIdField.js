import { useQuery } from '@apollo/client';
import Label from 'components/forms/Label';
import { useField } from 'formik';
import React, { useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_INCIDENT } from '../../graphql/incidents';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHashtag } from '@fortawesome/free-solid-svg-icons';

export default function IncidentIdField({
  name,
  placeHolder = '',
  className = '',
  showIncidentData = true,
  disabled = false,
  required = false,
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
    <Form.Group className={className + ' '}>
      <div className="flex items-center">
        <FontAwesomeIcon
          fixedWidth
          icon={faHashtag}
          title={t('Incident ID')}
          className="mb-2 mr-1"
        />
        <Label popover={name} label={(required ? '*' : '') + t('Incident ID')} />
      </div>
      <Form.Control
        className={`mt-1 bg-gray-50 border text-gray-900 text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:placeholder-gray-400 dark:text-white ${
          error
            ? 'border-red-600 focus:ring-red-500'
            : 'border-gray-300 dark:border-gray-600 dark:focus:border-blue-500 focus:border-blue-500 focus:ring-blue-500 dark:focus:ring-blue-500'
        }`}
        type="number"
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onWheel={(event) => event.currentTarget.blur()}
        isInvalid={!!error}
        placeholder={placeHolder}
        disabled={disabled}
      />
      <span className="text-red-700 text-sm">
        <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
      </span>

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
  );
}
