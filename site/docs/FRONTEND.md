# Frontend

## Overview

The AIID frontend is built with **Gatsby** and **React**, using **Tailwind CSS** and **Flowbite** for styling.

## Technology Stack

- **Framework**: GatsbyJS
- **Styling**: Tailwind CSS with Flowbite React components
- **State Management**: React Context API
- **Authentication**: NextAuth.js with passwordless email flow
- **Data Fetching**: Apollo Client for GraphQL
- **Internationalization**: react-i18next
- **Testing**: Playwright for E2E, Jest for unit tests

## Component Architecture

### Directory Structure

```
src/components/
├── ui/                    # Reusable UI components
├── forms/                 # Form components and validation
├── discover/              # Search and discovery components
├── incidents/             # Incident-specific components
├── submissions/           # Submission workflow components
├── reports/               # Report management components
├── checklists/            # Risk assessment and checklist components
├── variants/              # Incident variant management components
├── users/                 # User management components
├── classifications/       # Taxonomy classification components
├── leaderboards/          # Leaderboard and ranking components
├── loginSignup/           # Authentication components
├── doc/                   # Documentation and Prismic components
├── images/                # Image and icon components
├── cite/                  # Citation and reference components
├── taxa/                  # Taxonomy-related components
├── entities/              # Entity management components
├── visualizations/        # Data visualization components
├── i18n/                  # Internationalization components
├── blog/                  # Blog-related components
├── layout/                # Layout components
├── sidebar/               # Sidebar components
└── landing/               # Landing page components
```

You can view reusable components in the `src/components/` folder, organized by functionality (UI, forms, discovery, reports, etc.).

## State Management

### Context Providers

The application uses React Context for state management across different areas:

#### UserContext (`src/contexts/UserContext.tsx`)
Manages user authentication and profile data.

```typescript
const { user, loading, isRole, isAdmin, actions } = useUserContext();

// Check user roles
isRole('incident_editor')  // Role check
isAdmin                    // Admin check

// Authentication actions
actions.logIn(email, callbackUrl)
actions.signUp(email, callbackUrl)
actions.logOut()
```

**Available Roles:**
- `subscriber` - Can subscribe to incidents, entities, reports
- `submitter` - Can submit incidents
- `incident_editor` - Can edit incidents
- `taxonomy_editor` - Can edit taxonomies
- `admin` - Full system access

#### LayoutContext (`src/contexts/LayoutContext.js`)
Manages layout state including right sidebar.

```javascript
const { rightSidebar, displayRightSidebar } = useLayoutContext();

// Display content in right sidebar
displayRightSidebar(<YourComponent />);
```

#### ToastContext (`src/contexts/ToastContext.js`)
Manages notification toasts throughout the application.

```javascript
const addToast = useToastContext();

// Show different types of toasts
addToast({
  message: 'Success message',
  severity: SEVERITY.SUCCESS
});

addToast({
  message: 'Error message',
  severity: SEVERITY.ERROR,
  error: new Error('Something went wrong')
});
```

**Toast Severity Levels:**
- `SEVERITY.SUCCESS` - Green success toast
- `SEVERITY.ERROR` - Red error toast
- `SEVERITY.WARNING` - Yellow warning toast
- `SEVERITY.INFO` - Blue info toast

#### MenuContext (`src/contexts/MenuContext.js`)
Manages sidebar collapse/expand state.

```javascript
const { isCollapsed, toggleCollapsed } = useMenuContext();
```

## Data Integration

### GraphQL Integration
Components use Apollo Client for GraphQL data fetching:

```javascript
import { useQuery } from '@apollo/client';

const { data, loading, error } = useQuery(GET_INCIDENTS);
```

### MongoDB Integration
Data is fetched from MongoDB collections through GraphQL resolvers:

- **incidents**: Main incident collection
- **reports**: Incident reports
- **classifications**: Taxonomy classifications
- **entities**: Organizations and individuals
- **submissions**: User submissions

### Algolia Search Integration
Search functionality is powered by Algolia:

```javascript
import algoliasearch from 'algoliasearch/lite';

const searchClient = algoliasearch(
  config.header.search.algoliaAppId,
  config.header.search.algoliaSearchKey
);
```

## Styling Guidelines

### Tailwind CSS & Flowbite

This project uses [Tailwind CSS](https://tailwindcss.com/) framework with its class syntax.
More specifically, this project also uses [Flowbite React](https://flowbite-react.com/) and [Flowbite](https://flowbite.com/) which is built on top of TailwindCSS. However, the use of those libraries is not mandatory and Tailwind classes can be used directly on custom components.

### How to use Flowbite React and Flowbite

You can use Flowbite React's components directly, but if you need a more customized component you can use Flowbite's components code and classes, examples below. Here are basic steps to help you develop.

1. Develop your component using [Flowbite React components](https://flowbite-react.com/)
2. If your components is not fully contemplated by Flowbite react, check [Flowbite components](https://flowbite.com/#components) and use the provided HTMLs.
3. If you need to improve styling, use Tailwind CSS classes.

**Examples**
If you want to place a new [Flowbite React button](https://flowbite-react.com/buttons):

```javascript
import { Button } from "flowbite-react";

const YourComponent = () => {
  return <Button color="success">New button</Button>;
};
```

If you want to customize a [Flowbite button](https://flowbite.com/docs/components/buttons/):

```javascript
const YourComponent = () => {
  return (
    <button
      type="button"
      className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800"
    >
      Default
    </button>
  );
};
```

### Custom CSS Classes

The application uses several custom CSS classes:

- `tw-layout` - Main layout container
- `tw-side-bar-title` - Sidebar title styling
- `tw-toast` - Toast notification styling
- `prose` - Typography styling for content
- `titleWrapper` - Page title wrapper

### Dark Mode Support

Dark mode is implemented using Tailwind's dark mode classes:

```javascript
className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
```

## Internationalization (i18n)

### Translation Components

The application uses react-i18next for internationalization:

```javascript
import { Trans, useTranslation } from 'react-i18next';

// Using Trans component
<Trans>Welcome to AIID</Trans>

// Using useTranslation hook
const { t } = useTranslation();
t('welcome.message')
```

### Language Configuration

Supported languages are configured in `i18n/config.json`:

```json
{
  "code": "en",
  "hrefLang": "en",
  "name": "English",
  "localName": "English",
  "langDir": "ltr",
  "dateFormat": "MM/DD/YYYY"
}
```

## Form Components & Validation

### Form Validation

Forms use Formik for validation and state management:

```javascript
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  title: Yup.string().required('Title is required'),
  description: Yup.string().min(10, 'Description must be at least 10 characters')
});
```

## Performance Optimization

### Memoization
Use React.memo for expensive components:

```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  // Expensive rendering logic
  return <div>{/* Component content */}</div>;
});
```

## Integration with External Services

### Algolia Search
Search components integrate with Algolia:

```javascript
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch';

<InstantSearch searchClient={searchClient} indexName="incidents">
  <SearchBox />
  <Hits />
</InstantSearch>
```

### Cloudinary
Image components use Cloudinary for optimization:

```javascript
import { Cloudinary } from '@cloudinary/url-gen';

const cld = new Cloudinary({
  cloud: {
    cloudName: 'your-cloud-name'
  }
});
```

### Rollbar
Error tracking is integrated with Rollbar:

```javascript
import Rollbar from 'rollbar';

if ('Rollbar' in window && error) {
  Rollbar.error(error);
}
```

## Development Patterns

### Loading States
Implement loading states for async operations:

```javascript
const MyComponent = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  if (loading) {
    return <Loader />;
  }

  return <div>{/* Component content */}</div>;
};
```
