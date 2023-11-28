import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client';
import { conditionalIt } from '../../../support/utils';

describe('/api/graphql endpoint', () => {
  it.skip('Endpoint should work', async () => {
    const client = new ApolloClient({
      link: new HttpLink({
        uri: `/api/graphql`,
      }),
      cache: new InMemoryCache(),
    });

    const result = await client.query({
      query: gql`
        {
          reports {
            title
            report_number
          }
        }
      `,
    });

    expect(result.data.reports).to.be.not.null;
  });

  conditionalIt.skip(!Cypress.env('isEmptyEnvironment'), 'Should fetch reports', async () => {
    const client = new ApolloClient({
      link: new HttpLink({
        uri: `/api/graphql`,
      }),
      cache: new InMemoryCache(),
    });

    const result = await client.query({
      query: gql`
        {
          reports {
            title
            report_number
          }
        }
      `,
    });

    expect(result.data.reports.length).to.be.at.least(10);
  });
});
