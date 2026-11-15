import { gql } from '../../server/generated';

export const SEMANTIC_SEARCH = gql(`
  query SemanticSearch($query: String!, $limit: Int) {
    semanticSearch(query: $query, limit: $limit) {
      status
      results {
        score
        incident {
          incident_id
          title
          date
          description
        }
        image {
          cloudinary_id
          image_url
        }
      }
    }
  }
`);
