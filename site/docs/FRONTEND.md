# Frontend

## Overview

The AIID frontend is built with **Gatsby** and **React**, using **Tailwind CSS** and **Flowbite** for styling. The application follows a component-based architecture with centralized state management through React Context.

## Technology Stack

- **Framework**: Gatsby (React-based static site generator)
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

### Component Categories

#### UI Components (`src/components/ui/`)
Reusable components used throughout the application:

- **MdxComponents**: Custom MDX components for documentation
- **Header**: Main site header with navigation
- **Table**: Data table component with sorting and pagination
- **SocialShareButtons**: Social media sharing functionality
- **Loader**: Loading spinner component
- **Link**: Custom link component with i18n support
- **DateLabel**: Date formatting component

#### Form Components (`src/components/forms/`)
Form-related components and validation:

- **TextInputGroup**: Text input with validation
- **TagsInputGroup**: Tag input component
- **FlowbiteSearchInput**: Search input using Flowbite
- **Label**: Form label component
- **SubmitButton**: Form submission button
- **IncidentReportForm**: Complete incident report form
- **QuickAddForm**: Quick incident addition form

#### Discovery Components (`src/components/discover/`)
Search and discovery functionality:

- **Discover**: Main discovery page component
- **SearchBox**: Search input component
- **Hits**: Search results display
- **Controls**: Search filters and controls
- **Pagination**: Search results pagination

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
More specifically, we base our components on [Flowbite React](https://flowbite-react.com/) and [Flowbite](https://flowbite.com/) which is built on top of TailwindCSS.

### Development Steps

In order to keep styling consistency on the site, we follow a set of steps when developing. This is also to make the development process more agile and simple.

1. Develop your component using [Flowbite React components](https://flowbite-react.com/)
2. If your components is not fully contemplated by Flowbite react, check [Flowbite components](https://flowbite.com/#components) and use the provided HTMLs.
3. If you need to improve styling, use only Tailwind CSS classes.

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

### Translation Badge

Use the `TranslationBadge` component to indicate AI-translated content:

```javascript
import TranslationBadge from 'components/i18n/TranslationBadge';

<TranslationBadge className="ml-2" />
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

### Custom Form Components

#### TextInputGroup
Text input with validation and error handling:

```javascript
import TextInputGroup from 'components/forms/TextInputGroup';

<TextInputGroup
  name="title"
  label="Title"
  placeholder="Enter incident title"
  required
/>
```

#### TagsInputGroup
Tag input component for multiple values:

```javascript
import TagsInputGroup from 'components/forms/TagsInputGroup';

<TagsInputGroup
  name="tags"
  label="Tags"
  placeholder="Add tags"
/>
```

#### FlowbiteSearchInput
Search input using Flowbite components:

```javascript
import FlowbiteSearchInput from 'components/forms/FlowbiteSearchInput';

<FlowbiteSearchInput
  placeholder="Search incidents..."
  onChange={handleSearch}
/>
```

## Component Development Guidelines

### Creating New Components

1. **Choose the right directory** based on component purpose
2. **Use TypeScript** for new components when possible
3. **Follow naming conventions**:
   - Components: PascalCase (e.g., `IncidentCard.js`)
   - Files: PascalCase for components, camelCase for utilities
4. **Add PropTypes or TypeScript interfaces** for props
5. **Include JSDoc comments** for complex components

### Component Structure

```javascript
import React from 'react';
import PropTypes from 'prop-types';

/**
 * Component description
 * @param {Object} props - Component props
 * @param {string} props.title - Component title
 * @returns {JSX.Element} Component JSX
 */
const MyComponent = ({ title, children }) => {
  return (
    <div className="my-component">
      <h2>{title}</h2>
      {children}
    </div>
  );
};

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node
};

export default MyComponent;
```

### Testing Components

#### Unit Testing
Use Jest and React Testing Library for component tests:

```javascript
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component with title', () => {
  render(<MyComponent title="Test Title" />);
  expect(screen.getByText('Test Title')).toBeInTheDocument();
});
```

#### E2E Testing
Use Playwright for end-to-end testing:

```javascript
import { test, expect } from '@playwright/test';

test('user can submit incident', async ({ page }) => {
  await page.goto('/apps/submit');
  await page.fill('[name="title"]', 'Test Incident');
  await page.click('[type="submit"]');
  await expect(page.locator('.success-message')).toBeVisible();
});
```

## Performance Optimization

### Code Splitting
Use dynamic imports for large components:

```javascript
const LazyComponent = React.lazy(() => import('./LazyComponent'));

<Suspense fallback={<Loader />}>
  <LazyComponent />
</Suspense>
```

### Memoization
Use React.memo for expensive components:

```javascript
const ExpensiveComponent = React.memo(({ data }) => {
  // Component logic
});
```

### Bundle Size
- Use tree shaking for imports
- Avoid importing entire libraries
- Use dynamic imports for large dependencies

## Accessibility (a11y)

### ARIA Attributes
Use proper ARIA attributes for accessibility:

```javascript
<button
  aria-label="Close modal"
  aria-expanded={isExpanded}
  onClick={handleClick}
>
  Close
</button>
```

### Keyboard Navigation
Ensure all interactive elements are keyboard accessible:

```javascript
<div
  role="button"
  tabIndex={0}
  onKeyDown={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  }}
  onClick={handleClick}
>
  Clickable div
</div>
```

### Screen Reader Support
Use semantic HTML and proper heading structure:

```javascript
<main>
  <h1>Page Title</h1>
  <section aria-labelledby="section-title">
    <h2 id="section-title">Section Title</h2>
    <p>Content</p>
  </section>
</main>
```

## Error Handling

### Error Boundaries
Use error boundaries to catch component errors:

```javascript
import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary fallback={<ErrorFallback />}>
  <MyComponent />
</ErrorBoundary>
```

### Toast Notifications
Use the toast context for user feedback:

```javascript
const addToast = useToastContext();

try {
  await submitData();
  addToast({
    message: 'Data submitted successfully',
    severity: SEVERITY.SUCCESS
  });
} catch (error) {
  addToast({
    message: 'Failed to submit data',
    severity: SEVERITY.ERROR,
    error
  });
}
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

## Development Workflow

### Environment Setup
1. Install dependencies: `npm install`
2. Set up environment variables in `.env`
3. Start development server: `npm run start`

### Code Quality
- Use ESLint for code linting
- Use Prettier for code formatting
- Run tests before committing: `npm test`

### Component Review Process
1. Create component following guidelines
2. Add tests for new functionality
3. Update documentation if needed
4. Submit pull request for review
