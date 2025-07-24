import React from 'react';
import { Button } from 'flowbite-react';
import * as Sentry from '@sentry/react';
import { useApolloClient } from '@apollo/client';
import { gql } from 'graphql-tag';

const TEST_QUERY = gql`
  query TestSentryTracing {
    incidents(pagination: { limit: 1 }) {
      incident_id
      title
    }
  }
`;

const SentryTestButton = () => {
  const client = useApolloClient();

  const testFrontendError = () => {
    Sentry.captureException(new Error('Test frontend error for Sentry'));
  };

  const testBackendTrace = async () => {
    try {
      // This will create a trace that should propagate to the backend
      const result = await client.query({
        query: TEST_QUERY,
        errorPolicy: 'all',
      });

      Sentry.addBreadcrumb({
        message: 'GraphQL query completed',
        category: 'test',
        level: 'info',
        data: { resultCount: result.data?.incidents?.length || 0 },
      });

      console.log('Test GraphQL query result:', result);
    } catch (error) {
      Sentry.captureException(error, {
        tags: { test: 'backend-trace' },
        extra: { query: 'TEST_QUERY' },
      });
    }
  };

  const testPerformanceTrace = () => {
    const transaction = Sentry.startTransaction({ name: 'test-performance' });

    Sentry.withScope((scope) => {
      scope.setSpan(transaction);

      // Simulate some work
      setTimeout(() => {
        const childSpan = transaction.startChild({ op: 'test-operation' });

        setTimeout(() => {
          childSpan.finish();
          transaction.finish();
        }, 100);
      }, 50);
    });
  };

  // Only show in development
  // if (process.env.NODE_ENV !== 'development') {
  //   return null;
  // }

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border z-50">
      <h3 className="text-sm font-bold mb-2">Sentry Test Controls</h3>
      <div className="flex flex-col gap-2">
        <Button size="sm" color="red" onClick={testFrontendError}>
          Test Frontend Error
        </Button>
        <Button size="sm" color="blue" onClick={testBackendTrace}>
          Test Backend Trace
        </Button>
        <Button size="sm" color="green" onClick={testPerformanceTrace}>
          Test Performance
        </Button>
      </div>
    </div>
  );
};

export default SentryTestButton;
