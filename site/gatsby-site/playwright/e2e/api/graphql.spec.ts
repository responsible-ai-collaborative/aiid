import { expect } from '@playwright/test';
import { test } from '../../utils'
import { ApolloClient, HttpLink, InMemoryCache, gql } from '@apollo/client/core';
import fetch from 'cross-fetch';

test.describe('/api/graphql endpoint', () => {

    test('Endpoint should work', async ({ baseURL }) => {
        const client = new ApolloClient({
            link: new HttpLink({
                uri: `${baseURL}/api/graphql`,
                fetch,
            }),
            cache: new InMemoryCache(),
        });

        const result = await client.query({
            query: gql`
        query {
          reports {
            title
            report_number
          }
        }
      `});

        expect(result.data.reports).not.toBeNull();
    });

    test('Should fetch reports', async ({ baseURL }) => {
        const client = new ApolloClient({
            link: new HttpLink({
                uri: `${baseURL}/api/graphql`,
                fetch,
            }),
            cache: new InMemoryCache(),
        });

        const result = await client.query({
            query: gql`
            query {
                reports {
                    title
                    report_number
                }
            }`,
        });

        expect(result.data.reports.length).toBeGreaterThanOrEqual(8);
    });
});