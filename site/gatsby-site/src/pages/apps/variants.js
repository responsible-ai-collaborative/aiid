import React, { useEffect, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { Trans, useTranslation } from 'react-i18next';
import { Spinner } from 'flowbite-react';
import LayoutHideSidebar from '../../components/LayoutHideSidebar';
import VariantsTable from '../../components/variants/VariantsTable';
import { FIND_VARIANTS } from '../../graphql/variants';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import AiidHelmet from '../../components/AiidHelmet';

export default function IncidentsPage(props) {
  const { data: variantsData, refetch } = useQuery(FIND_VARIANTS, {
    variables: {
      query: {
        AND: [
          { text_inputs_exists: true },
          { text_outputs_exists: true },
          { text_inputs_ne: '' },
          { text_outputs_ne: '' },
        ],
      },
    },
  });

  const [data, setData] = useState(null);

  const client = useApolloClient();

  useEffect(() => {
    if (variantsData && variantsData.reports) {
      const fullData = [];

      client
        .query({
          query: FIND_INCIDENTS,
          variables: {
            query: {
              reports_in: variantsData.reports.map((report) => ({
                report_number: report.report_number,
              })),
            },
          },
        })
        .then((result) => {
          for (const variant of variantsData.reports) {
            const incident = result.data.incidents.find((incident) =>
              incident.reports.find((report) => report.report_number == variant.report_number)
            );

            if (incident) {
              const fullDataItem = {
                ...variant,
                incident_id: incident.incident_id,
                title: incident.title,
              };

              fullData.push(fullDataItem);
            }
          }

          setData(fullData);
        });
    }
  }, [variantsData]);

  const { t } = useTranslation();

  return (
    <LayoutHideSidebar {...props}>
      <AiidHelmet canonicalUrl={'/apps/variants'}>
        <title>{t('Variants')}</title>
      </AiidHelmet>
      <div className="bootstrap">
        {!data && (
          <div className="p-4 flex justify-center align-items-center gap-2">
            <Spinner />
            <Trans>Fetching Variants...</Trans>
          </div>
        )}
        {data && (
          <div className="ms-3 mt-2 mb-2">
            <VariantsTable data={data} refetch={refetch} />
          </div>
        )}
      </div>
    </LayoutHideSidebar>
  );
}
