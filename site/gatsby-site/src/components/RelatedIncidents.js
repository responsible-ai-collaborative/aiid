import React, { useEffect, useState, useCallback } from 'react';
import { ListGroup } from 'react-bootstrap';
import Loader from 'components/Loader';
import { debounce } from 'debounce';

import config from '../../config';
import { useMongo } from 'hooks/useMongo';
import { subWeeks, addWeeks } from 'date-fns';

const useRunQuery = (query, callback) => {
  const { runQuery } = useMongo();

  runQuery(
    query,
    callback,
    config.realm.production_db.db_service,
    config.realm.production_db.db_name,
    config.realm.production_db.db_collection
  );
};

const RelatedIncidents = ({ incident = {}, isSubmitted }) => {
  const { incident_id, date_published, authors, url } = incident;

  const [loading, setLoading] = useState(false);

  const [related, setRelated] = useState([]);

  const [queryConditions, setQueryConditions] = useState({});

  const [prevIncident, setPrevIncident] = useState(0);

  const [prevDatePublished, setPrevDatePublished] = useState(0);

  const [prevAuthors, setPrevAuthors] = useState('');

  const [prevUrl, setPrevUrl] = useState('');

  const addQueryCondition = (condition) => {
    let newConditions = queryConditions;

    for (const key in condition) {
      newConditions[key] = condition[key];
    }

    setQueryConditions({ ...newConditions });
  };

  const addQueryConditionDebounced = useCallback(
    debounce((condition) => addQueryCondition(condition), 500),
    []
  );

  const queryByIncidentId = () => {
    return new Promise((resolve, reject) => {
      if (prevIncident !== incident_id && incident_id) {
        setPrevIncident(incident_id);
        let incidentEpochDate = 0;

        const parsed = parseInt(incident_id);

        console.log('Seeking incidents related with incident_id: ', incident_id);
        if (isNaN(parsed)) {
          setRelated([]);
          return;
        }

        // TODO: remove from all app division and multiplication with 1000
        try {
          useRunQuery({ incident_id: parsed }, (res) => {
            if (res[0]) {
              incidentEpochDate = res[0].epoch_incident_date * 1000;
              resolve({
                epoch_incident_date: {
                  $gte: subWeeks(incidentEpochDate, 1).getTime() / 1000,
                  $lt: addWeeks(incidentEpochDate, 1).getTime() / 1000,
                },
              });
            }
          });
        } catch (error) {
          reject(error);
        }
      }
    });
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
    const query = { $or: [] };

    for (const conditionKey in queryConditions) {
      query.$or.push({
        [conditionKey]: queryConditions[conditionKey],
      });
    }

    if (query.$or.length > 0) {
      useRunQuery(query, (res) => {
        console.log(res);
        setRelated(res);
        setLoading(false);
      });
    }
  }, [queryConditions]);

  useEffect(() => {
    setLoading(true);

    queryByUrl();
    queryByAuthors();
    queryByDatePublished();
    queryByIncidentId().then((q) => {
      addQueryCondition(q);
    });
  }, [incident]);

  if (related.length < 1) {
    return (
      <span>
        Preliminary checks failed to find incident reports with similar publication dates (+/- 2
        weeks), similar incident dates (+/- 1 month), the same report URL, or the same authors.
      </span>
    );
  }

  return (
    <ListGroup className="position-relative">
      <Loader loading={loading} />
      <ListGroup.Item key={'header'}>
        The following incident reports exist for the incident you are reporting on
      </ListGroup.Item>
      {related.map((val) => (
        <ListGroup.Item key={val.url}>
          <a href={val.url} target="_blank" rel="noreferrer">
            {val.title}
          </a>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default RelatedIncidents;
