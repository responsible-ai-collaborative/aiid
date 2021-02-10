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
    const { db_service, db_name, db_collection } = config.realm.production_db;
    
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
        db_service,
        db_name,
        db_collection
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
        db_service,
        db_name,
        db_collection
      );
    } else {
      setRelated([]);
    }
  }, [incident]);

  if (related.length < 1) {
    return null;
  }
  return (
    <ListGroup className="position-relative mt-4">
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
