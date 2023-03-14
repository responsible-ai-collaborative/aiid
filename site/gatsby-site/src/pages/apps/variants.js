import React, { useEffect, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'flowbite-react';
import Layout from '../../components/Layout';
import VariantsTable from '../../components/variants/VariantsTable';
import { FIND_VARIANTS } from '../../graphql/variants';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import AiidHelmet from '../../components/AiidHelmet';
import ListSkeleton from 'elements/Skeletons/List';
import { getVariantStatus, isCompleteReport } from '../../utils/variants';

export default function IncidentsPage(props) {
  const { data: variantsData, refetch } = useQuery(FIND_VARIANTS);

  const [data, setData] = useState(null);

  const [isLoading, setIsLoading] = useState(false);

  const client = useApolloClient();

  useEffect(() => {
    if (variantsData && variantsData.reports) {
      const variants = variantsData.reports.filter((report) => !isCompleteReport(report));

      if (variants.length > 0) {
        const fullData = [];

        client
          .query({
            query: FIND_INCIDENTS,
            variables: {
              query: {
                reports_in: variants.map((report) => ({
                  report_number: report.report_number,
                })),
              },
            },
          })
          .then((result) => {
            for (const variant of variants) {
              const incident = result.data.incidents.find((incident) =>
                incident.reports.find((report) => report.report_number == variant.report_number)
              );

              if (incident) {
                const fullDataItem = {
                  ...variant,
                  incident_id: incident.incident_id,
                  title: incident.title,
                  status: getVariantStatus(variant),
                };

                fullData.push(fullDataItem);
              }
            }

            setData(fullData);

            setIsLoading(false);
          });
      } else {
        setData([]);
      }
    }
  }, [variantsData]);

  const { t } = useTranslation(['variants']);

  const setLoading = (loading) => {
    setIsLoading(loading);
  };

  return (
    <Layout sidebarCollapsed={true} {...props}>
      <AiidHelmet path={props.location.pathname}>
        <title>{t('Variants')}</title>
      </AiidHelmet>
      <div className="relative ml-6">
        {isLoading && (
          <div className="absolute bg-white bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
            <Spinner size="xl" />
          </div>
        )}
        <div className="bootstrap">
          {!data && (
            <div className="px-3">
              <ListSkeleton />
            </div>
          )}
          {data && (
            <div className="ms-3 mt-2 mb-2">
              <VariantsTable data={data} refetch={refetch} setLoading={setLoading} />
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
