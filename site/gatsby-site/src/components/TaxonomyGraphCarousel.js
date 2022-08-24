import React, { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import { gql, useQuery } from '@apollo/client';
import BillboardChart from 'react-billboardjs';
import { donut } from 'billboard.js';

// The BillboardCharts render based on
// the rendered height of the containing element.
// Since the carousel sets the hidden slides to `display: none`,
// that means we have to create a new chart
// each time carousel changes slides.
// This convinces React to let use do so.
const SlidingChart = ({ columns }) => <BillboardChart data={{ type: donut(), columns }} />;

const NonSlidingChart = ({ columns }) => <BillboardChart data={{ type: donut(), columns }} />;

const TaxonomyGraphCarousel = ({ namespace, axes }) => {
  const { data: taxaData } = useQuery(gql`
    query Taxa {
      taxa (query: { namespace: "${namespace}" }) {
        namespace
        field_list {
          permitted_values
          short_name
        }
      }
    }
  `);

  const { data: classificationsData, loading: classificationsLoading } = useQuery(gql`
    query ClassificationsInNamespace {
      classifications(query: { namespace: "${namespace}" } ) {
        incident_id
        classifications {
          ${axes.map((axis) => axis.replace(/ /g, '')).join('\n')}
          Publish
        }
      }
    }
  `);

  const includedCategories = {};

  if (taxaData) {
    for (const axis in taxaData.taxa.field_list) {
      includedCategories[axis] = taxaData.taxa.field_list[axis].permitted_values;
    }
  }

  const categoryCounts = {};

  // Format:
  //
  //  {
  //    "HarmDistributionBasis": {    <-- axis
  //      "Race": 23,                   <-- category
  //      "Sex": 10,                    <-- category
  //      ...
  //    },
  //    "Severity": {                 <-- axis
  //      "Negligable": 40,             <-- category
  //      "Minor": 20,                  <-- category
  //      ...
  //    }
  //  }
  if (!classificationsLoading && classificationsData?.classifications) {
    for (const classification of classificationsData.classifications) {
      if (!classification.classifications.Publish) {
        continue;
      }
      for (const axis in classification.classifications) {
        categoryCounts[axis] ||= {};
        const value = classification.classifications[axis];

        if (Array.isArray(value)) {
          for (const category of value) {
            categoryCounts[axis][category] ||= 0;
            categoryCounts[axis][category] += 1;
          }
        } else {
          categoryCounts[axis][value] ||= 0;
          categoryCounts[axis][value] += 1;
        }
      }
    }
  }

  for (const axis of Object.keys(categoryCounts)) {
    const categories = Object.keys(categoryCounts[axis]);

    const topCategories = categories
      .filter(
        (category) =>
          category && (!includedCategories[axis] || includedCategories[axis].includes(category))
      )
      .sort(
        (category1, category2) => categoryCounts[axis][category2] - categoryCounts[axis][category1]
      )
      .slice(0, 9);

    const bottomCategories = Object.keys(categoryCounts[axis]).filter(
      (category) => !topCategories.includes(category)
    );

    if (categories.length > 8) {
      categoryCounts[axis]['All others'] = 0;
      for (const category of bottomCategories) {
        categoryCounts[axis]['All others'] += categoryCounts[axis][category];
        delete categoryCounts[axis][category];
      }
    }
  }

  const [sliding, setSlide] = useState(false);

  return (
    !classificationsLoading && (
      <>
        <Carousel
          interval={60000}
          onSlide={() => setSlide(true)}
          onSlid={() => setSlide(false)}
          variant="dark"
        >
          {!classificationsLoading &&
            classificationsData?.classifications &&
            axes.map((axis, index) => {
              const dbAxis = axis.replace(/ /g, '');

              const columns = Object.keys(categoryCounts[dbAxis])
                .map((category) => [category, categoryCounts[dbAxis][category]])
                .sort((a, b) =>
                  a[0] == 'All others' ? 1 : b[0] == 'All others' ? -1 : b[1] - a[1]
                );

              return (
                <Carousel.Item key={index}>
                  <h3 className="tw-text-base tw-text-center">{axis}</h3>
                  <div className="tw-pb-8">
                    {sliding ? (
                      <SlidingChart columns={columns} />
                    ) : (
                      <NonSlidingChart columns={columns} />
                    )}
                  </div>
                </Carousel.Item>
              );
            })}
        </Carousel>
      </>
    )
  );
};

export default TaxonomyGraphCarousel;
