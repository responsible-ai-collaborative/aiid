import React from 'react';
import { Carousel } from 'flowbite-react';
import BillboardChart from 'react-billboardjs';
import { donut } from 'billboard.js';
import { getClassificationValue } from 'utils/classifications';

const TaxonomyGraphCarousel = ({ namespace, axes, data }) => {
  const taxaData = data.allMongodbAiidprodTaxa;

  const classificationsData = data.allMongodbAiidprodClassifications;

  const classificationsLoading = false;

  const includedCategories = {};

  if (taxaData) {
    for (const axis in taxaData.nodes.field_list) {
      includedCategories[axis] = taxaData.nodes.field_list[axis].permitted_values;
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
  if (!classificationsLoading && classificationsData?.nodes) {
    for (const classification of classificationsData.nodes) {
      if (classification.namespace != namespace) {
        continue;
      }
      if (classification.attributes) {
        if (getClassificationValue(classification, 'Publish') === false) {
          continue;
        }
        for (const attribute of classification.attributes) {
          const axis = attribute.short_name;

          categoryCounts[axis] ||= {};
          const value = getClassificationValue(classification, axis);

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
      categoryCounts[axis]['All Others'] = 0;
      for (const category of bottomCategories) {
        categoryCounts[axis]['All Others'] += categoryCounts[axis][category];
        delete categoryCounts[axis][category];
      }
    }
  }

  return (
    !classificationsLoading && (
      <div className="h-96 dark">
        <Carousel>
          {!classificationsLoading &&
            classificationsData?.nodes &&
            axes.map((axis, index) => {
              const dbAxis = axis;

              const columns = Object.keys(categoryCounts[dbAxis])
                .map((category) => [category, categoryCounts[dbAxis][category]])
                .sort((a, b) =>
                  a[0] == 'All Others' ? 1 : b[0] == 'All Others' ? -1 : b[1] - a[1]
                );

              return (
                <div key={index} className="h-96">
                  <h3 className="text-base text-center">{axis}</h3>
                  <div className="h-96">
                    <BillboardChart
                      data={{
                        columns,
                        type: donut(),
                        onclick: (column) => {
                          if (column.name == 'All Others') {
                            window.open('/apps/discover');
                          } else {
                            window.open(
                              '/apps/discover?classifications=' +
                                [namespace, axis, column.name].join(':')
                            );
                          }
                        },
                      }}
                    />
                  </div>
                </div>
              );
            })}
        </Carousel>
      </div>
    )
  );
};

export default TaxonomyGraphCarousel;
