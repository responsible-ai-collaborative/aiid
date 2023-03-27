import { useQuery } from '@apollo/client';
import { useField, useFormikContext } from 'formik';
import React, { useEffect } from 'react';
import { Trans, useTranslation } from 'react-i18next';
import { FIND_INCIDENT } from '../../graphql/incidents';
import FieldContainer from 'components/forms/SubmissionWizard/FieldContainer';
import TextInputGroup from 'components/forms/TextInputGroup';

export default function IncidentIdField({
  name,
  placeHolder = '',
  showIncidentData = true,
  disabled = false,
  values,
  errors,
  touched,
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

  const { setFieldTouched } = useFormikContext();

  const {
    data: incident,
    loading: loadingIncident,
    refetch,
  } = useQuery(FIND_INCIDENT, { variables: { query: { incident_id: value } } });

  useEffect(() => {
    validate(value);
  }, []);

  return (
    <FieldContainer>
      <TextInputGroup
        label={t('Incident ID')}
        type="number"
        name={name}
        value={value}
        handleChange={(ev) => {
          setFieldTouched(name, true, true);
          onChange(ev);
        }}
        handleBlur={onBlur}
        onWheel={(event) => event.currentTarget.blur()}
        isInvalid={!!error}
        placeholder={placeHolder}
        disabled={disabled}
        values={values}
        errors={errors}
        touched={touched}
      />

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
    </FieldContainer>
  );
}
