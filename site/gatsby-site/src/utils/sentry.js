import * as Sentry from '@sentry/react';

const environment = process.env.GATSBY_SENTRY_ENVIRONMENT || 'development';

const release = process.env.GATSBY_SENTRY_RELEASE || process.env.GATSBY_COMMIT_SHA;

if (typeof window !== 'undefined' && process.env.GATSBY_SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.GATSBY_SENTRY_DSN,
    environment,
    release,
    integrations: [
      Sentry.browserTracingIntegration({
        // Set tracing origins to connect frontend with backend
        tracingOrigins: [
          'localhost',
          process.env.GATSBY_SITE_URL || 'https://incidentdatabase.ai',
          /^https:\/\/[a-z0-9-]+\.netlify\.app/,
          /^https:\/\/[a-z0-9-]+\.netlifly\.live/,
          /\/api\/graphql/,
          /\/api\/semanticallyRelated/,
          /\/netlify\/functions/,
        ],
      }),
    ],
    // Performance Monitoring
    tracesSampleRate: 1.0,
    // Session Replay
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // Debug mode for development
    debug: true, //environment === 'development',
    // Before sending error, filter out some common non-critical errors
    beforeSend(event) {
      // Filter out GraphQL network errors that are handled by the app
      if (event.exception?.values?.[0]?.value?.includes('NetworkError')) {
        return null;
      }
      // Filter out Gatsby development errors
      if (
        event.tags?.environment === 'development' &&
        event.exception?.values?.[0]?.value?.includes('webpackHotUpdate')
      ) {
        return null;
      }
      return event;
    },
  });
}

export default Sentry;
