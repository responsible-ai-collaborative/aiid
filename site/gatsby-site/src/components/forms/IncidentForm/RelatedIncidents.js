import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import Loader from 'components/Loader';

import { useMongo } from 'mongodb/useMongo';
import config from '../../../../config';

const RelatedIncidents = ({ incident }) => {
  const { incident_id, title, date_published } = incident;

  const { runQuery } = useMongo();
  const [loading, setLoading] = useState(false);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (incident_id) {
      const parsed = parseInt(incident_id);

      console.log(incident_id);
      if (isNaN(parsed)) {
        setRelated([]);
        return;
      }

      setLoading(true);

      runQuery(
        { incident_id: parsed },
        (res) => {
          console.log(res);
          setRelated(res);
          setLoading(false);
        },
        config.realm.production_db.db_service,
        config.realm.production_db.db_name,
        config.realm.production_db.db_collection
      );
    } else if (date_published) {
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
