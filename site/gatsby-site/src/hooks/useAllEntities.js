import { graphql, useStaticQuery } from 'gatsby';

// Every incident and entity page resolves entity ids to names with the full
// entity list. As a static query Gatsby writes the list once, under
// page-data/sq/d, instead of repeating it in the page-data.json of each of
// those pages, and a change to the list no longer rewrites every one of them.
export default function useAllEntities() {
  const { allMongodbAiidprodEntities } = useStaticQuery(graphql`
    query AllEntitiesStaticQuery {
      allMongodbAiidprodEntities {
        nodes {
          entity_id
          name
        }
      }
    }
  `);

  return allMongodbAiidprodEntities;
}
