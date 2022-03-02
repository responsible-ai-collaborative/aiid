import React, { useEffect, useState, useCallback } from 'react';
import { ListGroup, Card } from 'react-bootstrap';
import Loader from 'components/ui/Loader';
import { debounce } from 'debounce';
import config from '../../config';
import { subWeeks, addWeeks } from 'date-fns';
import styled from 'styled-components';
import { useUserContext } from 'contexts/userContext';

const ListContainer = styled(Card)`
  margin: 1em 0;
`;

const DEFAULT_RESULTS = {
  incident_id: {
    header: 'Incidents reports matched by ID',
    reports: [],
  },
  epoch_date_published: {
    header: 'Incidents reports matched by published date',
    reports: [],
  },
  authors: {
    header: 'Incidents reports matched by authors',
    reports: [],
  },
  url: {
    header: 'Incidents reports matched by URL',
    reports: [],
  },
};

const RelatedIncidents = ({ incident = {}, isSubmitted }) => {
  const { incident_id, date_published, authors, url } = incident;

  const [loading, setLoading] = useState(true);

  const [related, setRelated] = useState(DEFAULT_RESULTS);

  const [queryConditions, setQueryConditions] = useState({});

  const [prevIncident, setPrevIncident] = useState(0);

  const [prevDatePublished, setPrevDatePublished] = useState(0);

  const [prevAuthors, setPrevAuthors] = useState('');

  const [prevUrl, setPrevUrl] = useState('');

  const { user } = useUserContext();

  const addQueryCondition = (condition) => {
    let newConditions = queryConditions;

    for (const key in condition) {
      newConditions[key] = condition[key];
    }

    if (isSubmitted) {
      setQueryConditions({ ...newConditions });
    } else {
      setQueryConditions({ ...condition });
    }
  };

  const addQueryConditionDebounced = useCallback(
    debounce((condition) => addQueryCondition(condition), 500),
    []
  );

  const queryByIncidentId = async () => {
    if (prevIncident !== incident_id && incident_id) {
      setPrevIncident(incident_id);

      const parsed = parseInt(incident_id);

      console.log('Seeking incidents related with incident_id: ', incident_id);
      if (isNaN(parsed)) {
        setRelated({
          ...related,
          incident_id: {
            header: related.incident_id.header,
            reports: [],
          },
        });
        return;
      }

      // const res = await useRunQuery({ incident_id: parsed });
      addQueryCondition({ incident_id: parsed });
    }
  };

  const queryByDatePublished = () => {
    if (prevDatePublished !== date_published && date_published) {
      setPrevDatePublished(date_published);
      const inputEpochDatePublished = new Date(date_published).getTime();

      if (isSubmitted) {
        addQueryCondition({
          epoch_date_published: {
            $gte: subWeeks(inputEpochDatePublished, 2).getTime() / 1000,
            $lt: addWeeks(inputEpochDatePublished, 2).getTime() / 1000,
          },
        });
      } else {
        addQueryConditionDebounced({
          epoch_date_published: {
            $gte: subWeeks(inputEpochDatePublished, 2).getTime() / 1000,
            $lt: addWeeks(inputEpochDatePublished, 2).getTime() / 1000,
          },
        });
      }
    }
  };

  const queryByAuthors = () => {
    if (prevAuthors !== authors && authors) {
      setPrevAuthors(authors);
      let authorsArray = authors;

      if (!Array.isArray(authorsArray)) {
        authorsArray = authors.split(',').map((author) => author.trim());
      }

      if (isSubmitted) {
        addQueryCondition({
          authors: {
            $in: authorsArray,
          },
        });
      } else {
        addQueryConditionDebounced({
          authors: {
            $in: authorsArray,
          },
        });
      }
    }
  };

  const queryByUrl = () => {
    if (prevUrl !== url && url) {
      setPrevUrl(url);
      if (isSubmitted) {
        addQueryCondition({
          url: {
            $eq: url,
          },
        });
      } else {
        addQueryConditionDebounced({
          url: {
            $eq: url,
          },
        });
      }
    }
  };

  useEffect(() => {
    const queryRelatedIncidents = async () => {
      const query = { $or: [] };

      for (const conditionKey in queryConditions) {
        query.$or.push({
          [conditionKey]: queryConditions[conditionKey],
        });
      }

      let results = [];

      if (query.$or.length > 0) {
        setLoading(true);
        for (const q of query.$or) {
          for (const key in q) {
            const res = await user
              .mongoClient(config.realm.production_db.db_service)
              .db(config.realm.production_db.db_name)
              .collection('incidents')
              .find(q);

            results.push({
              [key]: {
                header: related[key].header,
                reports: res,
              },
            });
          }
        }
      }

      // set related incidents
      const newRelated = {};

      for (const r of results) {
        for (const key in r) {
          newRelated[key] = {
            header: r[key].header,
            reports: r[key].reports,
          };
        }
      }

      setRelated({
        ...related,
        ...newRelated,
      });
      setLoading(false);
    };

    if (user) {
      queryRelatedIncidents();
    }
  }, [user, queryConditions]);

  useEffect(() => {
    queryByUrl();
    queryByAuthors();
    queryByDatePublished();
    queryByIncidentId();
  }, [incident]);

  if (
    !loading &&
    related.url.reports.length === 0 &&
    related.authors.reports.length === 0 &&
    related.incident_id.reports.length === 0 &&
    related.epoch_date_published.reports &&
    related.epoch_date_published.reports.length === 0
  ) {
    return (
      <span>
        Preliminary checks failed to find incident reports with similar publication dates (+/- 2
        weeks), similar incident dates (+/- 1 month), the same report URL, or the same authors.
      </span>
    );
  }

  const RelatedIncidentsArea = ({ context }) => {
    if (!context.reports || context.reports.length === 0) {
      return null;
    }

    return (
      <ListContainer>
        <ListGroup.Item variant="secondary" key={'header'}>
          {context.header}
        </ListGroup.Item>
        {context.reports.map((val) => (
          <ListGroup.Item key={val.url}>
            <a href={val.url} target="_blank" rel="noreferrer">
              {val.title}
            </a>
          </ListGroup.Item>
        ))}
      </ListContainer>
    );
  };

  return (
    <ListGroup className="position-relative">
      <Loader loading={loading} />
      <RelatedIncidentsArea context={related.incident_id} />
      <RelatedIncidentsArea context={related.epoch_date_published} />
      <RelatedIncidentsArea context={related.authors} />
      <RelatedIncidentsArea context={related.url} />
    </ListGroup>
  );
};

export default RelatedIncidents;
