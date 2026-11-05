import { graphql, useStaticQuery } from 'gatsby';

// The taxonomy definitions that the classification editor and display need.
// They are the same on every incident and report page, so a static query keeps
// one copy under page-data/sq/d instead of several hundred kilobytes in each of
// those pages' page-data.json files.
export default function useTaxa() {
  const { allMongodbAiidprodTaxa } = useStaticQuery(graphql`
    query TaxaStaticQuery {
      allMongodbAiidprodTaxa {
        nodes {
          id
          namespace
          weight
          description
          complete_entities
          automatedClassifications
          dummy_fields {
            field_number
            short_name
          }
          field_list {
            field_number
            short_name
            short_description
            long_description
            display_type
            permitted_values
            weight
            public
            complete_from {
              all
              current
              entities
            }
            subfields {
              field_number
              short_name
              short_description
              long_description
              display_type
              permitted_values
              weight
              public
              complete_from {
                all
                current
                entities
              }
            }
          }
        }
      }
    }
  `);

  return allMongodbAiidprodTaxa;
}
