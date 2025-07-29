# Component Reference Guide

This guide provides detailed documentation for the key components used in the AIID frontend application. For architectural patterns, state management, and development guidelines, see [Frontend Documentation](./FRONTEND.md).

## Table of Contents

- [UI Components](#ui-components)
- [Skeleton Components](#skeleton-components)
- [Form Components](#form-components)
- [Discovery Components](#discovery-components)
- [Citation Components](#citation-components)
- [Taxonomy Components](#taxonomy-components)
- [Entity Components](#entity-components)
- [Visualization Components](#visualization-components)
- [Internationalization Components](#internationalization-components)
- [Layout Components](#layout-components)
- [Blog Components](#blog-components)
- [Landing Components](#landing-components)
- [Reports Components](#reports-components)
- [Checklists Components](#checklists-components)
- [Variants Components](#variants-components)
- [Users Components](#users-components)
- [Classifications Components](#classifications-components)
- [Leaderboards Components](#leaderboards-components)
- [Authentication Components](#authentication-components)
- [Documentation Components](#documentation-components)
- [Utility Components](#utility-components)
- [Component Implementation Patterns](#component-implementation-patterns)

## UI Components

### MdxComponents

Custom MDX components for rendering documentation content.

**Location**: `src/components/ui/MdxComponents.js`

**Usage**:
```javascript
import { MDXProvider } from '@mdx-js/react';
import Components from 'components/ui/MdxComponents';

<MDXProvider components={Components}>
  {children}
</MDXProvider>
```

**Available Components**:
- `h1`, `h2`, `h3`, `h4`, `h5`, `h6` - Headings with automatic ID generation
- `Details` - Expandable details/summary component
- `SensitiveImage` - Image component with sensitivity warnings
- `Button` - Custom button component
- `Box` - Styled blockquote component
- `Float` - Right-floating content component

### Header

Main site header with navigation and user authentication.

**Location**: `src/components/ui/Header.js`

**Props**:
- `location` - Current page location object

**Usage**:
```javascript
import Header from 'components/ui/Header';

<Header location={location} />
```

### Table

Data table component with sorting and pagination capabilities.

**Location**: `src/components/ui/Table.js`

**Props**:
- `data` - Array of data objects
- `columns` - Column configuration array
- `sortable` - Enable sorting (default: true)
- `pagination` - Enable pagination (default: true)
- `pageSize` - Number of items per page (default: 10)

**Usage**:
```javascript
import Table from 'components/ui/Table';

const columns = [
  { Header: 'Title', accessor: 'title' },
  { Header: 'Date', accessor: 'date' }
];

<Table data={incidents} columns={columns} />
```

### SocialShareButtons

Social media sharing functionality.

**Location**: `src/components/ui/SocialShareButtons.js`

**Props**:
- `url` - URL to share
- `title` - Title of content to share
- `description` - Description of content

**Usage**:
```javascript
import SocialShareButtons from 'components/ui/SocialShareButtons';

<SocialShareButtons 
  url="https://incidentdatabase.ai/cite/123"
  title="AI Incident Report"
  description="Check out this AI incident report"
/>
```

### Loader

Loading spinner component.

**Location**: `src/components/ui/Loader.js`

**Props**:
- `size` - Size of loader (default: 'md')
- `color` - Color of loader (default: 'blue')

**Usage**:
```javascript
import Loader from 'components/ui/Loader';

<Loader size="lg" color="green" />
```

## Skeleton Components

Skeleton components provide loading placeholders that mimic the structure of the actual content, improving perceived performance and user experience.

### DefaultSkeleton

Basic text skeleton with multiple lines of varying widths.

**Location**: `src/elements/Skeletons/Default/index.js`

**Props**: None

**Usage**:
```javascript
import DefaultSkeleton from 'elements/Skeletons/Default';

<DefaultSkeleton />
```

**Features**:
- Animated pulse effect
- Multiple text lines with varying widths
- Dark mode support
- Screen reader accessible

### CardSkeleton

Card-style skeleton with optional image, text, and avatar sections.

**Location**: `src/elements/Skeletons/Card/index.js`

**Props**:
- `className` - Additional CSS classes (default: '')
- `text` - Show text skeleton lines (default: true)
- `lines` - Number of text lines to show (default: 3)
- `image` - Show image placeholder (default: true)
- `avatar` - Show avatar placeholder (default: false)
- `maxWidthSmall` - Apply max-width constraint (default: true)
- `style` - Inline styles object

**Usage**:
```javascript
import CardSkeleton from 'elements/Skeletons/Card';

// Basic card skeleton
<CardSkeleton />

// Card with avatar and custom lines
<CardSkeleton 
  avatar={true}
  lines={5}
  image={false}
/>

// Custom styled card
<CardSkeleton 
  className="my-4"
  style={{ maxWidth: '400px' }}
/>
```

**Features**:
- Configurable image placeholder with icon
- Adjustable text line count
- Optional avatar section
- Responsive design
- Dark mode support

### ImageSkeleton

Image placeholder skeleton with icon.

**Location**: `src/elements/Skeletons/Image/index.js`

**Props**: None

**Usage**:
```javascript
import ImageSkeleton from 'elements/Skeletons/Image';

<ImageSkeleton />
```

**Features**:
- Image placeholder with gallery icon
- Responsive layout
- Dark mode support
- Test ID for automated testing

### ListSkeleton

List-style skeleton with multiple items.

**Location**: `src/elements/Skeletons/List/index.js`

**Props**: None

**Usage**:
```javascript
import ListSkeleton from 'elements/Skeletons/List';

<ListSkeleton />
```

**Features**:
- Multiple list items with titles and descriptions
- Consistent spacing and layout
- Dark mode support
- Responsive design

#### Custom Skeleton Styling
Apply custom styles to match your design:

```javascript
<CardSkeleton 
  className="bg-white shadow-lg rounded-lg"
  style={{ 
    minHeight: '200px',
    border: '1px solid #e5e7eb'
  }}
/>
```

### Skeleton Best Practices

1. **Match Content Structure**: Use skeletons that closely resemble the actual content layout
2. **Consistent Timing**: Show skeletons for a minimum time to avoid flickering
3. **Accessibility**: All skeletons include proper ARIA attributes and screen reader text
4. **Dark Mode**: Skeletons automatically adapt to dark mode
5. **Performance**: Skeletons are lightweight and don't impact bundle size significantly
6. **Testing**: Use test IDs for automated testing of loading states

### Link

Custom link component with i18n support.

**Location**: `src/components/ui/Link.js`

**Props**:
- `to` - Destination URL
- `children` - Link content
- `className` - Additional CSS classes

**Usage**:
```javascript
import Link from 'components/ui/Link';

<Link to="/incidents/123" className="text-blue-600">
  View Incident
</Link>
```

### DateLabel

Date formatting component.

**Location**: `src/components/ui/DateLabel.js`

**Props**:
- `date` - Date string or Date object
- `format` - Date format (optional)

**Usage**:
```javascript
import DateLabel from 'components/ui/DateLabel';

<DateLabel date="2023-01-15" />
```

## Form Components

### TextInputGroup

Text input with validation and error handling.

**Location**: `src/components/forms/TextInputGroup.js`

**Props**:
- `name` - Field name for formik
- `label` - Input label
- `placeholder` - Placeholder text
- `required` - Required field indicator
- `type` - Input type (default: 'text')
- `disabled` - Disable input
- `className` - Additional CSS classes

**Usage**:
```javascript
import TextInputGroup from 'components/forms/TextInputGroup';

<TextInputGroup
  name="title"
  label="Incident Title"
  placeholder="Enter incident title"
  required
/>
```

### TagsInputGroup

Tag input component for multiple values.

**Location**: `src/components/forms/TagsInputGroup.js`

**Props**:
- `name` - Field name for formik
- `label` - Input label
- `placeholder` - Placeholder text
- `suggestions` - Array of suggested tags
- `maxTags` - Maximum number of tags allowed

**Usage**:
```javascript
import TagsInputGroup from 'components/forms/TagsInputGroup';

<TagsInputGroup
  name="tags"
  label="Tags"
  placeholder="Add tags"
  suggestions={['AI', 'Machine Learning', 'Safety']}
  maxTags={10}
/>
```

### FlowbiteSearchInput

Search input using Flowbite components.

**Location**: `src/components/forms/FlowbiteSearchInput.js`

**Props**:
- `placeholder` - Placeholder text
- `onChange` - Change handler function
- `value` - Input value
- `disabled` - Disable input
- `className` - Additional CSS classes

**Usage**:
```javascript
import FlowbiteSearchInput from 'components/forms/FlowbiteSearchInput';

<FlowbiteSearchInput
  placeholder="Search incidents..."
  onChange={handleSearch}
  value={searchTerm}
/>
```

### Label

Form label component.

**Location**: `src/components/forms/Label.js`

**Props**:
- `htmlFor` - ID of associated input
- `children` - Label text
- `required` - Required field indicator
- `className` - Additional CSS classes

**Usage**:
```javascript
import Label from 'components/forms/Label';

<Label htmlFor="title" required>
  Incident Title
</Label>
```

### SubmitButton

Form submission button.

**Location**: `src/components/forms/SubmitButton.js`

**Props**:
- `loading` - Show loading state
- `disabled` - Disable button
- `children` - Button text
- `className` - Additional CSS classes

**Usage**:
```javascript
import SubmitButton from 'components/forms/SubmitButton';

<SubmitButton loading={isSubmitting}>
  Submit Incident
</SubmitButton>
```

### IncidentReportForm

Complete incident report form.

**Location**: `src/components/forms/IncidentReportForm.js`

**Props**:
- `initialValues` - Initial form values
- `onSubmit` - Form submission handler
- `loading` - Loading state
- `incident` - Existing incident data (for editing)

**Usage**:
```javascript
import IncidentReportForm from 'components/forms/IncidentReportForm';

<IncidentReportForm
  initialValues={{
    title: '',
    description: '',
    date: ''
  }}
  onSubmit={handleSubmit}
  loading={isSubmitting}
/>
```

### QuickAddForm

Quick incident addition form.

**Location**: `src/components/forms/QuickAddForm.js`

**Props**:
- `onSubmit` - Form submission handler
- `loading` - Loading state

**Usage**:
```javascript
import QuickAddForm from 'components/forms/QuickAddForm';

<QuickAddForm
  onSubmit={handleQuickAdd}
  loading={isSubmitting}
/>
```

## Discovery Components

### Discover

Main discovery page component with search functionality.

**Location**: `src/components/discover/Discover.js`

**Props**:
- `location` - Current page location

**Usage**:
```javascript
import Discover from 'components/discover/Discover';

<Discover location={location} />
```

### SearchBox

Search input component for discovery.

**Location**: `src/components/discover/SearchBox.js`

**Props**: None (uses Algolia InstantSearch)

**Usage**:
```javascript
import SearchBox from 'components/discover/SearchBox';

<SearchBox />
```

### Hits

Search results display component.

**Location**: `src/components/discover/Hits.js`

**Props**: None (uses Algolia InstantSearch)

**Usage**:
```javascript
import Hits from 'components/discover/Hits';

<Hits />
```

### Controls

Search filters and controls.

**Location**: `src/components/discover/Controls.js`

**Props**: None (uses Algolia InstantSearch)

**Usage**:
```javascript
import Controls from 'components/discover/Controls';

<Controls />
```

### Pagination

Search results pagination.

**Location**: `src/components/discover/Pagination.js`

**Props**: None (uses Algolia InstantSearch)

**Usage**:
```javascript
import Pagination from 'components/discover/Pagination';

<Pagination />
```

## Citation Components

### CitationFormat

Citation generation component.

**Location**: `src/components/cite/CitationFormat.js`

**Props**:
- `incidentReports` - Array of incident reports
- `incident` - Incident data

**Usage**:
```javascript
import CitationFormat from 'components/cite/CitationFormat';

<CitationFormat
  incidentReports={reports}
  incident={incident}
/>
```

### BibTex

BibTeX citation format component.

**Location**: `src/components/cite/BibTex.js`

**Props**:
- `nodes` - Report nodes
- `incidentDate` - Incident date
- `incident_id` - Incident ID
- `incidentTitle` - Incident title
- `editors` - Incident editors

**Usage**:
```javascript
import BibTex from 'components/cite/BibTex';

<BibTex
  nodes={reports}
  incidentDate="2023-01-15"
  incident_id={123}
  incidentTitle="AI Incident Report"
  editors={["John Doe"]}
/>
```

## Taxonomy Components

### FacetTaxonomyPage

Taxonomy page with facet filtering.

**Location**: `src/components/taxa/FacetTaxonomyPage.js`

**Props**:
- `pageContext` - Page context data
- `data` - GraphQL data

**Usage**:
```javascript
import FacetTaxonomyPage from 'components/taxa/FacetTaxonomyPage';

<FacetTaxonomyPage
  pageContext={pageContext}
  data={data}
/>
```

## Entity Components

### EntityCard

Entity display card component.

**Location**: `src/components/entities/EntityCard.js`

**Props**:
- `entity` - Entity data object
- `showRelationships` - Show entity relationships
- `className` - Additional CSS classes

**Usage**:
```javascript
import EntityCard from 'components/entities/EntityCard';

<EntityCard
  entity={entity}
  showRelationships={true}
/>
```

## Visualization Components

### LocationMap

Geographic location visualization.

**Location**: `src/components/visualizations/LocationMap.js`

**Props**:
- `geocodes` - Array of geographic coordinates
- `height` - Map height
- `width` - Map width

**Usage**:
```javascript
import LocationMap from 'components/visualizations/LocationMap';

<LocationMap
  geocodes={[
    { lat: 40.7128, lng: -74.0060, title: "New York" }
  ]}
  height={400}
  width={600}
/>
```

## Internationalization Components

### TranslationBadge

Badge indicating AI-translated content.

**Location**: `src/components/i18n/TranslationBadge.js`

**Props**:
- `className` - Additional CSS classes

**Usage**:
```javascript
import TranslationBadge from 'components/i18n/TranslationBadge';

<TranslationBadge className="ml-2" />
```

## Layout Components

### Layout

Main layout wrapper component.

**Location**: `src/components/Layout.js`

**Props**:
- `children` - Page content
- `className` - Additional CSS classes
- `sidebarCollapsed` - Initial sidebar state
- `location` - Current page location

**Usage**:
```javascript
import Layout from 'components/Layout';

<Layout
  sidebarCollapsed={false}
  location={location}
>
  <PageContent />
</Layout>
```

### Sidebar

Main navigation sidebar.

**Location**: `src/components/sidebar/index.js`

**Props**:
- `defaultCollapsed` - Initial collapsed state
- `location` - Current page location

**Usage**:
```javascript
import Sidebar from 'components/sidebar';

<Sidebar
  defaultCollapsed={false}
  location={location}
/>
```

## Blog Components

### BlogPost

Blog post display component.

**Location**: `src/components/blog/BlogPost.js`

**Props**:
- `post` - Blog post data
- `location` - Current page location

**Usage**:
```javascript
import BlogPost from 'components/blog/BlogPost';

<BlogPost
  post={postData}
  location={location}
/>
```

## Landing Components

### Featured

Featured content display component.

**Location**: `src/components/landing/Featured.js`

**Props**: None

**Usage**:
```javascript
import Featured from 'components/landing/Featured';

<Featured />
```

### Leaderboards

Submission leaderboard component.

**Location**: `src/components/landing/Leaderboards.js`

**Props**: None

**Usage**:
```javascript
import Leaderboards from 'components/landing/Leaderboards';

<Leaderboards />
```

### Sponsors

Sponsors display component.

**Location**: `src/components/landing/Sponsors.js`

**Props**: None

**Usage**:
```javascript
import Sponsors from 'components/landing/Sponsors';

<Sponsors />
```

## Reports Components

### ReportCard

Report display card component.

**Location**: `src/components/reports/ReportCard.js`

**Props**:
- `report` - Report data object
- `showActions` - Show action buttons (default: true)
- `className` - Additional CSS classes

**Usage**:
```javascript
import ReportCard from 'components/reports/ReportCard';

<ReportCard
  report={reportData}
  showActions={true}
/>
```

### ReportsTable

Table component for displaying reports.

**Location**: `src/components/reports/ReportsTable.js`

**Props**:
- `reports` - Array of report data
- `columns` - Column configuration
- `sortable` - Enable sorting (default: true)

**Usage**:
```javascript
import ReportsTable from 'components/reports/ReportsTable';

<ReportsTable
  reports={reportsData}
  columns={customColumns}
/>
```

### ReportVersionViewModal

Modal for viewing report versions.

**Location**: `src/components/reports/ReportVersionViewModal.js`

**Props**:
- `report` - Report data
- `isOpen` - Modal open state
- `onClose` - Close handler function

**Usage**:
```javascript
import ReportVersionViewModal from 'components/reports/ReportVersionViewModal';

<ReportVersionViewModal
  report={reportData}
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
/>
```

## Checklists Components

### CheckListForm

Risk assessment checklist form.

**Location**: `src/components/checklists/CheckListForm.js`

**Props**:
- `initialValues` - Initial form values
- `onSubmit` - Form submission handler
- `loading` - Loading state

**Usage**:
```javascript
import CheckListForm from 'components/checklists/CheckListForm';

<CheckListForm
  initialValues={checklistData}
  onSubmit={handleSubmit}
  loading={isSubmitting}
/>
```

### RiskSection

Risk assessment section component.

**Location**: `src/components/checklists/RiskSection.js`

**Props**:
- `section` - Risk section data
- `onChange` - Change handler function
- `disabled` - Disable editing

**Usage**:
```javascript
import RiskSection from 'components/checklists/RiskSection';

<RiskSection
  section={riskSectionData}
  onChange={handleSectionChange}
  disabled={false}
/>
```

### ChecklistsIndex

Main checklists index page component.

**Location**: `src/components/checklists/ChecklistsIndex.js`

**Props**: None

**Usage**:
```javascript
import ChecklistsIndex from 'components/checklists/ChecklistsIndex';

<ChecklistsIndex />
```

## Variants Components

### VariantList

List of incident variants.

**Location**: `src/components/variants/VariantList.js`

**Props**:
- `variants` - Array of variant data
- `onSelect` - Selection handler function

**Usage**:
```javascript
import VariantList from 'components/variants/VariantList';

<VariantList
  variants={variantsData}
  onSelect={handleVariantSelect}
/>
```

### VariantForm

Form for creating/editing variants.

**Location**: `src/components/variants/VariantForm.js`

**Props**:
- `variant` - Existing variant data (for editing)
- `onSubmit` - Form submission handler
- `loading` - Loading state

**Usage**:
```javascript
import VariantForm from 'components/variants/VariantForm';

<VariantForm
  variant={existingVariant}
  onSubmit={handleSubmit}
  loading={isSubmitting}
/>
```

### VariantsTable

Table component for displaying variants.

**Location**: `src/components/variants/VariantsTable.js`

**Props**:
- `variants` - Array of variant data
- `onEdit` - Edit handler function
- `onDelete` - Delete handler function

**Usage**:
```javascript
import VariantsTable from 'components/variants/VariantsTable';

<VariantsTable
  variants={variantsData}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

## Users Components

### UsersTable

Table component for displaying users.

**Location**: `src/components/users/UsersTable.js`

**Props**:
- `users` - Array of user data
- `onEdit` - Edit handler function
- `onDelete` - Delete handler function

**Usage**:
```javascript
import UsersTable from 'components/users/UsersTable';

<UsersTable
  users={usersData}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### UserDetails

User details display component.

**Location**: `src/components/users/UserDetails.js`

**Props**:
- `user` - User data object
- `showActions` - Show action buttons

**Usage**:
```javascript
import UserDetails from 'components/users/UserDetails';

<UserDetails
  user={userData}
  showActions={true}
/>
```

### UserEditModal

Modal for editing user information.

**Location**: `src/components/users/UserEditModal.js`

**Props**:
- `user` - User data
- `isOpen` - Modal open state
- `onClose` - Close handler function
- `onSave` - Save handler function

**Usage**:
```javascript
import UserEditModal from 'components/users/UserEditModal';

<UserEditModal
  user={userData}
  isOpen={modalOpen}
  onClose={() => setModalOpen(false)}
  onSave={handleSave}
/>
```

## Classifications Components

### CsetTable

CSET taxonomy classification table.

**Location**: `src/components/classifications/CsetTable.js`

**Props**:
- `classifications` - Array of classification data
- `onUpdate` - Update handler function

**Usage**:
```javascript
import CsetTable from 'components/classifications/CsetTable';

<CsetTable
  classifications={classificationsData}
  onUpdate={handleUpdate}
/>
```

## Leaderboards Components

### Leaderboard

Generic leaderboard component.

**Location**: `src/components/leaderboards/Leaderboard.js`

**Props**:
- `data` - Leaderboard data
- `title` - Leaderboard title
- `type` - Leaderboard type

**Usage**:
```javascript
import Leaderboard from 'components/leaderboards/Leaderboard';

<Leaderboard
  data={leaderboardData}
  title="Top Contributors"
  type="submitters"
/>
```

### SubmittersLeaderboard

Submitters leaderboard component.

**Location**: `src/components/leaderboards/SubmittersLeaderboard.js`

**Props**: None

**Usage**:
```javascript
import SubmittersLeaderboard from 'components/leaderboards/SubmittersLeaderboard';

<SubmittersLeaderboard />
```

## Authentication Components

### LoginSignup

Authentication component for login and signup.

**Location**: `src/components/loginSignup/index.js`

**Props**:
- `mode` - 'login' or 'signup'
- `onSuccess` - Success callback function

**Usage**:
```javascript
import LoginSignup from 'components/loginSignup';

<LoginSignup
  mode="login"
  onSuccess={handleAuthSuccess}
/>
```

## Documentation Components

### PrismicDocPost

Prismic documentation post component.

**Location**: `src/components/doc/PrismicDocPost.js`

**Props**:
- `post` - Prismic post data
- `location` - Current page location

**Usage**:
```javascript
import PrismicDocPost from 'components/doc/PrismicDocPost';

<PrismicDocPost
  post={prismicPostData}
  location={location}
/>
```

## Utility Components

### PlaceholderImage

Placeholder image component.

**Location**: `src/components/PlaceholderImage.js`

**Props**:
- `width` - Image width
- `height` - Image height
- `alt` - Alt text
- `className` - Additional CSS classes

**Usage**:
```javascript
import PlaceholderImage from 'components/PlaceholderImage';

<PlaceholderImage
  width={300}
  height={200}
  alt="Placeholder"
/>
```

### TaxonomyGraphCarousel

Carousel for taxonomy graph visualization.

**Location**: `src/components/TaxonomyGraphCarousel.js`

**Props**:
- `data` - Taxonomy graph data
- `onSelect` - Selection handler function

**Usage**:
```javascript
import TaxonomyGraphCarousel from 'components/TaxonomyGraphCarousel';

<TaxonomyGraphCarousel
  data={taxonomyData}
  onSelect={handleSelect}
/>
```

### HeadContent

Head content management component.

**Location**: `src/components/HeadContent.js`

**Props**:
- `title` - Page title
- `description` - Page description
- `keywords` - Page keywords

**Usage**:
```javascript
import HeadContent from 'components/HeadContent';

<HeadContent
  title="Page Title"
  description="Page description"
  keywords="keyword1, keyword2"
/>
```

### UserSubscriptions

User subscriptions management component.

**Location**: `src/components/UserSubscriptions.js`

**Props**:
- `user` - User data
- `onUpdate` - Update handler function

**Usage**:
```javascript
import UserSubscriptions from 'components/UserSubscriptions';

<UserSubscriptions
  user={userData}
  onUpdate={handleUpdate}
/>
```

### RelatedIncidents

Related incidents display component.

**Location**: `src/components/RelatedIncidents.js`

**Props**:
- `incident` - Current incident data
- `limit` - Maximum number of related incidents to show

**Usage**:
```javascript
import RelatedIncidents from 'components/RelatedIncidents';

<RelatedIncidents
  incident={incident}
  limit={5}
/>
```

### SemanticallyRelatedIncidents

Semantically related incidents component.

**Location**: `src/components/SemanticallyRelatedIncidents.js`

**Props**:
- `incident` - Current incident data
- `limit` - Maximum number of related incidents to show

**Usage**:
```javascript
import SemanticallyRelatedIncidents from 'components/SemanticallyRelatedIncidents';

<SemanticallyRelatedIncidents
  incident={incident}
  limit={5}
/>
```

### ReadMoreText

Expandable text component.

**Location**: `src/components/ReadMoreText.js`

**Props**:
- `text` - Text content
- `maxLength` - Maximum visible length
- `className` - Additional CSS classes

**Usage**:
```javascript
import ReadMoreText from 'components/ReadMoreText';

<ReadMoreText
  text="Long text content..."
  maxLength={200}
/>
```

### SimilaritySelector

Similarity selection component.

**Location**: `src/components/SimilaritySelector.js`

**Props**:
- `options` - Similarity options
- `onSelect` - Selection handler function
- `value` - Current value

**Usage**:
```javascript
import SimilaritySelector from 'components/SimilaritySelector';

<SimilaritySelector
  options={similarityOptions}
  onSelect={handleSelect}
  value={currentValue}
/>
```

### Outline

Content outline component.

**Location**: `src/components/Outline.js`

**Props**:
- `items` - Outline items
- `onSelect` - Selection handler function

**Usage**:
```javascript
import Outline from 'components/Outline';

<Outline
  items={outlineItems}
  onSelect={handleSelect}
/>
```

### WordList

Word list display component.

**Location**: `src/components/WordList.js`

**Props**:
- `words` - Array of words
- `onSelect` - Selection handler function

**Usage**:
```javascript
import WordList from 'components/WordList';

<WordList
  words={wordArray}
  onSelect={handleSelect}
/>
```

## Component Implementation Patterns

### Toast Notifications

Use toast context for user feedback:

```javascript
const MyComponent = () => {
  const addToast = useToastContext();

  const handleSuccess = () => {
    addToast({
      message: 'Operation completed successfully',
      severity: SEVERITY.SUCCESS
    });
  };

  return <button onClick={handleSuccess}>Submit</button>;
};
```

For more information about state management, architectural patterns, and development guidelines, see [Frontend Documentation](./FRONTEND.md). 