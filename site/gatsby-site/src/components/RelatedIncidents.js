import React, { useEffect, useState, useRef } from 'react';
import { ListGroup } from 'react-bootstrap';
import Loader from 'components/Loader';

import config from '../../config';
import { useMongo } from 'hooks/useMongo';

const RelatedIncidents = ({ incident = {} }) => {
  const { incident_id, date_published } = incident;

  const { runQuery } = useMongo();

  const [loading, setLoading] = useState(false);

  const [related, setRelated] = useState([]);

  const prevIncident = useRef(0);

  const prevDate = useRef(0);

  useEffect(() => {
    const changed = prevIncident.current !== incident_id || prevDate.current !== date_published;

    prevIncident.current = incident_id;
    prevDate.current = date_published;

    if (changed && incident_id) {
      const parsed = parseInt(incident_id);

      console.log('Seeking incidents related with incident_id: ', incident_id);
      if (isNaN(parsed)) {
        setRelated([]);
        return;
      }

      setLoading(true);

      runQuery(
        { incident_id: parsed },
        (res) => {
          console.log('incidents related with incident_id: ', incident_id, res);
          setRelated(res);
          setLoading(false);
        },
        config.realm.production_db.db_service,
        config.realm.production_db.db_name,
        config.realm.production_db.db_collection
      );
    } else if (changed && date_published) {
      setLoading(true);

      runQuery(
        { date_published },
        (res) => {
          console.log(res);
          setRelated(res);
          setLoading(false);
        },
        config.realm.production_db.db_service,
        config.realm.production_db.db_name,
        config.realm.production_db.db_collection
      );
    }
  }, [incident]);

  if (related.length < 1) {
    return null;
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
