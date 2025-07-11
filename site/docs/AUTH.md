# Authentication System Documentation

## Overview

The AIID project uses **NextAuth.js** for authentication with a **passwordless email-based flow**. The system is deployed on Netlify using serverless functions and stores user data in MongoDB.

## Architecture

### Core Components
- **NextAuth.js** - Authentication library
- **MongoDB** - Two databases: `auth` (NextAuth data) and `customData` (user profiles/roles)
- **Netlify Functions** - Serverless authentication endpoint at `/api/auth/*`
- **React Context** - Frontend state management for user sessions

### Key Files
```
nextauth.config.ts           # NextAuth configuration
netlify/functions/auth.ts    # Serverless auth endpoint
src/contexts/UserContext.tsx # React context for user state
server/rules.ts             # GraphQL authorization rules
```

## Authentication Flow

### 1. Magic Link Authentication
The system uses **passwordless authentication** with magic links:

1. User enters email on login/signup page
2. System checks if user exists in `auth.users` collection
3. Sends appropriate email template:
   - **Existing users**: "Login" template
   - **New users**: "Signup" template
4. User clicks magic link → redirects to `/magic-link` interstitial page
5. Link expires after **24 hours**

### Magic Link Interstitial Page
The `/magic-link` interstitial page serves as a critical security layer. Instead of sending the NextAuth URL directly in emails, the system:

1. **Wraps the actual auth URL** in an interstitial page URL
2. **Protects against automated tools** like corporate email security scanners that automatically visit links
3. **Prevents token consumption** by security tools that would invalidate the magic link before the user clicks it
4. **Requires user interaction** to proceed to the actual authentication

This prevents scenarios where:
- Corporate email security tools visit the magic link automatically
- Link scanning services consume the one-time token
- Users receive an "already used" error when they actually try to authenticate

### 2. Email Templates
- **Login**: "Secure link to log in to AIID" 
- **Signup**: "Secure link to create your AIID account"
- Both redirect through `/magic-link?link=<encoded_url>` for security

### 3. User Creation Flow
When a new user signs up:
1. NextAuth creates user in `auth.users` collection
2. `createUser` event triggers creation of profile in `customData.users`
3. New users get default role: `['subscriber']`

## Database Schema

### Auth Database (`auth`)
- `users` - NextAuth user records (id, email, emailVerified)
- `sessions` - Active user sessions
- `verification_tokens` - Email verification tokens

### Custom Data Database (`customData`)
- `users` - User profiles and roles
  ```typescript
  {
    userId: string,        // Links to auth.users.id
    roles: string[],       // User roles array
    first_name?: string,
    last_name?: string,
    createdAt: Date
  }
  ```

## User Roles & Permissions

### Available Roles
- `admin` - Full system access (overrides all other permissions)
- `subscriber` - Can subscribe to incidents, entities, reports
- `submitter` - Can submit incidents
- `incident_editor` - Can edit incidents
- `taxonomy_editor` - Can edit taxonomies
- `taxonomy_editor_{name}` - Can edit specific taxonomy

### Authorization Rules
Authorization is enforced at the GraphQL layer using `graphql-shield`:

```typescript
// Basic role check
isRole('admin')           // Admin access
isRole('subscriber')      // Subscriber access

// Ownership checks
isSelf()                  // User can only access their own data
isSubscriptionOwner()     // User can only access their subscriptions
isChecklistsOwner()       // User can only access their checklists

// Special rules
notQueriesAdminData()     // Prevents querying admin-only fields
hasHeaderSecret()         // Requires secret header for certain operations
```

## Session Management

### Configuration
```typescript
session: {
  maxAge: 5 * 24 * 60 * 60,    // 5 days
  updateAge: 24 * 60 * 60       // 24 hours
}
```

### Session Enrichment
The `session` callback enriches user data by:
1. Looking up user in `customData.users` by `userId`
2. Adding roles, first_name, last_name to session
3. Making this data available to frontend via `useSession()`

## Frontend Integration

### UserContext
The `UserContext` provides authentication state and helpers:

```typescript
const { user, loading, isRole, isAdmin, actions } = useUserContext();

// Check roles
const canEdit = isRole('incident_editor');
const hasAdminAccess = isAdmin;

// Authentication actions
await actions.logIn(email, callbackUrl);
await actions.signUp(email, callbackUrl);
await actions.logOut();
```

### GraphQL Integration
The UserContext also provides an Apollo Client configured to work with the authenticated GraphQL API at `/api/graphql`.

## Security Features

### Anti-Enumeration Protection
The sign-in callback prevents email enumeration attacks:
- Unverified users attempting login are redirected to verify-request page
- Same flow for both verified and unverified emails
- No information leaked about email verification status

### Email Verification
- New users must verify their email before accessing the system
- `operation` parameter differentiates between login and signup flows
- Unverified users see consistent behavior regardless of email status

### Authorization Layers
1. **NextAuth Session** - Basic authentication
2. **GraphQL Shield** - Field-level authorization
3. **Role-based Access** - Granular permissions
4. **Ownership Validation** - Users can only access their own data

## Environment Variables

Required configuration:
```bash
NEXTAUTH_URL=https://incidentdatabase.ai
NEXTAUTH_SECRET=<jwt-signing-secret>
API_MONGODB_CONNECTION_STRING=<mongodb-connection>
MAILERSEND_API_KEY=<email-service-key>
SITE_URL=https://incidentdatabase.ai
```

## Pages

### Authentication Pages
- `/login` - Login form
- `/logout` - Logout confirmation
- `/verify-request` - Email verification confirmation
- `/account` - New user account setup
- `/auth-error` - Authentication error handling
- `/magic-link` - Magic link redirect handler

## Development Notes

### Testing Authentication
- Debug mode enabled for localhost development
- Sentry integration for error tracking
- Custom error handling for authentication failures

### Migration from MongoDB Realm
The system previously used MongoDB Realm and has migration logic for existing users. The current NextAuth implementation is the active authentication system.

## Common Issues

1. **Email not received** - Check MAILERSEND_API_KEY configuration
2. **Session expired** - Sessions last 5 days, check session configuration
3. **Role not recognized** - Verify role exists in `customData.users.roles` array
4. **GraphQL authorization error** - Check user roles match required permissions in `server/rules.ts`