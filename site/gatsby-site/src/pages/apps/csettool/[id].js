import React, { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import AiidHelmet from 'components/AiidHelmet';
import { useQuery } from '@apollo/client/react';
import ListSkeleton from 'elements/Skeletons/List';
import { FIND_CLASSIFICATION } from '../../../graphql/classifications';
import CsetTable from 'components/classifications/CsetTable';
import { graphql } from 'gatsby';

const allNamespaces = ['CSETv1_Annotator-1', 'CSETv1_Annotator-2', 'CSETv1_Annotator-3'];

const ToolPage = (props) => {
  const {
    location: { pathname },
    params: { id: incident_id },
    data: { taxa },
  } = props;

  const { data, loading } = useQuery(FIND_CLASSIFICATION, {
    variables: { query: { incident_id, namespace_in: allNamespaces } },
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.classifications) {
      const rows = [];

      for (const attribute of taxa.field_list) {
        // there are duplicated short_names in the field_list
        if (!rows.find((row) => row.short_name === attribute.short_name)) {
          const row = {
            short_name: attribute.short_name,
            display_type: attribute.display_type,
            incident_id: parseInt(incident_id),
          };

          for (const classification of data.classifications) {
            const json = classification.attributes.find(
              (a) => a.short_name == attribute.short_name
            ).value_json;

            const value = JSON.parse(json);

            row[classification.namespace] = value;
          }

          rows.push(row);
        }
      }

      rows.push({
        short_name: 'notes',
        ...data.classifications.reduce((acc, obj) => {
          acc[obj.namespace] = obj.notes;
          return acc;
        }, {}),
      });

      setTableData(rows);
    }
  }, [data]);

  return (
    <Layout {...props} className="w-full">
      <AiidHelmet path={pathname}>
        <title>CSET Tool</title>
      </AiidHelmet>
      <div className="w-full max-w-full">
        {loading ? (
          <ListSkeleton />
        ) : (
          <>
            {data?.classifications.length > 0 && tableData.length ? (
              <CsetTable
                data={tableData}
                setTableData={setTableData}
                taxa={taxa}
                incident_id={incident_id}
              />
            ) : (
              <div>No classifications found.</div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default ToolPage;

export const query = graphql`
  query CsetToolPageQuery {
    taxa: mongodbAiidprodTaxa(namespace: { eq: "CSETv1" }) {
      field_list {
        short_name
        mongo_type
        display_type
      }
    }
  }
`;
