# Sentry Integration

This document provides technical configuration details for Sentry error tracking and performance monitoring in the AIID project.

## Architecture Overview

The project implements Sentry across multiple environments:
- **Frontend (Gatsby/React)**: Browser-side error tracking and performance monitoring
- **Backend (Netlify Functions)**: Serverless function monitoring and tracing
- **Build Process**: Source map upload and release management

## Dependencies

### NPM Packages
```json
{
  "@sentry/react": "^9.40.0",
  "@sentry/aws-serverless": "^8.54.0", 
  "@sentry/webpack-plugin": "^4.0.0"
}
```

## Environment Variables

### Frontend (Gatsby)
```bash
GATSBY_SENTRY_DSN=https://your-dsn@sentry.io/project-id
GATSBY_SENTRY_ENVIRONMENT=development|staging|production
GATSBY_SENTRY_RELEASE=commit-sha-or-version
GATSBY_COMMIT_SHA=git-commit-hash
```

### Backend (Netlify Functions)
```bash
SENTRY_DSN=https://your-dsn@sentry.io/project-id
SENTRY_ENVIRONMENT=development|staging|production
SENTRY_RELEASE=commit-sha-or-version
```

### Build Process
```bash
SENTRY_AUTH_TOKEN=your-auth-token
SENTRY_ORG=your-organization-slug
SENTRY_PROJECT=your-project-slug
```

## Configuration Files

### Frontend Configuration
**Location**: [`site/gatsby-site/src/utils/sentry.js`](../gatsby-site/src/utils/sentry.js)

This file initializes Sentry for the React/Gatsby frontend with browser tracing, session replay, and error filtering.

### Backend Configuration  
**Location**: [`site/gatsby-site/sentry-instrumentation.ts`](../gatsby-site/sentry-instrumentation.ts)

Contains the Sentry initialization for serverless functions and the `withSentry` wrapper for instrumenting Netlify Functions.

## Integration Points

### 1. Gatsby Browser Initialization
**Location**: [`site/gatsby-site/gatsby-browser.js`](../gatsby-site/gatsby-browser.js)

Sentry is automatically initialized when the application loads by importing the sentry utility.

### 2. Apollo GraphQL Integration
**Location**: [`site/gatsby-site/src/contexts/UserContext.tsx`](../gatsby-site/src/contexts/UserContext.tsx)

### 3. GraphQL Server Plugin
**Location**: [`site/gatsby-site/netlify/functions/graphql.ts`](../gatsby-site/netlify/functions/graphql.ts)

### 4. Netlify Function Wrapping
Usage in function files:

```typescript
import { withSentry } from '../../sentry-instrumentation';

const handler = async (event: HandlerEvent) => {
  // Your function logic
};

export { withSentry(handler) as handler };
```

## Build Configuration

### Webpack Plugin
**Location**: [`site/gatsby-site/gatsby-node.js`](../gatsby-site/gatsby-node.js)

The Gatsby build process includes Sentry webpack plugin configuration for source map upload and release management during production builds.

## Deployment Configuration

### GitHub Actions
Environment variables are configured in GitHub repository settings:

**Secrets:**
- `SENTRY_AUTH_TOKEN`: Authentication token for Sentry CLI

**Variables:**
- `SENTRY_ORG`: Organization slug
- `SENTRY_PROJECT`: Project slug  
- `SENTRY_DSN`: Data Source Name URL

## Development Setup

### 1. Environment Configuration
Make sure that you have the following environment variables on your `.env` file:

```bash
GATSBY_SENTRY_DSN=your-dsn-here
GATSBY_SENTRY_ENVIRONMENT=development
SENTRY_DSN=your-dsn-here
SENTRY_ENVIRONMENT=development
```

### 2. Production Build
For source map upload, ensure build environment has:

```bash
SENTRY_AUTH_TOKEN=your-token
SENTRY_ORG=your-org
SENTRY_PROJECT=your-project
```

## Features Enabled

- **Error Tracking**: Automatic exception capture
- **Performance Monitoring**: Transaction tracing (100% sample rate)
- **Session Replay**: 10% normal sessions, 100% error sessions
- **GraphQL Tracing**: Request/response monitoring
- **Source Maps**: Automatic upload and cleanup
- **Release Management**: Git commit-based releases
- **Environment Segregation**: Separate environments for dev/staging/prod

## Error Filtering

Configured filters prevent noise:
- GraphQL NetworkError exceptions (handled by app)
- Gatsby development hot-reload errors
- Environment-specific debug filtering

## Troubleshooting

### Common Issues

1. **Source maps not uploaded**: Verify `SENTRY_AUTH_TOKEN` and build-time environment variables
2. **No events in Sentry**: Check DSN configuration and network connectivity
3. **GraphQL traces missing**: Ensure Apollo plugin is registered
4. **Function errors not captured**: Verify `withSentry` wrapper is applied

### Debug Mode
Enable debug logging by setting environment to `development` or `staging`. 