import React from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { gql, useQuery } from '@apollo/client';
import BillboardChart from 'react-billboardjs';
import { donut } from 'billboard.js';

const TaxonomyGraphCarousel = ({ namespace, fields }) => {
  const dbFields = fields.map((field) => field.replace(/ /g, ''));

  const { data: classificationsData, loading: classificationsLoading } = useQuery(gql`
    query ClassificationsInNamespace {
      classifications(query: { namespace: "${namespace}" } ) {
        incident_id
        classifications {
          ${dbFields.join('\n')}
        }
      }
    }
  `);

  const billboardColumns = {};

  if (!classificationsLoading && classificationsData?.classifications) {
    for (const classification of classificationsData.classifications) {
      for (const axis in classification.classifications) {
        billboardColumns[axis] ||= {};
        const value = classification.classifications[axis];

        if (Array.isArray(value)) {
          for (const taxon of value) {
            billboardColumns[axis][taxon] ||= 0;
            billboardColumns[axis][taxon] += 1;
          }
        } else {
          billboardColumns[axis][value] ||= 0;
          billboardColumns[axis][value] += 1;
        }
      }
    }
  }

  for (const key of Object.keys(billboardColumns)) {
    const topColumns = Object.keys(billboardColumns[key])
      .filter((axis) => axis && !axis.includes('Other:') && axis != 'Other')
      .sort((axis1, axis2) => billboardColumns[key][axis2] - billboardColumns[key][axis1])
      .slice(0, 9);

    console.log(key, 'topcolumns', topColumns);
    const nonTopColumns = Object.keys(billboardColumns[key]).filter(
      (column) => !topColumns.includes(column)
    );

    console.log(key, 'nonTopColumns', nonTopColumns);
    if (Object.keys(billboardColumns[key]).length > 8) {
      billboardColumns[key]['All others'] = 0;
      for (const column of nonTopColumns) {
        billboardColumns[key]['All others'] += billboardColumns[key][column];
        delete billboardColumns[key][column];
      }
    }
    console.log(billboardColumns[key]);
  }

  console.log(`billboardColumns`, billboardColumns);

  return (
    !classificationsLoading && (
      <Carousel interval={60000}>
        {!classificationsLoading &&
          classificationsData?.classifications &&
          fields.map((field, index) => (
            <Carousel.Item key={index}>
              <h3>{field}</h3>
              <div style={{ height: '350px', maxHeight: '300px' }}>
                <BillboardChart
                  data={{
                    type: donut(),
                    columns: Object.keys(billboardColumns[field.replace(/ /g, '')])
                      .map((key) => [key, billboardColumns[field.replace(/ /g, '')][key]])
                      .sort((a, b) => (a[0] == 'All others' ? 1 : b[1] - a[1])),
                  }}
                />
              </div>
            </Carousel.Item>
          ))}
      </Carousel>
    )
  );
};

export default TaxonomyGraphCarousel;
