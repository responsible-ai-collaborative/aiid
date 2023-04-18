import React, { useEffect, useState } from 'react';
import Layout from 'components/Layout';
import AiidHelmet from 'components/AiidHelmet';
import { useQuery } from '@apollo/client/react';
import ListSkeleton from 'elements/Skeletons/List';
import { FIND_CLASSIFICATION } from '../../..//graphql/classifications';
import CsetTable from 'components/classifications/CsetTable';
import { graphql } from 'gatsby';
import { isObject } from 'lodash';

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

      for (const attribtue of taxa.field_list) {
        const row = {
          short_name: attribtue.short_name,
        };

        for (const classification of data.classifications) {
          try {
            const json = classification.attributes.find(
              (a) => a.short_name == attribtue.short_name
            ).value_json;

            const value = JSON.parse(json);

            if (isObject(value)) {
              row[classification.namespace] = JSON.stringify(value);
            } else {
              row[classification.namespace] = value;
            }
          } catch (e) {
            row.value = null;
          }
        }

        rows.push(row);
      }

      setTableData(rows);
    }
  }, [data]);

  return (
    <Layout {...props} className="w-full">
      <AiidHelmet path={pathname}>
        <title>Test</title>
      </AiidHelmet>
      <div className="w-full max-w-full">
        {loading ? (
          <ListSkeleton />
        ) : (
          <>
            {data?.classifications.length > 0 && tableData.length ? (
              <CsetTable data={tableData} />
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
      }
    }
  }
`;
