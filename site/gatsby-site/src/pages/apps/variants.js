import React, { useEffect, useState } from 'react';
import { useQuery, useApolloClient } from '@apollo/client';
import { useTranslation } from 'react-i18next';
import { Spinner } from 'flowbite-react';
import LayoutHideSidebar from '../../components/LayoutHideSidebar';
import VariantsTable from '../../components/variants/VariantsTable';
import { FIND_VARIANTS } from '../../graphql/variants';
import { FIND_INCIDENTS } from '../../graphql/incidents';
import AiidHelmet from '../../components/AiidHelmet';
import ListSkeleton from 'elements/Skeletons/List';
import { getVariantStatus } from '../../utils/variants';

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

  const [isLoading, setIsLoading] = useState(false);

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
                status: getVariantStatus(variant),
              };

              fullData.push(fullDataItem);
            }
          }

          setData(fullData);

          setIsLoading(false);
        });
    }
  }, [variantsData]);

  const { t } = useTranslation();

  const setLoading = (loading) => {
    setIsLoading(loading);
  };

  return (
    <LayoutHideSidebar {...props}>
      <AiidHelmet canonicalUrl={'/apps/variants'}>
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
    </LayoutHideSidebar>
  );
}
