import React, { useEffect, useRef, useState } from 'react';
import Layout from 'components/Layout';
import IncidentReportForm from 'components/forms/IncidentReportForm';
import { useUserContext } from 'contexts/userContext';
import config from '../../../config';
import { NumberParam, useQueryParam } from 'use-query-params';

function EditCitePage(props) {
  const { user } = useUserContext();

  const [report, setReport] = useState({});

  const incidents = useRef();

  const [reportNumber] = useQueryParam('reportNumber', NumberParam);

  useEffect(() => {
    if (user) {
      incidents.current = user
        .mongoClient(config.realm.production_db.db_service)
        .db(config.realm.production_db.db_name)
        .collection('incidents');
    }
  }, [user]);

  useEffect(() => {
    async function fetch() {
      const report = await incidents.current.findOne({ report_number: reportNumber });

      setReport(report);
    }

    if (incidents) {
      fetch();
    }
  }, [incidents]);

  const handleSubmit = async (values) => {
    if (typeof values.authors === 'string') {
      values.authors = values.authors.split(',').map((s) => s.trim());
    }

    if (typeof values.submitters === 'string') {
      values.submitters = values.submitters.split(',').map((s) => s.trim());
    }

    const updated = { ...values };

    await incidents.current.updateOne({ report_number: reportNumber }, updated, { upsert: false });
  };

  return (
    <Layout {...props} className={'w-100'}>
      <h1 className="mb-5">Editing Incident Report {reportNumber}</h1>
      <IncidentReportForm incident={report} onUpdate={setReport} onSubmit={handleSubmit} />
    </Layout>
  );
}

export default EditCitePage;
