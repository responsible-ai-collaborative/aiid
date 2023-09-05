import React, { useCallback, useEffect, useState } from 'react';
import queryTypes from 'components/systems/queryTypes';
import AddTaxonomyModal from './AddTaxonomyModal';
import { formatQuery } from 'react-querybuilder';
import { gql, useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { Button, Card, Spinner } from 'flowbite-react';
import Results from './Results';
import { Trans } from 'react-i18next';

const FIND_SYSTEMS = gql`
  query FindSystems($input: FindSystemsQueryInput) {
    findSystems(input: $input) {
      results {
        incidents
        namespace
        reports
      }
    }
  }
`;

const FIND_INCIDENTS = gql`
  query FindIncidents($query: IncidentQueryInput) {
    incidents(query: $query, limit: 9999) {
      incident_id
      title
      description
      reports {
        report_number
        title
        description
        cloudinary_id
        source_domain
        url
        text
        epoch_date_published
        date_submitted
        authors
        submitters
      }
    }
  }
`;

const defaultQuery = [
  {
    type: 'taxonomy',
    id: 'taxonomy-0',
    config: {
      namespace: 'GMF',
    },
    query: {
      combinator: 'and',
      rules: [
        {
          id: '2269034f-181e-40c0-9dcf-8391af6612df',
          field: 'Full Description',
          operator: 'contains',
          valueSource: 'value',
          value: 'google',
        },
      ],
      id: '888ab004-6285-4b64-8f70-437f3429e292',
    },
  },
];

const isValidQuery = (q) => {
  if (q.length == 0) {
    return false;
  }

  if (q.some((filter) => !filter.query || filter.query.rules.length == 0)) {
    return false;
  }

  if (q.some((filter) => filter.query.rules.some((rule) => !rule.value))) {
    return false;
  }

  return true;
};

const isDate = (value) => value.match(/^\d{4}-\d{2}-\d{2}$/);

const formatValue = (value) => (isDate(value) ? `ISODate("${value}")` : value);

const getOperation = (rule) => {
  switch (rule.operator) {
    case 'contains':
      return { $regex: rule.value, $options: 'i' };

    case '=':
      return { $eq: formatValue(rule.value) };

    case '!=':
      return { $ne: formatValue(rule.value) };

    case 'in':
      return { $in: rule.value };

    case 'notIn':
      return { $nin: rule.value };

    case 'between': {
      const [value1, value2] = rule.value.map((v) => formatValue(v));

      return { $gt: value1, $lt: value2 };
    }

    case '>=':
      return { $gt: formatValue(rule.value) };

    case '<=':
      return { $gt: formatValue(rule.value) };

    default:
      throw new Error(`Unknown operator ${rule.operator}`);
  }
};

export default function Systems() {
  const [findSystems, { loading: loadingSystems, data }] = useLazyQuery(FIND_SYSTEMS);

  const [findIncidents, { loading: loadingIncidents, data: dataIncidents }] =
    useLazyQuery(FIND_INCIDENTS);

  const debouncedFindSystems = useCallback(debounce(findSystems, 2000), []);

  const [filters, setFilters] = useState(defaultQuery);

  const [incidentResults, setIncidentResults] = useState(null);

  const display = 'list';

  const viewType = 'reports'; // 'incidents';

  const [showTaxonomyModal, setShowTaxonomyModal] = useState(false);

  const addFilter = useCallback(
    (type, config) => {
      const count = filters.filter((filter) => filter.type === type).length;

      const id = `${type}-${count}`;

      setFilters((filters) => [...filters, { type, id, config }]);
    },
    [filters]
  );

  const removeFilter = useCallback(
    (id) => {
      setFilters((filters) => filters.filter((filter) => filter.id !== id));
    },
    [filters]
  );

  useEffect(() => {
    if (isValidQuery(filters)) {
      const queries = filters
        .filter((filter) => filter.query)
        .map((filter) =>
          formatQuery(filter.query, {
            format: 'mongodb',
            ruleProcessor: (rule) => {
              const updated = {
                attributes: {
                  $elemMatch: {
                    short_name: rule.field,
                    value: getOperation(rule),
                  },
                },
              };

              const stringified = JSON.stringify(updated);
              // .replace(/"ISODate\(([^)]+)\)"/g, 'ISODate($1)');

              return stringified;
            },
          })
        );

      const fullQuery = `{"$or": [${queries.join(',')}]}`;

      console.log(JSON.stringify(JSON.parse(fullQuery)));

      debouncedFindSystems({ variables: { input: { query: fullQuery } } });
    }

    console.log(filters);
  }, [filters]);

  useEffect(() => {
    if (data?.findSystems?.results) {
      const incidents = data.findSystems.results.map((result) => result.incidents).flat();

      if (incidents.length) {
        findIncidents({ variables: { query: { incident_id_in: incidents } } });
      }

      setIncidentResults([]);
    }
  }, [data]);

  useEffect(() => {
    if (dataIncidents?.incidents) {
      const results = dataIncidents.incidents.map((incident) => {
        const { title, description, reports, incident_id } = incident;

        const [report] = reports;

        return {
          description: report.description,
          report_number: report.report_number,
          source_domain: report.source_domain,
          title: report.title,
          url: report.url,
          cloudinary_id: report.cloudinary_id,
          text: report.text,
          featured: 1,
          is_incident_report: true,
          incident_id,
          incident_title: title,
          incident_description: description,
          date_submitted: report.date_submitted,
          epoch_date_published: report.epoch_date_published,
          authors: report.authors,
          submitters: report.submitters,
        };
      });

      setIncidentResults(results);
    }
  }, [dataIncidents]);

  const loading = loadingSystems || loadingIncidents;

  console.log(incidentResults);

  return (
    <>
      <Button onClick={() => setShowTaxonomyModal(true)}>Add Taxonomy</Button>

      {filters.length > 0 && (
        <div className="mt-2">
          <Card>
            <div>
              {filters.map((filter) => {
                const Component = queryTypes[filter.type].default;

                return (
                  <Component
                    key={filter.id}
                    setFilters={setFilters}
                    removeFilter={removeFilter}
                    {...filter}
                  />
                );
              })}
            </div>
          </Card>
        </div>
      )}

      <h3 className="mt-3">
        {loading ? (
          <Spinner />
        ) : (
          <>
            {incidentResults?.length ? (
              <Trans>{{ length: incidentResults.length }} Incidents Found</Trans>
            ) : (
              <Trans>No incidents found</Trans>
            )}
          </>
        )}
      </h3>

      {incidentResults?.length > 0 && (
        <Results
          display={display}
          viewType={viewType}
          loading={loading}
          results={incidentResults}
        />
      )}

      {showTaxonomyModal && (
        <AddTaxonomyModal
          onClose={() => setShowTaxonomyModal(false)}
          onTaxonomySelected={(taxonomy) => addFilter('taxonomy', { namespace: taxonomy })}
        />
      )}
    </>
  );
}
