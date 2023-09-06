import React, { useCallback, useEffect, useMemo, useState } from 'react';
import queryTypes from 'components/systems/queryTypes';
import AddTaxonomyModal from './AddTaxonomyModal';
import { gql, useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { Button, Card, Spinner } from 'flowbite-react';
import Results from './Results';
import { Trans } from 'react-i18next';
import serializeQuery from './serializeQuery';
import encodeQuery from './encodeQuery';
import decodeQuery from './decodeQuery';
import { useLocation } from '@reach/router';
import { navigate } from 'gatsby';

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

const defaultQuery = (location) => {
  const { filters } = decodeQuery(location.search.substr(1));

  return { filters };
};

const isValidQuery = (q) => {
  if (!q) {
    return false;
  }

  if (!q.length) {
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

export default function Systems() {
  const location = useLocation();

  const [findSystems, { loading: loadingSystems, data }] = useLazyQuery(FIND_SYSTEMS);

  const [findIncidents, { loading: loadingIncidents, data: dataIncidents }] =
    useLazyQuery(FIND_INCIDENTS);

  const [filters, setFilters] = useState(null);

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

  const search = (filters) => {
    if (isValidQuery(filters)) {
      const fullQuery = serializeQuery(filters);

      findSystems({ variables: { input: { query: fullQuery } } });

      const encoded = encodeQuery(filters);

      navigate(`?${encoded}`);
    }
  };

  const debouncedSearch = useMemo(() => debounce(search, 2000), []);

  useEffect(() => {
    setFilters(defaultQuery(location).filters);
  }, []);

  useEffect(() => {
    debouncedSearch(filters);

    return () => debouncedSearch.cancel();
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

  return (
    <>
      <Button onClick={() => setShowTaxonomyModal(true)}>Add Taxonomy</Button>

      {filters && filters.length > 0 && (
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
            {incidentResults?.length && (
              <Trans>{{ length: incidentResults.length }} Incidents Found</Trans>
            )}
            {incidentResults?.length == 0 && <Trans>No incidents found</Trans>}
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
