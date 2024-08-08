import React, { useEffect, useState } from 'react';
import HeadContent from 'components/HeadContent';
import { useQuery } from '@apollo/client/react';
import ListSkeleton from 'elements/Skeletons/List';
import { FIND_CLASSIFICATION } from '../../../graphql/classifications';
import CsetTable from 'components/classifications/CsetTable';
import { graphql } from 'gatsby';

const allNamespaces = ['CSETv1_Annotator-1', 'CSETv1_Annotator-2', 'CSETv1_Annotator-3'];

const ToolPage = (props) => {
  const {
    params: { incident_id },
    data: { taxa },
  } = props;

  const { data, loading } = useQuery(FIND_CLASSIFICATION, {
    variables: {
      filter: { incidents: { IN: parseInt(incident_id) }, namespace: { IN: allNamespaces } },
    },
  });

  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    if (data?.classifications) {
      const rows = [];

      for (const attribute of taxa.field_list) {
        const row = {
          short_name: attribute.short_name,
          display_type: attribute.display_type,
          field_number: attribute.field_number,
          incident_id: parseInt(incident_id),
        };

        for (const classification of data.classifications) {
          const item = classification.attributes.find((a) => a.short_name == attribute.short_name);

          if (item) {
            const value = JSON.parse(item.value_json);

            row[classification.namespace] = value;
          } else {
            row[classification.namespace] = null;
          }
        }

        rows.push(row);
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
    <div {...props} className="w-full">
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
    </div>
  );
};

export const Head = (props) => {
  const {
    location: { pathname },
  } = props;

  const metaTitle = 'CSET Tool';

  return <HeadContent path={pathname} metaTitle={metaTitle} metaDescription={metaTitle} />;
};

export default ToolPage;

export const query = graphql`
  query CsetToolPageQuery {
    taxa: mongodbAiidprodTaxa(namespace: { eq: "CSETv1" }) {
      field_list {
        short_name
        mongo_type
        display_type
        field_number
      }
    }
  }
`;
