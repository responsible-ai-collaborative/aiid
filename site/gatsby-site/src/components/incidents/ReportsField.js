import React, { useEffect, useState } from 'react';
import { useField } from 'formik';
import { useApolloClient } from '@apollo/client';
import { Badge, Button, Spinner, TextInput } from 'flowbite-react';
import { Trans, useTranslation } from 'react-i18next';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FIND_REPORTS_TITLES } from '../../graphql/reports';
import { FIND_INCIDENTS_BY_REPORTS } from '../../graphql/incidents';

/**
 * Picks existing reports by report number, for linking them to an incident.
 *
 * A report may belong to more than one incident: an article that covers several
 * distinct incidents should be the underlying report of each, not re-submitted
 * once per incident. This field lets an editor creating a new Incident ID name
 * the reports that already exist, and shows which incidents each one is already
 * part of so the choice is made knowingly. The Formik value is the list of
 * report numbers. SEE: #4052
 */
export default function ReportsField({ name, id = name, className = '' }) {
  const [{ value }, , { setTouched, setValue }] = useField({ name });

  const client = useApolloClient();

  const { t } = useTranslation();

  const [input, setInput] = useState('');

  const [checking, setChecking] = useState(false);

  const [error, setError] = useState(null);

  // Details of the selected reports, keyed by report number.
  const [details, setDetails] = useState({});

  const selected = value || [];

  useEffect(() => {
    const missing = selected.filter((number) => !details[number]);

    if (missing.length === 0) return;

    (async () => {
      const [{ data: reportsData }, { data: incidentsData }] = await Promise.all([
        client.query({
          query: FIND_REPORTS_TITLES,
          variables: { filter: { report_number: { IN: missing } } },
        }),
        client.query({
          query: FIND_INCIDENTS_BY_REPORTS,
          variables: { filter: { reports: { IN: missing } } },
        }),
      ]);

      setDetails((current) => {
        const next = { ...current };

        for (const number of missing) {
          const report = reportsData.reports.find((r) => r.report_number === number);

          next[number] = {
            title: report?.title ?? null,
            incidents: (incidentsData.incidents || [])
              .filter((incident) => incident.reports?.some((r) => r.report_number === number))
              .map((incident) => incident.incident_id),
          };
        }

        return next;
      });
    })().catch(() => {
      // Details are informational; the numbers themselves are validated on save.
    });
  }, [selected.join(',')]);

  const add = async () => {
    const number = parseInt(input, 10);

    setError(null);

    if (!Number.isInteger(number) || number <= 0) {
      setError(t('Enter a report number'));
      return;
    }

    if (selected.includes(number)) {
      setInput('');
      return;
    }

    setChecking(true);

    try {
      const { data } = await client.query({
        query: FIND_REPORTS_TITLES,
        variables: { filter: { report_number: { IN: [number] } } },
      });

      if (!data.reports || data.reports.length === 0) {
        setError(t('Report {{number}} does not exist', { number }));
        return;
      }

      setTouched(true);
      setValue([...selected, number]);
      setInput('');
    } catch (e) {
      setError(t('Could not look up report {{number}}', { number }));
    } finally {
      setChecking(false);
    }
  };

  const remove = (number) => {
    setTouched(true);
    setValue(selected.filter((n) => n !== number));
  };

  return (
    <div className={className} data-cy="reports-field">
      <div className="flex items-center gap-2">
        <TextInput
          id={id}
          name={`${name}-input`}
          type="number"
          min="1"
          value={input}
          placeholder={t('Report number')}
          onChange={(event) => setInput(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              add();
            }
          }}
          data-cy="reports-field-input"
        />
        <Button color="light" onClick={add} disabled={checking} data-cy="reports-field-add">
          {checking ? <Spinner size="sm" /> : <Trans>Add report</Trans>}
        </Button>
      </div>
      {error && (
        <div className="text-sm text-red-700 mt-1" data-cy="reports-field-error">
          {error}
        </div>
      )}
      {selected.length > 0 && (
        <ul className="mt-3 flex flex-col gap-2">
          {selected.map((number) => (
            <li
              key={number}
              className="flex items-center gap-2 text-sm"
              data-cy="reports-field-report"
            >
              <Badge color="info">#{number}</Badge>
              <span className="truncate">{details[number]?.title ?? '…'}</span>
              {details[number]?.incidents?.length > 0 && (
                <span className="text-gray-500 whitespace-nowrap">
                  <Trans
                    incidents={details[number].incidents.join(', ')}
                    count={details[number].incidents.length}
                  >
                    also in incident {{ incidents: details[number].incidents.join(', ') }}
                  </Trans>
                </span>
              )}
              <button
                type="button"
                className="text-gray-500 hover:text-red-700"
                onClick={() => remove(number)}
                aria-label={t('Remove report {{number}}', { number })}
                data-cy="reports-field-remove"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
