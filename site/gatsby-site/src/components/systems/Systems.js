import React, { useCallback, useEffect, useMemo, useState } from 'react';
import queryTypes from 'components/systems/queryTypes';
import AddTaxonomyModal from './AddTaxonomyModal';
import { gql, useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { Button } from 'flowbite-react';
import Results from './Results';
import serializeQuery from './serializeQuery';
import encodeQuery from './encodeQuery';
import { useLocation } from '@reach/router';
import { navigate } from 'gatsby';
import getInitialQuery from './getInitialQuery';
import isValidFilter from './isValidFilter';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleUp } from '@fortawesome/free-solid-svg-icons';

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

const isValidQuery = (q) => {
  if (!q) {
    return false;
  }

  if (!q.length) {
    return false;
  }

  if (q.some((filter) => !isValidFilter(filter.config.query))) {
    return false;
  }

  return true;
};

export default function Systems() {
  const location = useLocation();

  const [aborter, setAborter] = useState(new AbortController());

  const [findSystems, { loading: searching, data }] = useLazyQuery(FIND_SYSTEMS, {
    context: { fetchOptions: { signal: aborter.signal } },
  });

  const [findIncidents, { loading: loadingIncidents, data: dataIncidents }] = useLazyQuery(
    FIND_INCIDENTS,
    { context: { fetchOptions: { signal: aborter.signal } } }
  );

  const [filters, setFilters] = useState(null);

  const [incidentResults, setIncidentResults] = useState(null);

  const display = 'list';

  const viewType = 'reports'; // 'incidents';

  const [collapsed, setCollapsed] = useState(false);

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
    const serialized = serializeQuery(filters);

    console.log('perform search');

    aborter.abort();
    setAborter(new AbortController());

    setIncidentResults(null);

    findSystems({ variables: { input: { query: serialized } } });
  };

  const debouncedSearch = useMemo(() => debounce(search, 2000), []);

  useEffect(() => {
    console.log('init');

    setFilters(getInitialQuery(location).filters);
  }, []);

  useEffect(() => {
    if (isValidQuery(filters) && filters?.every((filter) => filter.initialized)) {
      console.log('debounced search', filters);

      const encoded = encodeQuery(filters);

      navigate(`?${encoded}`);

      debouncedSearch(filters);
    } else if (filters?.length == 0) {
      navigate(`?`);
    }

    return () => debouncedSearch.cancel();
  }, [filters]);

  useEffect(() => {
    if (data?.findSystems?.results) {
      const incidents = data.findSystems.results.map((result) => result.incidents).flat();

      if (incidents.length) {
        console.log('fetch', incidents);

        findIncidents({ variables: { query: { incident_id_in: incidents } } });
      } else {
        console.log('no results', incidents);

        setIncidentResults([]);
      }
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

  return (
    <>
      <div className="border">
        <div className="flex justify-between p-2">
          <div>Search</div>
          <Button size="xs" onClick={() => setCollapsed((c) => !c)} color="light">
            <FontAwesomeIcon icon={collapsed ? faAngleDown : faAngleUp} />
          </Button>
        </div>

        <div className={collapsed ? 'hidden' : ''}>
          {filters?.length > 0 && (
            <div>
              {filters.map((filter) => {
                const Component = queryTypes[filter.type].default;

                return (
                  <Component
                    key={filter.id}
                    id={filter.id}
                    setFilters={setFilters}
                    removeFilter={removeFilter}
                    config={filter.config}
                  />
                );
              })}
            </div>
          )}

          <div className="p-2">
            <Button size="xs" onClick={() => setShowTaxonomyModal(true)}>
              Add Taxonomy
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-2">
        {filters?.length == 0 && (
          <div className="mt-2">
            <h4>No filters set</h4>
          </div>
        )}
      </div>

      <Results
        display={display}
        viewType={viewType}
        filters={filters}
        searching={searching}
        fetching={loadingIncidents}
        results={incidentResults}
      />

      {showTaxonomyModal && (
        <AddTaxonomyModal
          onClose={() => setShowTaxonomyModal(false)}
          onTaxonomySelected={(namespace) =>
            addFilter('taxonomy', { namespace, query: { combinator: 'and', rules: [] } })
          }
        />
      )}
    </>
  );
}
