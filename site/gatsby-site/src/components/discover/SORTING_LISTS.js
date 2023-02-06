import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

const SORTING_LIST = [
  {
    default: true,
    name: 'relevance',
    value: 'instant_search-en',
    label: 'Relevance',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
  },
  {
    name: 'incident-date',
    value: 'instant_search-en_epoch_incident_date',
    label: 'Incident Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
  },
  {
    name: 'published-date',
    value: 'instant_search-en_epoch_date_published',
    label: 'Published Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
  },
  {
    name: 'submitted-date',
    value: 'instant_search-en_epoch_date_submitted',
    label: 'Submitted Date',
    faIcon: faCalendarAlt,
    faClasses: 'far fa-calendar-alt',
    type: 'date',
  },
];

export default SORTING_LIST;
