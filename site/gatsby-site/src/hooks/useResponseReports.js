import { graphql, useStaticQuery } from 'gatsby';

// The report numbers tagged as responses, used to tell responses apart from
// incident reports when computing an incident's entities. Shared by every
// incident and entity page, so it is a static query stored once rather than a
// copy in each page's page-data.json.
export default function useResponseReports() {
  const { allMongodbAiidprodReports } = useStaticQuery(graphql`
    query ResponseReportsStaticQuery {
      allMongodbAiidprodReports(filter: { tags: { in: ["response"] } }) {
        nodes {
          report_number
        }
      }
    }
  `);

  return allMongodbAiidprodReports;
}
