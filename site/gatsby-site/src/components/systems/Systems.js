import React, { useCallback, useEffect, useState } from 'react';
import queryTypes from 'components/systems/queryTypes';
import AddTaxonomyModal from './AddTaxonomyModal';
import { formatQuery } from 'react-querybuilder';
import { gql, useLazyQuery } from '@apollo/client';
import { debounce } from 'lodash';
import { Button, Card } from 'flowbite-react';
import CardSkeleton from 'elements/Skeletons/Card';
import ListSkeleton from 'elements/Skeletons/List';
import Hit from './Hit';

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

export default function Systems() {
  const [findSystems, { loading: loadingSystems, data }] = useLazyQuery(FIND_SYSTEMS);

  const [findIncidents, { loading: loadingIncidents, data: dataIncidents }] =
    useLazyQuery(FIND_INCIDENTS);

  const debouncedFindSystems = useCallback(debounce(findSystems, 2000), []);

  const [filters, setFilters] = useState([]);

  const display = 'list';

  const viewType = 'reports'; // 'incidents';

  // const [filters, setFilters] = useState([]);

  const [showTaxonomyModal, setShowTaxonomyModal] = useState(false);

  const addFilter = useCallback(
    (type, config) => {
      const count = filters.filter((filter) => filter.type === type).length;

      const id = `${type}-${count}`;

      setFilters((filters) => [...filters, { type, id, config }]);
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
              const getOperation = (rule) => {
                switch (rule.operator) {
                  case 'contains':
                    return { $regex: rule.value, $options: 'i' };
                }
              };

              const updated = {
                attributes: {
                  $elemMatch: {
                    short_name: rule.field,
                    value: getOperation(rule),
                  },
                },
              };

              const stringified = JSON.stringify(updated);

              return stringified;
            },
          })
        );

      const fullQuery = `{"$or": [${queries.join(',')}]}`;

      console.log(JSON.parse(fullQuery));
      console.log(JSON.stringify(JSON.parse(fullQuery)));

      debouncedFindSystems({ variables: { input: { query: fullQuery } } });
    }

    console.log(filters);
  }, [filters]);

  useEffect(() => {
    if (data?.findSystems?.results?.length) {
      const incidents = data.findSystems.results.map((result) => result.incidents).flat();

      findIncidents({ variables: { query: { incident_id_in: incidents } } });

      setResults([]);
    }
  }, [data]);

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (dataIncidents?.incidents) {
      const results = dataIncidents.incidents.map(({ title, description, reports }) => {
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
          incident_title: title,
          incident_description: description,
          date_submitted: report.date_submitted,
          epoch_date_published: report.epoch_date_published,
          authors: report.authors,
          submitters: report.submitters,
        };
      });

      setResults(results);
    }
  }, [dataIncidents]);

  console.log('bue', dataIncidents?.incidents);

  const loading = loadingSystems || loadingIncidents;

  return (
    <>
      <Button onClick={() => setShowTaxonomyModal(true)}>Add Taxonomy</Button>

      {filters.length > 0 && (
        <div className="mt-2">
          <Card>
            <div>
              {filters.map((filter) => {
                const Component = queryTypes[filter.type].default;

                return <Component key={filter.id} setFilters={setFilters} {...filter} />;
              })}
            </div>
          </Card>
        </div>
      )}

      <div
        data-cy="hits-container"
        style={{
          gridTemplateColumns: {
            compact: 'repeat( auto-fit, minmax(18rem, 1fr) )',
            details: 'repeat( auto-fit, minmax(18rem, 1fr) )',
            list: '1fr',
          }[display],
        }}
        className={`grid gap-2 mt-4 mx-auto px-3 w-full lg:max-w-6xl xl:max-w-7xl`}
      >
        {loading ? (
          display === 'list' ? (
            <ListSkeleton />
          ) : (
            Array(24)
              .fill()
              .map((_skeleton, i) => (
                <CardSkeleton key={i} className="m:inline-block ml-3" text={display == 'details'} />
              ))
          )
        ) : (
          results.map((result) => <Hit key={result.objectID} item={result} viewType={viewType} />)
        )}
      </div>

      {showTaxonomyModal && (
        <AddTaxonomyModal
          onClose={() => setShowTaxonomyModal(false)}
          onTaxonomySelected={(taxonomy) => addFilter('taxonomy', { namespace: taxonomy })}
        />
      )}
    </>
  );
}
