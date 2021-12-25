import React, { useEffect, useRef, useState } from 'react';
import Layout from 'components/Layout';
import IncidentReportForm from 'components/forms/IncidentReportForm';
import { useUserContext } from 'contexts/userContext';
import config from '../../../config';
import { NumberParam, useQueryParam } from 'use-query-params';
import useToastContext, { SEVERITY } from '../../hooks/useToast';

function EditCitePage(props) {
  const { user } = useUserContext();

  const [report, setReport] = useState({});

  const incidents = useRef();

  const [reportNumber] = useQueryParam('reportNumber', NumberParam);

  const addToast = useToastContext();

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
    try {
      if (typeof values.authors === 'string') {
        values.authors = values.authors.split(',').map((s) => s.trim());
      }

      if (typeof values.submitters === 'string') {
        values.submitters = values.submitters.split(',').map((s) => s.trim());
      }

      const updated = { ...values };

      await incidents.current.updateOne({ report_number: reportNumber }, updated, {
        upsert: false,
      });

      addToast({
        message: `Incident report ${reportNumber} updated succesfully.`,
        severity: SEVERITY.success,
      });
    } catch (e) {
      addToast({
        message: `Error updating incident report ${reportNumber}`,
        severity: SEVERITY.danger,
      });
    }
  };

  return (
    <Layout {...props} className={'w-100'}>
      <h1 className="mb-5">Editing Incident Report {reportNumber}</h1>
      <IncidentReportForm incident={report} onUpdate={setReport} onSubmit={handleSubmit} />
    </Layout>
  );
}

export default EditCitePage;
