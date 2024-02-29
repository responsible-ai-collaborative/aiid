import React from 'react';
import REFINEMENT_LISTS from 'components/discover/REFINEMENT_LISTS';
import Filter from './Filter';
import { graphql, useStaticQuery } from 'gatsby';

function Filters({ expandFilters }) {
  const {
    taxa: { nodes: taxa },
  } = useStaticQuery(graphql`
    query FiltersTaxaQuery {
      taxa: allMongodbAiidprodTaxa(filter: { namespace: { in: ["CSETv1", "CSETv0", "GMF"] } }) {
        nodes {
          namespace
          field_list {
            short_name
          }
        }
      }
    }
  `);

  const firstRow = REFINEMENT_LISTS.slice(0, 5);

  return (
    <>
      {REFINEMENT_LISTS.map((list, i) => {
        const secondRowNotExpanded = !expandFilters && !firstRow.includes(list);

        const isFirstFew = i < 2;

        let className = 'flex-0-0-auto px-1 order-4 w-full md:w-1/2 xl:w-1/5';

        if (list.hidden) {
          className += ' hidden';
        }
        if (!expandFilters && !isFirstFew) {
          className += ' 3xl:hidden';
        }
        if (secondRowNotExpanded) {
          className += ' hidden';
        }
        if (isFirstFew && !expandFilters) {
          className += ' 3xl:order-1 3xl:w-[unset]';
        }
        return (
          <div key={list.attribute} className={className} data-cy={list.attribute}>
            <Filter className="w-full" type={list.type} taxa={taxa} {...list} />
          </div>
        );
      })}
    </>
  );
}

export default Filters;
