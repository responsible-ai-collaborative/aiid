import React, { useEffect, useMemo, useRef, useState } from 'react';
import queryTypes from 'components/systems/queryTypes';
import AddTaxonomyModal from './AddTaxonomyModal';
import { gql, useApolloClient } from '@apollo/client';
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
import { Trans } from 'react-i18next';

const FIND_SYSTEMS = gql`
  query FindSystems($input: FindSystemsQueryInput) {
    findSystems(input: $input) {
      results {
        incidents
        namespace
        reports
      }
      facets {
        short_name
        count
        list {
          count
          _id
        }
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

const FIND_REPORTS = gql`
  query FindReports($query: ReportQueryInput!) {
    reports(query: $query) {
      url
      title
      description
      authors
      submitters
      date_published
      date_downloaded
      date_modified
      date_submitted
      epoch_date_downloaded
      epoch_date_modified
      epoch_date_published
      epoch_date_submitted
      image_url
      cloudinary_id
      text
      plain_text
      source_domain
      tags
      flag
      report_number
      editor_notes
      language
      is_incident_report
      user {
        userId
      }
      embedding {
        from_text_hash
        vector
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

  const client = useApolloClient();

  const [searching, setSearching] = useState(false);

  const [results, setResults] = useState(null);

  const [facets, setFacets] = useState([]);

  const abortControllerRef = useRef(null);

  const findSystems = async ({ variables }) => {
    console.log('findsystems start, set results null');

    setSearching(true);
    setResults(null);
    setFacets([]);

    const result = await client.query({
      query: FIND_SYSTEMS,
      variables,
      context: { fetchOptions: abortControllerRef.current },
    });

    const {
      data: {
        findSystems: { results, facets },
      },
    } = result;

    console.log('findSystems complete set results', results, facets);

    setResults([...results]);
    setFacets([...facets]);
    setSearching(false);
  };

  const [incidentResults, setIncidentResults] = useState(null);

  const [loadingIncidents, setLoadingIncidents] = useState(false);

  const [incidents, setIncidents] = useState(null);

  const findIncidents = async (options) => {
    console.log('findIncidents', options);

    setLoadingIncidents(true);
    setIncidents(null);

    const result = await client.query({
      query: FIND_INCIDENTS,
      context: { fetchOptions: abortControllerRef.current },
      ...options,
    });

    console.log('findIncidents result', result);

    setIncidents([...result.data.incidents]);
    setLoadingIncidents(false);
  };

  const [reportResults, setReportResults] = useState(null);

  const [loadingReports, setLoadingReports] = useState(false);

  const [reports, setReports] = useState(null);

  const findReports = async (options) => {
    console.log('findReports', options);

    setLoadingReports(true);
    setReports(null);

    const result = await client.query({
      query: FIND_REPORTS,
      context: { fetchOptions: abortControllerRef.current },
      ...options,
    });

    console.log('findReports result', result);

    setReports([...result.data.reports]);
    setLoadingReports(false);
  };

  const [filters, setFilters] = useState(null);

  const display = 'list';

  const viewType = 'reports'; // 'incidents';

  const [collapsed, setCollapsed] = useState(false);

  const [showTaxonomyModal, setShowTaxonomyModal] = useState(false);

  const addFilter = (type, config) =>
    setFilters((filters) => {
      const count = filters.length + 1;

      const id = `${type}-${count}`;

      return [...filters, { type, id, config }];
    });

  const removeFilter = (id) =>
    setFilters((filters) => filters.filter((filter) => filter.id !== id));

  const search = (filters) => {
    const serialized = serializeQuery(filters);

    console.log('perform search');

    setIncidentResults(null);
    setReportResults(null);

    findSystems({ variables: { input: { query: serialized } } });
  };

  const debouncedSearch = useMemo(() => debounce(search, 2000), []);

  useEffect(() => {
    console.log('init');

    setFilters(getInitialQuery(location).filters);
  }, []);

  useEffect(() => {
    if (isValidQuery(filters) && filters?.every((filter) => filter.initialized)) {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      abortControllerRef.current = new AbortController();

      const encoded = encodeQuery(filters);

      navigate(`?${encoded}`);

      console.log('debounced search', filters);
      debouncedSearch(filters);
    } else if (filters?.length == 0) {
      debouncedSearch(filters);

      navigate(`?`);
    }

    return () => debouncedSearch.cancel();
  }, [filters]);

  useEffect(() => {
    console.log('useeffect results', searching, results);

    if (!searching && results?.length >= 0) {
      const incidents = results.map((result) => result.incidents).flat();

      const reports = results.map((result) => result.reports).flat();

      if (incidents.length) {
        console.log('fetching incidents', incidents);

        findIncidents({ variables: { query: { incident_id_in: incidents } } });
      } else {
        console.log('no incident results', incidents);

        setIncidentResults([]);
      }

      if (reports.length) {
        console.log('fetching reports', reports);

        findReports({ variables: { query: { report_number_in: reports } } });
      } else {
        console.log('no report results', reports);

        setReportResults([]);
      }
    }
  }, [results, searching]);

  useEffect(() => {
    console.log('useeffect dataIncidents', incidents);

    if (incidents?.length) {
      const results = incidents.map((incident) => {
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
  }, [incidents]);

  useEffect(() => {
    console.log('useeffect dataReports', reports);

    if (reports?.length) {
      const results = reports.map((report) => {
        return {
          description: report.description,
          report_number: report.report_number,
          source_domain: report.source_domain,
          title: report.title,
          url: report.url,
          cloudinary_id: report.cloudinary_id,
          image_url: report.image_url,
          text: report.text,
          featured: 1,
          is_incident_report: false,
          incident_id: 0,
          incident_title: report.title,
          incident_description: report.description,
          date_submitted: report.date_submitted,
          epoch_date_published: report.epoch_date_published,
          authors: report.authors,
          submitters: report.submitters,
        };
      });

      setReportResults(results);
    }
  }, [reports]);

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
                    facets={facets}
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
        headingComponent={({ results }) => (
          <>
            {results.length > 0 && <Trans>{{ length: results.length }} Incidents found</Trans>}
            {results.length == 0 && <Trans>No Incidents found</Trans>}
          </>
        )}
      />

      <Results
        display={display}
        viewType={viewType}
        filters={filters}
        searching={searching}
        fetching={loadingReports}
        results={reportResults}
        headingComponent={({ results }) => (
          <>
            {results.length > 0 && <Trans>{{ length: results.length }} Reports found</Trans>}
            {results.length == 0 && <Trans>No Reports found</Trans>}
          </>
        )}
      />

      {showTaxonomyModal && (
        <AddTaxonomyModal
          onClose={() => setShowTaxonomyModal(false)}
          onTaxonomySelected={(namespace) =>
            addFilter('taxonomy', { namespace, query: { combinator: 'or', rules: [] } })
          }
        />
      )}
    </>
  );
}
