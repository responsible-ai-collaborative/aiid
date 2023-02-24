import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const SORTING_LIST = [
  {
    default: true,
    name: 'relevance',
    value: 'instant_search-{{locale}}',
    label: 'Relevance',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    division: true,
  },
  {
    name: 'incident-date-desc',
    value: 'instant_search-{{locale}}_epoch_incident_date_desc',
    label: 'Newest Incident Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
  },
  {
    name: 'incident-date-asc',
    value: 'instant_search-{{locale}}_epoch_incident_date_asc',
    label: 'Oldest Incident Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
    division: true,
  },
  {
    name: 'published-date-desc',
    value: 'instant_search-{{locale}}_epoch_date_published_desc',
    label: 'Newest Published Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
  },
  {
    name: 'published-date-asc',
    value: 'instant_search-{{locale}}_epoch_date_published_asc',
    label: 'Oldest Published Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
    division: true,
  },
  {
    name: 'submitted-date-desc',
    value: 'instant_search-{{locale}}_epoch_date_submitted_desc',
    label: 'Newest Submitted Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
  },
  {
    name: 'submitted-date-asc',
    value: 'instant_search-{{locale}}_epoch_date_submitted_asc',
    label: 'Oldest Submitted Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
  },
];

export default SORTING_LIST;
